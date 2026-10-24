import { useCallback, useEffect, useRef, useState } from "react";
import { client } from "../lib/api";
import type { ChatCard, ChatMessage } from "../../api/lib/chat-store";

export type { ChatCard, ChatMessage };

const VISITOR_KEY = "lk_visitor";
const CONV_KEY = "lk_conv";

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

type Draft = { content: string; cards: ChatCard[] } | null;
export type ChatStatus = "idle" | "sending" | "streaming";

function mergeMessages(prev: ChatMessage[], incoming: ChatMessage[]) {
  if (!incoming.length) return prev;
  const map = new Map(prev.filter((m) => m.id > 0).map((m) => [m.id, m]));
  for (const m of incoming) map.set(m.id, { ...m, createdAt: new Date(m.createdAt) });
  const temps = prev.filter((m) => m.id < 0);
  return [...Array.from(map.values()).sort((a, b) => a.id - b.id), ...temps];
}

export function useConciergeChat(isOpen: boolean) {
  const [visitorId] = useState(getVisitorId);
  const [conversationId, setConversationId] = useState<string | null>(() => localStorage.getItem(CONV_KEY));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<"ai" | "human">("ai");
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [draft, setDraft] = useState<Draft>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(!!conversationId);
  const [unread, setUnread] = useState(0);
  const lastIdRef = useRef(0);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  useEffect(() => {
    lastIdRef.current = messages.reduce((m, x) => (x.id > m ? x.id : m), 0);
  }, [messages]);

  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  const persistConversation = (id: string | null) => {
    setConversationId(id);
    if (id) localStorage.setItem(CONV_KEY, id);
    else localStorage.removeItem(CONV_KEY);
  };

  const fetchNew = useCallback(
    async (full = false) => {
      if (!conversationId) return;
      try {
        const res = await client.chat.history({ visitorId, conversationId, afterId: full ? 0 : lastIdRef.current });
        setMode(res.conversation.mode);
        if (res.messages.length) {
          const fresh = res.messages.filter((m) => m.id > lastIdRef.current && (m.role === "staff" || m.role === "system"));
          if (!full && !isOpenRef.current && fresh.length) setUnread((u) => u + fresh.length);
          setMessages((prev) => mergeMessages(full ? [] : prev, res.messages));
        }
      } catch (e: unknown) {
        const code = (e as { code?: string })?.code;
        if (code === "NOT_FOUND") {
          persistConversation(null);
          setMessages([]);
        }
      } finally {
        setLoadingHistory(false);
      }
    },
    [conversationId, visitorId],
  );

  // Initial load
  useEffect(() => {
    if (conversationId && messages.length === 0) void fetchNew(true);
    else setLoadingHistory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live updates: fast polling while a human is handling the conversation or the panel is open.
  useEffect(() => {
    if (!conversationId || status !== "idle") return;
    const interval = mode === "human" ? (isOpen ? 2500 : 6000) : isOpen ? 8000 : 20000;
    const t = setInterval(() => void fetchNew(), interval);
    return () => clearInterval(t);
  }, [conversationId, mode, isOpen, status, fetchNew]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status !== "idle") return;
      setError(null);
      const tempId = -Date.now();
      setMessages((prev) => [...prev, { id: tempId, role: "user", content: trimmed, cards: [], authorName: null, createdAt: new Date() }]);
      setStatus("sending");
      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, conversationId, text: trimmed }),
        });
        if (!res.ok || !res.body) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Couldn't send your message.");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let localDraft: { content: string; cards: ChatCard[] } = { content: "", cards: [] };
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const ev = JSON.parse(line);
            if (ev.type === "meta") {
              persistConversation(ev.conversationId);
              setMode(ev.mode);
              setMessages((prev) => mergeMessages(prev.filter((m) => m.id !== tempId), [ev.userMessage]));
              if (ev.mode === "ai") setStatus("streaming");
            } else if (ev.type === "text") {
              localDraft = { ...localDraft, content: localDraft.content + ev.delta };
              setDraft(localDraft);
            } else if (ev.type === "card") {
              localDraft = { ...localDraft, cards: [...localDraft.cards, ev.card] };
              setDraft(localDraft);
            } else if (ev.type === "handoff") {
              setMode("human");
            } else if (ev.type === "done") {
              if (ev.message) setMessages((prev) => mergeMessages(prev, [ev.message]));
              setDraft(null);
            } else if (ev.type === "error") {
              setError(ev.error);
            }
          }
        }
      } catch (e) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setDraft(null);
        setStatus("idle");
        // pick up any system messages (e.g. handoff notice)
        setTimeout(() => void fetchNewRef.current?.(), 300);
      }
    },
    [conversationId, status, visitorId],
  );

  const fetchNewRef = useRef<() => Promise<void>>(null);
  fetchNewRef.current = () => fetchNew();

  const requestHuman = useCallback(
    async (details: { name?: string; email?: string }) => {
      setError(null);
      try {
        const res = await client.chat.requestHuman({ visitorId, conversationId, ...details });
        persistConversation(res.conversationId);
        setMode("human");
        const h = await client.chat.history({ visitorId, conversationId: res.conversationId, afterId: 0 });
        setMessages(mergeMessages([], h.messages));
      } catch {
        setError("Couldn't reach the team. Please call " + "+1 (808) 555-0142.");
      }
    },
    [conversationId, visitorId],
  );

  const backToConcierge = useCallback(async () => {
    if (!conversationId) return;
    await client.chat.backToConcierge({ visitorId, conversationId });
    setMode("ai");
    await fetchNew();
  }, [conversationId, visitorId, fetchNew]);

  const reset = useCallback(() => {
    persistConversation(null);
    setMessages([]);
    setMode("ai");
    setDraft(null);
    setError(null);
  }, []);

  return { messages, draft, status, mode, error, loadingHistory, unread, send, requestHuman, backToConcierge, reset, hasConversation: !!conversationId };
}
