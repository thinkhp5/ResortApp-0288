import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { clientIp, rateLimit } from "../lib/rate-limit";

export const enquiries = {
  create: base
    .input(
      z.object({
        name: z.string().trim().min(2).max(120),
        email: z.string().trim().email(),
        subject: z.string().trim().max(120).optional(),
        message: z.string().trim().min(5).max(4000),
      }),
    )
    .handler(async ({ input, context }) => {
      if (!rateLimit(`enq:${clientIp(context.headers)}`, 6, 10 * 60_000))
        throw new ORPCError("TOO_MANY_REQUESTS", { message: "Too many requests — please try again shortly." });
      const [row] = await db.insert(schema.enquiries).values(input).returning({ id: schema.enquiries.id });
      return { id: row!.id };
    }),
};
