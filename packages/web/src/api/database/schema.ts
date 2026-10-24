import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

const now = () => new Date();

export const conversations = sqliteTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    visitorId: text("visitor_id").notNull(),
    guestName: text("guest_name"),
    guestEmail: text("guest_email"),
    /** ai = concierge answers; human = staff handles, AI paused */
    mode: text("mode", { enum: ["ai", "human"] }).notNull().default("ai"),
    status: text("status", { enum: ["open", "closed"] }).notNull().default("open"),
    /** Set when guest asks for a human and no staff reply has been sent yet */
    needsAttention: integer("needs_attention", { mode: "boolean" }).notNull().default(false),
    staffUnread: integer("staff_unread").notNull().default(0),
    lastMessage: text("last_message"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(now),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(now),
  },
  (t) => [index("conv_visitor_idx").on(t.visitorId), index("conv_updated_idx").on(t.updatedAt)],
);

export const messages = sqliteTable(
  "messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    conversationId: text("conversation_id").notNull(),
    role: text("role", { enum: ["user", "assistant", "staff", "system"] }).notNull(),
    content: text("content").notNull().default(""),
    /** JSON array of rich cards rendered in the chat */
    cards: text("cards"),
    authorName: text("author_name"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(now),
  },
  (t) => [index("msg_conv_idx").on(t.conversationId, t.id)],
);

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  roomSlug: text("room_slug").notNull(),
  offerSlug: text("offer_slug"),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  nights: integer("nights").notNull(),
  adults: integer("adults").notNull(),
  children: integer("children").notNull().default(0),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  estimate: integer("estimate").notNull(),
  source: text("source", { enum: ["web", "chat"] }).notNull().default("web"),
  conversationId: text("conversation_id"),
  status: text("status", { enum: ["new", "confirmed", "declined", "cancelled"] }).notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(now),
});

export const enquiries = sqliteTable("enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  handled: integer("handled", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(now),
});
