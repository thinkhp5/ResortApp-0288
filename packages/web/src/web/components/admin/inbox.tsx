import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bot, CheckCircle2, Headset, RotateCcw, Send } from "lucide-react";
import { getRoom } from "../../../shared/resort";
import { useAdminConversation, useAdminConversations, useAdminReply, useAdminSetMode, useAdminSetStatus } from "../../queries/admin";
import { cn } from "../../lib/utils";
import { Markdown } from "../chat/markdown";
import { money, Spinner } from "../ui-kit";
import { ago, Empty, Pill, Segmented, shortDate } from "./shared";

type Filter = "all" | "human" | "waiting" | "closed";

const QUICK = [
  "Aloha! Thanks for waiting — how can I help?",
  "Let me check availability for those dates and come right back to you.",
  "I've sent the details to your email. Anything else I can help with?",
];

function ConversationList({ selected, onSelect, waiting }: { selected: string | null; onSelect: (id: string) => void; waiting: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const list = useAdminConversations(filter);
  return (
    <div className="flex min-h-0 flex-col">
      <div className="border-b border-line p-4">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "waiting", label: "Waiting", badge: waiting },
            { value: "human", label: "Live" },
            { value: "closed", label: "Closed" },
          ]}
        />
      </div>
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        {list.isLoading && (
          <div className="grid place-items-center py-16 text-mist"><Spinner /></div>
        )}
        {list.error && <p className="p-4 text-[13px] text-red-300">{list.error.message}</p>}
        {list.data?.length === 0 && <Empty title="No conversations" text="New guest chats appear here in real time." />}
        {list.data?.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "flex w-full flex-col gap-1.5 border-b border-line/60 px-4 py-3.5 text-left transition",
              selected === c.id ? "bg-white/[0.07]" : "hover:bg-white/[0.03]",
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 shrink-0 rounded-full", c.needsAttention ? "bg-sand" : c.mode === "human" ? "bg-emerald-400" : "bg-white/20")} />
              <span className="truncate text-[14px] font-semibold">{c.guestName || `Guest ${c.id.slice(0, 4).toUpperCase()}`}</span>
              <span className="ml-auto shrink-0 text-[11px] text-mist">{ago(c.updatedAt)}</span>
            </div>
            <p className="line-clamp-1 pl-4 text-[12px] text-mist">{c.lastMessage?.replace(/[*_#`]+/g, "") || "—"}</p>
            <div className="flex flex-wrap gap-1.5 pl-4">
              {c.needsAttention && <Pill tone="sand">Waiting</Pill>}
              {c.mode === "human" ? <Pill tone="green">Live</Pill> : <Pill>AI</Pill>}
              {c.status === "closed" && <Pill tone="red">Closed</Pill>}
              {c.staffUnread > 0 && <Pill tone="sea">{c.staffUnread} new</Pill>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Thread({ id, onBack }: { id: string; onBack: () => void }) {
  const q = useAdminConversation(id);
  const reply = useAdminReply();
  const setMode = useAdminSetMode();
  const setStatus = useAdminSetStatus();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const count = q.data?.messages.length ?? 0;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [count, id]);

  if (q.isLoading) return <div className="grid h-full place-items-center text-mist"><Spinner /></div>;
  if (q.error || !q.data) return <p className="p-6 text-[13px] text-red-300">{q.error?.message ?? "Conversation not found"}</p>;
  const { conversation: c, messages, bookings } = q.data;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    reply.mutate({ id, text: t }, { onSuccess: () => setText("") });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">
        <button onClick={onBack} className="rounded-lg p-1.5 text-mist hover:text-bone lg:hidden" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="truncate font-semibold">{c.guestName || `Guest ${c.id.slice(0, 4).toUpperCase()}`}</p>
          <p className="truncate text-[12px] text-mist">{c.guestEmail || "No email shared"} · started {ago(c.createdAt)}</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          {c.mode === "ai" ? (
            <button
              onClick={() => setMode.mutate({ id, mode: "human" })}
              disabled={setMode.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-sand px-3 py-1.5 text-[12px] font-bold text-ink disabled:opacity-60"
            >
              <Headset size={14} /> Take over
            </button>
          ) : (
            <button
              onClick={() => setMode.mutate({ id, mode: "ai" })}
              disabled={setMode.isPending}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-bone/50 disabled:opacity-60"
            >
              <Bot size={14} /> Return to AI
            </button>
          )}
          {c.status === "open" ? (
            <button
              onClick={() => setStatus.mutate({ id, status: "closed" })}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-bone/50"
            >
              <CheckCircle2 size={14} /> Close
            </button>
          ) : (
            <button
              onClick={() => setStatus.mutate({ id, status: "open" })}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-bone/50"
            >
              <RotateCcw size={14} /> Reopen
            </button>
          )}
        </div>
      </div>

      {bookings.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-b border-line bg-white/[0.02] px-5 py-2.5 scrollbar-thin">
          {bookings.map((b) => (
            <span key={b.id} className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-[12px]">
              <span className="font-mono font-semibold text-sand">{b.reference}</span> · {getRoom(b.roomSlug)?.name} · {shortDate(b.checkIn)}–{shortDate(b.checkOut)} · {money(b.estimate)}
            </span>
          ))}
        </div>
      )}

      <div className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((m) => {
          if (m.role === "system")
            return (
              <div key={m.id} className="flex items-center gap-3 text-[11px] text-mist">
                <span className="h-px flex-1 bg-line" />
                {m.content}
                <span className="h-px flex-1 bg-line" />
              </div>
            );
          const mine = m.role === "staff" || m.role === "assistant";
          return (
            <div key={m.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-mist">
                {m.role === "user" ? "Guest" : m.role === "assistant" ? "Leilani (AI)" : m.authorName ?? "Staff"} · {ago(m.createdAt)}
              </span>
              {m.content && (
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                    m.role === "user" && "rounded-tl-md bg-white/[0.07]",
                    m.role === "assistant" && "rounded-tr-md border border-line bg-sea/20",
                    m.role === "staff" && "rounded-tr-md bg-bone text-ink [&_strong]:text-ink",
                  )}
                >
                  <Markdown text={m.content} />
                </div>
              )}
              {m.cards.map((card, i) => (
                <span key={i} className="rounded-lg border border-dashed border-line px-3 py-1 text-[11px] text-mist">
                  {card.type === "rooms" && `Shared rooms: ${card.slugs.map((s) => getRoom(s)?.name ?? s).join(", ")}`}
                  {card.type === "booking" && `Booking request ${card.reference} · ${money(card.estimate)}`}
                  {card.type === "handoff" && "Guest asked for a team member"}
                  {card.type === "links" && `Links: ${card.links.map((l) => l.label).join(", ")}`}
                </span>
              ))}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-4">
        {c.mode === "ai" && (
          <p className="mb-3 text-[12px] text-mist">Leilani is answering this guest. Sending a reply will pause the AI and put you in the conversation.</p>
        )}
        <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-thin">
          {QUICK.map((qk) => (
            <button key={qk} onClick={() => setText(qk)} className="shrink-0 rounded-full border border-line px-3 py-1 text-[11px] text-mist hover:border-bone/40 hover:text-bone">
              {qk.length > 42 ? `${qk.slice(0, 42)}…` : qk}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2 rounded-xl border border-line bg-white/[0.03] p-2 focus-within:border-sand/60">
          <textarea
            aria-label="Reply to guest"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder={c.status === "closed" ? "Conversation closed — reopen to reply" : "Write a reply… (Enter to send)"}
            disabled={c.status === "closed"}
            className="min-h-[44px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] outline-none placeholder:text-mist/60"
          />
          <button
            onClick={send}
            disabled={!text.trim() || reply.isPending || c.status === "closed"}
            className="grid h-10 w-10 place-items-center rounded-lg bg-bone text-ink disabled:opacity-40"
            aria-label="Send"
          >
            {reply.isPending ? <Spinner /> : <Send size={16} />}
          </button>
        </div>
        {reply.error && <p className="mt-2 text-[12px] text-red-300">{reply.error.message}</p>}
      </div>
    </div>
  );
}

export function Inbox({ waiting }: { waiting: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="grid h-[calc(100vh-170px)] min-h-[520px] overflow-hidden rounded-[14px] border border-line bg-ink-2/60 lg:grid-cols-[340px_1fr]">
      <div className={cn("min-h-0 border-r border-line", selected ? "hidden lg:flex lg:flex-col" : "flex flex-col")}>
        <ConversationList selected={selected} onSelect={setSelected} waiting={waiting} />
      </div>
      <div className={cn("min-h-0", selected ? "block" : "hidden lg:block")}>
        {selected ? (
          <Thread key={selected} id={selected} onBack={() => setSelected(null)} />
        ) : (
          <Empty title="Select a conversation" text="Guests who ask for a team member are flagged as Waiting." />
        )}
      </div>
    </div>
  );
}
