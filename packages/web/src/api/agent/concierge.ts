import { stepCountIs, streamText, tool, type ModelMessage } from "ai";
import dedent from "dedent";
import { z } from "zod";
import { gateway } from "./gateway";
import { DINING, EXPERIENCES, OFFERS, POLICIES, RESORT, ROOMS, SPA } from "../../shared/resort";
import { createBooking, validateStay } from "../lib/booking";
import { addMessage, setMode, type ChatCard, type ChatMessage } from "../lib/chat-store";

const MODEL = "anthropic/claude-haiku-4.5";

function knowledgeBase() {
  const rooms = ROOMS.map(
    (r) =>
      `- ${r.name} [slug: ${r.slug}] (${r.category}) — from $${r.rate}/night, ${r.size}, sleeps ${r.guests}, ${r.bed}, ${r.view}. ${r.description} Amenities: ${r.amenities.join(", ")}.`,
  ).join("\n");
  const dining = DINING.map((d) => `- ${d.name} (${d.type}) — ${d.hours}. ${d.description} ${d.highlights.join("; ")}.`).join("\n");
  const spa = SPA.treatments.map((t) => `- ${t.name}, ${t.duration}, $${t.price}: ${t.description}`).join("\n");
  const exp = EXPERIENCES.map((e) => `- ${e.name} (${e.duration}, $${e.price}/person): ${e.description}`).join("\n");
  const offers = OFFERS.map((o) => `- ${o.name} [slug: ${o.slug}] (${o.nights}, ${o.perk}): ${o.description}`).join("\n");
  const faq = POLICIES.map((p) => `- ${p.q} ${p.a}`).join("\n");
  return dedent`
    RESORT: ${RESORT.fullName}, ${RESORT.location}. Address: ${RESORT.address}. Phone ${RESORT.phone}. Email ${RESORT.email}.
    Airport: ${RESORT.airport}. Check-in ${RESORT.checkIn}, check-out ${RESORT.checkOut}.

    ROOMS & VILLAS:
    ${rooms}

    DINING:
    ${dining}

    SPA — ${SPA.name} (${SPA.hours}): ${SPA.description}
    ${spa}
    Wellness: ${SPA.wellness.join("; ")}.

    EXPERIENCES:
    ${exp}

    OFFERS & PACKAGES:
    ${offers}

    POLICIES & FAQ:
    ${faq}

    LOCAL AREA (Kauaʻi north shore): Hanalei town is 5 minutes away (shops, shave ice, farmers market Saturdays 9 AM). Kēʻē Beach and the Kalalau Trailhead require advance Hāʻena State Park reservations. Princeville golf is 15 minutes. Tunnels Beach is great for snorkeling in summer; winter (Nov–Mar) brings big surf on the north shore and humpback whales offshore. Weather: 75–85°F year-round; winter is wetter. Encourage reef-safe sunscreen and respecting kapu (restricted) areas.

    SITE PAGES: /rooms, /rooms/<slug>, /dining, /spa, /experiences, /offers, /gallery, /contact, /book (booking request form, accepts ?room=<slug>).
  `;
}

function systemPrompt() {
  const today = new Date().toISOString().slice(0, 10);
  return dedent`
    You are Leilani, the digital concierge for ${RESORT.fullName}. Today is ${today}.
    Voice: warm, gracious and concise — like a seasoned luxury concierge. Use a light touch of Hawaiian ("aloha", "mahalo") but never overdo it. Use short paragraphs; markdown **bold** and simple bullet lists are allowed — never use tables, headings or code blocks. Keep replies under ~120 words unless the guest asks for detail.

    Only state facts found in the knowledge base below. If you don't know (e.g. live availability, specific staff, medical/legal questions), say so and offer to connect them with the team. Never invent prices, policies or inclusions (breakfast, transfers, upgrades) — mention an inclusion only if the knowledge base says that room or offer includes it. Rates are "from" prices before tax (Hawaii taxes ~17.96%).

    Tools:
    - showRooms: whenever you recommend or discuss specific rooms/villas, call it so the guest sees visual cards.
    - showLinks: offer helpful page links (e.g. spa menu, dining, offers).
    - quoteStay: when a guest gives dates + room, get nights and estimated total.
    - createBookingRequest: ONLY after you have collected room, check-in, check-out, adults, children, full name and email AND the guest has explicitly confirmed. Ask for missing details conversationally, one or two at a time. Convert relative dates to YYYY-MM-DD using today's date. Explain it's a request; reservations will confirm availability by email within a few hours.
    - requestHumanAgent: if the guest asks for a person/staff/human, is upset, has a complaint, a special event/wedding, group of more than 8, accessibility needs you can't fully answer, or anything you cannot help with.

    Messages prefixed with [Staff: Name] were written by a human team member earlier in the conversation.

    KNOWLEDGE BASE
    ${knowledgeBase()}
  `;
}

