import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { bookingInput, createBooking } from "../lib/booking";
import { clientIp, rateLimit } from "../lib/rate-limit";

export const bookings = {
  create: base.input(bookingInput).handler(async ({ input, context }) => {
    if (!rateLimit(`book:${clientIp(context.headers)}`, 8, 10 * 60_000))
      throw new ORPCError("TOO_MANY_REQUESTS", { message: "Too many requests — please try again shortly." });
    const res = await createBooking(input, "web");
    if (!res.ok) throw new ORPCError("BAD_REQUEST", { message: res.error });
    const b = res.booking;
    return { reference: b.reference, nights: b.nights, estimate: b.estimate, room: res.room.name, checkIn: b.checkIn, checkOut: b.checkOut };
  }),
};
