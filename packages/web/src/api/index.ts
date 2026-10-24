import type { RouterClient } from "@orpc/server";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { chat } from "./routes/chat";
import { bookings } from "./routes/bookings";
import { enquiries } from "./routes/enquiries";
import { admin } from "./routes/admin";
import { chatStreamHandler } from "./agent/chat-stream";

export const router = {
  ping,
  chat,
  bookings,
  enquiries,
  admin,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);
// Streaming concierge reply (NDJSON)
app.post("/api/chat/stream", chatStreamHandler);

export default app;
