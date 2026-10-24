import { createHmac, timingSafeEqual } from "node:crypto";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";

const SECRET = () => process.env.BETTER_AUTH_SECRET || "luana-kai-dev-secret";
const TTL_MS = 1000 * 60 * 60 * 12; // 12h staff session

function sign(payload: string) {
  return createHmac("sha256", SECRET()).update(payload).digest("base64url");
}

export function issueAdminToken(staffName: string) {
  const payload = Buffer.from(JSON.stringify({ n: staffName, exp: Date.now() + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | null | undefined): { name: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { name: String(data.n || "Staff") };
  } catch {
    return null;
  }
}

export function checkAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Procedures built off this require a valid `x-admin-token` header. */
export const adminBase = base.use(({ context, next }) => {
  const staff = verifyAdminToken(context.headers.get("x-admin-token"));
  if (!staff) throw new ORPCError("UNAUTHORIZED", { message: "Staff session expired. Please sign in again." });
  return next({ context: { staff } });
});
