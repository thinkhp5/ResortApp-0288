import { z } from "zod";
import type { Context } from "hono";
import { runConcierge } from "./concierge";
import { addMessage, getOrCreateConversation, recentMessages } from "../lib/chat-store";
import { clientIp, rateLimit } from "../lib/rate-limit";

const body = z.object({
  visitorId: z.string().min(8).max(64),
  conversationId: z.string().nullish(),
  text: z.string().trim().min(1).max(2000),
});

/** POST /api/chat/stream — saves the guest message and streams the concierge reply as NDJSON. */
export async function chatStreamHandler(c: Context) {
  const parsed = body.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) return c.json({ error: "Invalid request" }, 400);
  const { visitorId, conversationId, text } = parsed.data;

  const ip = clientIp(c.req.raw.headers);
  if (!rateLimit(`chat:${ip}:${visitorId}`, 25, 10 * 60_000))
    return c.json({ error: "You're sending messages quickly — please wait a moment." }, 429);

  const conv = await getOrCreateConversation(visitorId, conversationId);
  const userMsg = await addMessage(conv.id, { role: "user", content: text }, { bumpUnread: conv.mode === "human" });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      send({ type: "meta", conversationId: conv.id, userMessage: userMsg, mode: conv.mode });
      try {
        if (conv.mode === "ai" && conv.status === "open") {
          const history = await recentMessages(conv.id, 30);
          const saved = await runConcierge({ conversationId: conv.id, history, emit: send });
          send({ type: "done", message: saved });
        } else {
          send({ type: "done", message: null });
        }
      } catch (err) {
        console.error("[chat-stream]", err);
        send({ type: "error", error: "Something went wrong. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-cache, no-transform", "X-Accel-Buffering": "no" },
  });
}