function historyToModel(history: ChatMessage[]): ModelMessage[] {
  const out: ModelMessage[] = [];
  for (const m of history) {
    if (m.role === "system") continue;
    if (m.role === "user") {
      out.push({ role: "user", content: m.content || "(empty)" });
      continue;
    }
    let text = m.role === "staff" ? `[Staff: ${m.authorName ?? "Team"}] ${m.content}` : m.content;
    const cardNotes = m.cards
      .map((c) =>
        c.type === "rooms"
          ? `(showed room cards: ${c.slugs.join(", ")})`
          : c.type === "booking"
            ? `(created booking request ${c.reference})`
            : c.type === "handoff"
              ? "(connected guest to a human team member)"
              : "(shared links)",
      )
      .join(" ");
    if (cardNotes) text = `${text} ${cardNotes}`.trim();
    if (text) out.push({ role: "assistant", content: text });
  }
  // Models require the conversation to start with a user turn.
  while (out.length && out[0]!.role !== "user") out.shift();
  return out;
}

type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "card"; card: ChatCard }
  | { type: "handoff" };

export async function runConcierge(opts: {
  conversationId: string;
  history: ChatMessage[];
  emit: (e: StreamEvent) => void;
}) {
  const { conversationId, emit } = opts;
  const cards: ChatCard[] = [];
  let handedOff = false;
  const slugs = ROOMS.map((r) => r.slug) as [string, ...string[]];

  const tools = {
    showRooms: tool({
      description: "Display visual room/villa cards to the guest.",
      inputSchema: z.object({ slugs: z.array(z.enum(slugs)).min(1).max(6) }),
      execute: async ({ slugs }) => {
        const card: ChatCard = { type: "rooms", slugs };
        cards.push(card);
        emit({ type: "card", card });
        return { shown: slugs };
      },
    }),
    showLinks: tool({
      description: "Display quick-link buttons to pages on the resort website.",
      inputSchema: z.object({
        links: z.array(z.object({ label: z.string().max(40), href: z.string().startsWith("/") })).min(1).max(4),
      }),
      execute: async ({ links }) => {
        const card: ChatCard = { type: "links", links };
        cards.push(card);
        emit({ type: "card", card });
        return { shown: links.length };
      },
    }),
    quoteStay: tool({
      description: "Validate a stay and compute nights and estimated room total (before tax).",
      inputSchema: z.object({
        roomSlug: z.enum(slugs),
        checkIn: z.string().describe("YYYY-MM-DD"),
        checkOut: z.string().describe("YYYY-MM-DD"),
        adults: z.number().int().min(1),
        children: z.number().int().min(0).default(0),
      }),
      execute: async (input) => {
        const v = validateStay(input);
        if ("error" in v) return { ok: false, error: v.error };
        return { ok: true, room: v.room.name, nights: v.nights, nightlyFrom: v.room.rate, estimateBeforeTax: v.estimate };
      },
    }),
    createBookingRequest: tool({
      description: "Create a booking request after the guest confirmed all details.",
      inputSchema: z.object({
        roomSlug: z.enum(slugs),
        checkIn: z.string().describe("YYYY-MM-DD"),
        checkOut: z.string().describe("YYYY-MM-DD"),
        adults: z.number().int().min(1),
        children: z.number().int().min(0).default(0),
        name: z.string(),
        email: z.string(),
        phone: z.string().optional(),
        offerSlug: z.string().optional(),
        notes: z.string().optional(),
      }),
      execute: async (input) => {
        const res = await createBooking(input, "chat", conversationId);
        if (!res.ok) return { ok: false, error: res.error };
        const b = res.booking;
        const card: ChatCard = {
          type: "booking",
          reference: b.reference,
          roomSlug: b.roomSlug,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          nights: b.nights,
          adults: b.adults,
          children: b.children,
          estimate: b.estimate,
          name: b.name,
        };
        cards.push(card);
        emit({ type: "card", card });
        return { ok: true, reference: b.reference, estimate: b.estimate, nights: b.nights };
      },
    }),
    requestHumanAgent: tool({
      description: "Hand the conversation to a human team member. The AI will stop responding afterwards.",
      inputSchema: z.object({ reason: z.string().max(200) }),
      execute: async () => {
        handedOff = true;
        await setMode(conversationId, "human", true);
        const card: ChatCard = { type: "handoff" };
        cards.push(card);
        emit({ type: "card", card });
        return { ok: true, note: "A team member has been notified and will join shortly. Typical reply time 2–5 minutes, 7am–10pm HST." };
      },
    }),
  };

  let text = "";
  try {
    const result = streamText({
      model: gateway(MODEL),
      system: systemPrompt(),
      messages: historyToModel(opts.history),
      tools,
      stopWhen: stepCountIs(6),
      maxOutputTokens: 900,
    });
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        text += part.text;
        emit({ type: "text", delta: part.text });
      } else if (part.type === "error") {
        console.error("[concierge] stream error", part.error);
      }
    }
  } catch (err) {
    console.error("[concierge] failed", err);
  }

  if (!text.trim() && !cards.length) {
    text = "I'm sorry — I'm having trouble answering right now. You can reach our team at " + RESORT.phone + ", or tap **Talk to a person** below.";
    emit({ type: "text", delta: text });
  }

  const saved = await addMessage(conversationId, { role: "assistant", content: text.trim(), cards, authorName: "Leilani" });
  if (handedOff) {
    await addMessage(conversationId, { role: "system", content: "Connecting you with a member of our team…" });
    emit({ type: "handoff" });
  }
  return saved;
}
