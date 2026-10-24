import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ChevronDown, Headset, MessageCircle, MoreHorizontal, RotateCcw, Sparkles, X } from "lucide-react";
import { useLocation } from "wouter";
import { useConciergeChat, type ChatMessage } from "../../hooks/use-concierge-chat";
import { Markdown } from "./markdown";
import { ChatCardView } from "./cards";
import { cn } from "../../lib/utils";

const OPEN_EVENT = "lk:open-concierge";

/** Open the concierge from anywhere, optionally sending a prompt. */
export function openConcierge(prompt?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { prompt } }));
}

const SUGGESTIONS = [
  "Which villa is best for a honeymoon?",
  "Plan a 5-night stay for 2 in December",
  "What's on the spa menu?",
  "How do I get here from the airport?",
];

function Avatar({ human }: { human?: boolean }) {
  return (
    <div className={cn("relative grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-[15px]", human ? "bg-sand text-ink" : "bg-gradient-to-br from-sea to-slate text-bone ring-1 ring-white/10")}>
      {human ? <Headset size={16} /> : "L"}
      <span className="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full border-2 border-ink bg-emerald-400" />
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-bone/70" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

function Bubble({ m, streaming }: { m: Pick<ChatMessage, "role" | "content" | "cards" | "authorName">; streaming?: boolean }) {
  if (m.role === "system") {
    return (
      <div className="flex items-center gap-3 py-1 text-[11px] text-mist">
        <span className="h-px flex-1 bg-line" />
        <span className="text-center">{m.content}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-bone px-4 py-2.5 text-[14px] leading-relaxed text-ink">{m.content}</div>
      </div>
    );
  }
  const staff = m.role === "staff";
  return (
    <div className="flex flex-col gap-2">
      <span className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", staff ? "text-sand" : "text-mist")}>
        {staff ? `${m.authorName ?? "Team"} · Lūana Kai` : "Leilani · Concierge"}
      </span>
      {(m.content || streaming) && (
        <div className={cn("max-w-[92%] rounded-2xl rounded-tl-md px-4 py-2.5 text-[14px] leading-relaxed", staff ? "border border-sand/25 bg-sand/[0.08]" : "bg-white/[0.06]")}>
          {m.content ? <Markdown text={m.content} /> : <TypingDots />}
        </div>
      )}
      {m.cards.map((c, i) => (
        <div key={i} className="max-w-full">
          <ChatCardView card={c} />
        </div>
      ))}
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [handoffForm, setHandoffForm] = useState(false);
  const [input, setInput] = useState("");
  const [hName, setHName] = useState("");
  const [hEmail, setHEmail] = useState("");
  const [location] = useLocation();
  const chat = useConciergeChat(open);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pendingPrompt = useRef<string | null>(null);

  const hidden = location.startsWith("/admin");

  useEffect(() => {
    const handler = (e: Event) => {
      const prompt = (e as CustomEvent).detail?.prompt as string | undefined;
      setOpen(true);
      if (prompt) pendingPrompt.current = prompt;
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    if (open && pendingPrompt.current && chat.status === "idle" && !chat.loadingHistory) {
      const p = pendingPrompt.current;
      pendingPrompt.current = null;
      void chat.send(p);
    }
  }, [open, chat.status, chat.loadingHistory, chat]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length, chat.draft?.content, chat.draft?.cards.length, open, handoffForm]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (hidden) return null;

  const submit = () => {
    if (!input.trim()) return;
    void chat.send(input);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const isHuman = chat.mode === "human";
  const staffJoined = chat.messages.some((m) => m.role === "staff");
  const awaitingStaff = isHuman && !staffJoined;
  const empty = chat.messages.length === 0 && !chat.draft && !chat.loadingHistory;
  const busy = chat.status !== "idle";

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={() => setOpen(true)}
            className="glass fixed bottom-[68px] right-5 z-50 flex items-center gap-3 rounded-full py-2 pl-2 pr-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,.8)] transition hover:bg-white/15 md:bottom-[72px] md:right-6"
            aria-label="Open concierge chat"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-bone text-ink">
              <MessageCircle size={18} />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-[13px] font-semibold">Ask our concierge</span>
              <span className="block text-[11px] text-mist">{isHuman ? "Team chat open" : "Replies instantly · 24/7"}</span>
            </span>
            {chat.unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-sand px-1 text-[11px] font-bold text-ink">{chat.unread}</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="Lūana Kai concierge chat"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden border-line bg-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,.9)] sm:inset-auto sm:bottom-[68px] sm:right-6 sm:h-[min(680px,calc(100vh-96px))] sm:w-[420px] sm:rounded-[20px] sm:border"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-slate via-sea/30 to-transparent" />
            {/* Header */}
            <header className="relative flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Avatar human={isHuman && staffJoined} />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate font-display text-[17px]">{isHuman ? (staffJoined ? "Lūana Kai Team" : "Connecting to our team") : "Leilani"}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-mist">
                  {isHuman ? <Headset size={11} /> : <Sparkles size={11} className="text-sand" />}
                  {isHuman ? (staffJoined ? "Live with a team member" : "Usually replies in 2–5 min") : "Digital concierge · AI"}
                </p>
              </div>
              <div className="relative">
                <button onClick={() => setMenu((m) => !m)} className="rounded-full p-2 text-mist hover:bg-white/10 hover:text-bone" aria-label="Chat options">
                  <MoreHorizontal size={18} />
                </button>
                <AnimatePresence>
                  {menu && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-10 z-10 w-56 overflow-hidden rounded-xl border border-line bg-ink-2 py-1 text-[13px] shadow-xl"
                      onMouseLeave={() => setMenu(false)}
                    >
                      {!isHuman ? (
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-white/5" onClick={() => { setMenu(false); setHandoffForm(true); }}>
                          <Headset size={14} /> Talk to a person
                        </button>
                      ) : (
                        <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-white/5" onClick={() => { setMenu(false); void chat.backToConcierge(); }}>
                          <Sparkles size={14} /> Back to AI concierge
                        </button>
                      )}
                      <button className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-white/5" onClick={() => { setMenu(false); setHandoffForm(false); chat.reset(); }}>
                        <RotateCcw size={14} /> Start a new conversation
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 text-mist hover:bg-white/10 hover:text-bone" aria-label="Minimize chat">
                <ChevronDown size={18} className="hidden sm:block" />
                <X size={18} className="sm:hidden" />
              </button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="scrollbar-thin relative flex-1 space-y-5 overflow-y-auto px-4 py-5" aria-live="polite">
              {chat.loadingHistory && (
                <div className="space-y-3">
                  {[60, 80, 45].map((w, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-2xl bg-white/5" style={{ width: `${w}%`, marginLeft: i === 1 ? "auto" : 0 }} />
                  ))}
                </div>
              )}

              {empty && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                  <p className="eyebrow mb-3">Aloha</p>
                  <h3 className="font-display text-[28px] font-light leading-tight">How may I help plan your stay?</h3>
                  <p className="mt-3 text-[13px] text-mist">
                    I'm Leilani, the resort's digital concierge. Ask about villas, dining, the spa or the island — I can also start a booking request. A team member is always a tap away.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => void chat.send(s)} className="rounded-xl border border-line px-4 py-3 text-left text-[13px] transition hover:border-sand/60 hover:bg-white/[0.03]">
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {chat.messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <Bubble m={m} />
                </motion.div>
              ))}

              {chat.status === "sending" && !isHuman && <Bubble m={{ role: "assistant", content: "", cards: [], authorName: null }} streaming />}
              {chat.draft && <Bubble m={{ role: "assistant", content: chat.draft.content, cards: chat.draft.cards, authorName: null }} streaming />}

              {awaitingStaff && chat.status === "idle" && (
                <div className="flex items-center gap-2 text-[12px] text-mist">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sand opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sand" />
                  </span>
                  Waiting for a team member — you can keep typing.
                </div>
              )}

              {handoffForm && !isHuman && (
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 rounded-xl border border-line bg-white/[0.03] p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void chat.requestHuman({ name: hName || undefined, email: hEmail || undefined }).then(() => setHandoffForm(false));
                  }}
                >
                  <p className="text-[13px] font-semibold">Chat with our team</p>
                  <p className="text-[12px] text-mist">Optional — so we can follow up if you step away.</p>
                  <input className="field" aria-label="Your name" placeholder="Your name" value={hName} onChange={(e) => setHName(e.target.value)} />
                  <input className="field" type="email" aria-label="Email address" placeholder="Email address" value={hEmail} onChange={(e) => setHEmail(e.target.value)} />
                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="flex-1 rounded-lg bg-bone py-2 text-[12px] font-semibold text-ink">Connect me</button>
                    <button type="button" onClick={() => setHandoffForm(false)} className="rounded-lg border border-line px-4 py-2 text-[12px]">Cancel</button>
                  </div>
                </motion.form>
              )}

              {chat.error && <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-[12px] text-destructive">{chat.error}</p>}
            </div>

            {/* Composer */}
            <div className="relative border-t border-line bg-ink px-3 pb-3 pt-3">
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-white/[0.04] p-1.5 pl-4 focus-within:border-sand/50">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={2000}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={isHuman ? "Message our team…" : "Ask about villas, dining, dates…"}
                  className="max-h-[120px] flex-1 resize-none bg-transparent py-2 text-[14px] placeholder:text-bone/40 focus:outline-none"
                  aria-label="Message"
                />
                <button
                  onClick={submit}
                  disabled={!input.trim() || busy}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-bone text-ink transition disabled:opacity-30"
                  aria-label="Send message"
                >
                  {busy ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" /> : <ArrowUp size={16} />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-mist">
                {!isHuman ? (
                  <button onClick={() => setHandoffForm(true)} className="flex items-center gap-1.5 hover:text-bone">
                    <Headset size={12} /> Talk to a person
                  </button>
                ) : (
                  <button onClick={() => void chat.backToConcierge()} className="flex items-center gap-1.5 hover:text-bone">
                    <Sparkles size={12} /> Back to AI concierge
                  </button>
                )}
                <span>{isHuman ? "Live team chat" : "AI can make mistakes"}</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
