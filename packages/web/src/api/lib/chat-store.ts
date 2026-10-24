import { and, asc, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "../database";
import * as schema from "../database/schema";

export type ChatCard =
  | { type: "rooms"; slugs: string[] }
  | { type: "booking"; reference: string; roomSlug: string; checkIn: string; checkOut: string; nights: number; adults: number; children: number; estimate: number; name: string }
  | { type: "handoff" }
  | { type: "links"; links: { label: string; href: string }[] };

export type ChatMessage = {
  id: number;
  role: "user" | "assistant" | "staff" | "system";
  content: string;
  cards: ChatCard[];
  authorName: string | null;
  createdAt: Date;
};

export function toChatMessage(row: typeof schema.messages.$inferSelect): ChatMessage {
  let cards: ChatCard[] = [];
  if (row.cards) {
    try {
      cards = JSON.parse(row.cards);
    } catch {
      cards = [];
    }
  }
  return { id: row.id, role: row.role, content: row.content, cards, authorName: row.authorName, createdAt: row.createdAt };
}

export async function getConversation(id: string) {
  const [c] = await db.select().from(schema.conversations).where(eq(schema.conversations.id, id));
  return c;
}

export async function getOrCreateConversation(visitorId: string, conversationId?: string | null) {
  if (conversationId) {
    const c = await getConversation(conversationId);
    if (c && c.visitorId === visitorId) return c;
  }
  const [c] = await db
    .insert(schema.conversations)
    .values({ id: crypto.randomUUID(), visitorId })
    .returning();
  return c!;
}

export async function addMessage(
  conversationId: string,
  msg: { role: ChatMessage["role"]; content: string; cards?: ChatCard[]; authorName?: string | null },
  opts: { bumpUnread?: boolean } = {},
) {
  const [row] = await db
    .insert(schema.messages)
    .values({
      conversationId,
      role: msg.role,
      content: msg.content,
      cards: msg.cards?.length ? JSON.stringify(msg.cards) : null,
      authorName: msg.authorName ?? null,
    })
    .returning();
  const preview = msg.content.slice(0, 160) || (msg.cards?.length ? `[${msg.cards[0]!.type}]` : "");
  await db
    .update(schema.conversations)
    .set({
      updatedAt: new Date(),
      lastMessage: msg.role === "system" ? undefined : preview,
      ...(opts.bumpUnread ? { staffUnread: sql`${schema.conversations.staffUnread} + 1` } : {}),
    })
    .where(eq(schema.conversations.id, conversationId));
  return toChatMessage(row!);
}

export async function listMessages(conversationId: string, afterId = 0) {
  const rows = await db
    .select()
    .from(schema.messages)
    .where(and(eq(schema.messages.conversationId, conversationId), gt(schema.messages.id, afterId)))
    .orderBy(asc(schema.messages.id));
  return rows.map(toChatMessage);
}

export async function recentMessages(conversationId: string, limit = 30) {
  const rows = await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(desc(schema.messages.id))
    .limit(limit);
  return rows.reverse().map(toChatMessage);
}

export async function setMode(conversationId: string, mode: "ai" | "human", needsAttention: boolean) {
  await db
    .update(schema.conversations)
    .set({ mode, needsAttention, updatedAt: new Date() })
    .where(eq(schema.conversations.id, conversationId));
}
