import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { addMessage, getConversation, getOrCreateConversation, listMessages, setMode } from "../lib/chat-store";

const visitor = z.string().min(8).max(64);

async function ownConversation(visitorId: string, id: string) {
  const c = await getConversation(id);
  if (!c || c.visitorId !== visitorId) throw new ORPCError("NOT_FOUND", { message: "Conversation not found" });
  return c;
}

export const chat = {
  history: base
    .input(z.object({ visitorId: visitor, conversationId: z.string(), afterId: z.number().int().min(0).default(0) }))
    .handler(async ({ input }) => {
      const c = await ownConversation(input.visitorId, input.conversationId);
      const messages = await listMessages(c.id, input.afterId);
      return { conversation: { id: c.id, mode: c.mode, status: c.status, guestName: c.guestName }, messages };
    }),

  requestHuman: base
    .input(
      z.object({
        visitorId: visitor,
        conversationId: z.string().nullish(),
        name: z.string().trim().max(80).optional(),
        email: z.string().trim().email().optional().or(z.literal("")),
      }),
    )
    .handler(async ({ input }) => {
      const c = await getOrCreateConversation(input.visitorId, input.conversationId);
      await db
        .update(schema.conversations)
        .set({
          guestName: input.name || c.guestName,
          guestEmail: input.email || c.guestEmail,
          status: "open",
        })
        .where(eq(schema.conversations.id, c.id));
      if (c.mode !== "human") {
        await setMode(c.id, "human", true);
        await addMessage(c.id, { role: "system", content: "Connecting you with a member of our team…" }, { bumpUnread: true });
      }
      return { conversationId: c.id };
    }),

  backToConcierge: base
    .input(z.object({ visitorId: visitor, conversationId: z.string() }))
    .handler(async ({ input }) => {
      const c = await ownConversation(input.visitorId, input.conversationId);
      if (c.mode === "human") {
        await setMode(c.id, "ai", false);
        await addMessage(c.id, { role: "system", content: "You're back with Leilani, our digital concierge." });
      }
      return { ok: true };
    }),
};
