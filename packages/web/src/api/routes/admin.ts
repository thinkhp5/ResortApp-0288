import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { and, count, desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { adminBase, checkAdminPassword, issueAdminToken } from "../lib/admin-auth";
import { addMessage, getConversation, listMessages, setMode } from "../lib/chat-store";
import { clientIp, rateLimit } from "../lib/rate-limit";

export const admin = {
  login: base
    .input(z.object({ password: z.string().min(1), name: z.string().trim().min(1).max(40) }))
    .handler(async ({ input, context }) => {
      if (!rateLimit(`login:${clientIp(context.headers)}`, 10, 10 * 60_000))
        throw new ORPCError("TOO_MANY_REQUESTS", { message: "Too many attempts. Try again in a few minutes." });
      if (!checkAdminPassword(input.password)) throw new ORPCError("UNAUTHORIZED", { message: "Incorrect password." });
      return { token: issueAdminToken(input.name), name: input.name };
    }),

  me: adminBase.handler(({ context }) => context.staff),

  stats: adminBase.handler(async () => {
    const [waiting] = await db
      .select({ n: count() })
      .from(schema.conversations)
      .where(and(eq(schema.conversations.needsAttention, true), eq(schema.conversations.status, "open")));
    const [newBookings] = await db.select({ n: count() }).from(schema.bookings).where(eq(schema.bookings.status, "new"));
    const [openEnq] = await db.select({ n: count() }).from(schema.enquiries).where(eq(schema.enquiries.handled, false));
    const [totalConv] = await db.select({ n: count() }).from(schema.conversations);
    return { waiting: waiting!.n, newBookings: newBookings!.n, openEnquiries: openEnq!.n, conversations: totalConv!.n };
  }),

  conversations: adminBase
    .input(z.object({ filter: z.enum(["all", "human", "waiting", "closed"]).default("all") }))
    .handler(async ({ input }) => {
      const c = schema.conversations;
      const where =
        input.filter === "human"
          ? and(eq(c.mode, "human"), eq(c.status, "open"))
          : input.filter === "waiting"
            ? and(eq(c.needsAttention, true), eq(c.status, "open"))
            : input.filter === "closed"
              ? eq(c.status, "closed")
              : undefined;
      return db.select().from(c).where(where).orderBy(desc(c.updatedAt)).limit(100);
    }),

  conversation: adminBase
    .input(z.object({ id: z.string(), afterId: z.number().int().min(0).default(0) }))
    .handler(async ({ input }) => {
      const conv = await getConversation(input.id);
      if (!conv) throw new ORPCError("NOT_FOUND", { message: "Conversation not found" });
      if (conv.staffUnread > 0)
        await db.update(schema.conversations).set({ staffUnread: 0 }).where(eq(schema.conversations.id, input.id));
      const messages = await listMessages(input.id, input.afterId);
      const bookings = await db.select().from(schema.bookings).where(eq(schema.bookings.conversationId, input.id));
      return { conversation: conv, messages, bookings };
    }),

  reply: adminBase
    .input(z.object({ id: z.string(), text: z.string().trim().min(1).max(4000) }))
    .handler(async ({ input, context }) => {
      const conv = await getConversation(input.id);
      if (!conv) throw new ORPCError("NOT_FOUND", { message: "Conversation not found" });
      if (conv.mode !== "human" || conv.needsAttention) {
        const joined = conv.mode !== "human" || (await listMessages(conv.id)).every((m) => m.role !== "staff");
        await setMode(conv.id, "human", false);
        if (joined) await addMessage(conv.id, { role: "system", content: `${context.staff.name} from the Lūana Kai team joined the chat.` });
      }
      return addMessage(conv.id, { role: "staff", content: input.text, authorName: context.staff.name });
    }),

  setMode: adminBase
    .input(z.object({ id: z.string(), mode: z.enum(["ai", "human"]) }))
    .handler(async ({ input, context }) => {
      const conv = await getConversation(input.id);
      if (!conv) throw new ORPCError("NOT_FOUND", { message: "Conversation not found" });
      if (conv.mode === input.mode) return { ok: true };
      await setMode(conv.id, input.mode, false);
      await addMessage(conv.id, {
        role: "system",
        content:
          input.mode === "ai"
            ? "You're back with Leilani, our digital concierge."
            : `${context.staff.name} from the Lūana Kai team joined the chat.`,
      });
      return { ok: true };
    }),

  setStatus: adminBase
    .input(z.object({ id: z.string(), status: z.enum(["open", "closed"]) }))
    .handler(async ({ input }) => {
      await db
        .update(schema.conversations)
        .set({ status: input.status, needsAttention: false })
        .where(eq(schema.conversations.id, input.id));
      return { ok: true };
    }),

  bookings: adminBase
    .input(z.object({ status: z.enum(["all", "new", "confirmed", "declined", "cancelled"]).default("all") }))
    .handler(({ input }) =>
      db
        .select()
        .from(schema.bookings)
        .where(input.status === "all" ? undefined : eq(schema.bookings.status, input.status))
        .orderBy(desc(schema.bookings.createdAt))
        .limit(200),
    ),

  updateBooking: adminBase
    .input(z.object({ id: z.number().int(), status: z.enum(["new", "confirmed", "declined", "cancelled"]) }))
    .handler(async ({ input }) => {
      await db.update(schema.bookings).set({ status: input.status }).where(eq(schema.bookings.id, input.id));
      return { ok: true };
    }),

  enquiries: adminBase.handler(() =>
    db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).limit(200),
  ),

  markEnquiry: adminBase
    .input(z.object({ id: z.number().int(), handled: z.boolean() }))
    .handler(async ({ input }) => {
      await db.update(schema.enquiries).set({ handled: input.handled }).where(eq(schema.enquiries.id, input.id));
      return { ok: true };
    }),
};
