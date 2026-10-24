import { z } from "zod";
import { db } from "../database";
import * as schema from "../database/schema";
import { getRoom, OFFERS, ROOMS } from "../../shared/resort";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const bookingInput = z.object({
  roomSlug: z.enum(ROOMS.map((r) => r.slug) as [string, ...string[]]),
  offerSlug: z.string().optional().nullable(),
  checkIn: isoDate,
  checkOut: isoDate,
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(8).default(0),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
});
export type BookingInput = z.infer<typeof bookingInput>;

const DAY = 86_400_000;

export function validateStay(input: Pick<BookingInput, "roomSlug" | "checkIn" | "checkOut" | "adults" | "children">) {
  const room = getRoom(input.roomSlug);
  if (!room) return { error: "Unknown room type." } as const;
  const inD = new Date(`${input.checkIn}T00:00:00Z`).getTime();
  const outD = new Date(`${input.checkOut}T00:00:00Z`).getTime();
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  if (Number.isNaN(inD) || Number.isNaN(outD)) return { error: "Invalid dates." } as const;
  if (inD < today) return { error: "Check-in date is in the past." } as const;
  const nights = Math.round((outD - inD) / DAY);
  if (nights < 1) return { error: "Check-out must be after check-in." } as const;
  if (nights > 30) return { error: "For stays longer than 30 nights please contact reservations." } as const;
  if (input.adults + input.children > room.guests)
    return { error: `${room.name} sleeps up to ${room.guests} guests.` } as const;
  return { room, nights, estimate: nights * room.rate } as const;
}

function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `LK-${s}`;
}

export async function createBooking(input: BookingInput, source: "web" | "chat", conversationId?: string) {
  const v = validateStay(input);
  if ("error" in v) return { ok: false as const, error: v.error };
  const offer = input.offerSlug ? OFFERS.find((o) => o.slug === input.offerSlug) : undefined;
  const [row] = await db
    .insert(schema.bookings)
    .values({
      reference: makeReference(),
      roomSlug: input.roomSlug,
      offerSlug: offer?.slug ?? null,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      nights: v.nights,
      adults: input.adults,
      children: input.children ?? 0,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      notes: input.notes || null,
      estimate: v.estimate,
      source,
      conversationId: conversationId ?? null,
    })
    .returning();
  return { ok: true as const, booking: row!, room: v.room };
}
