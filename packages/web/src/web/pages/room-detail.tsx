import { useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "motion/react";
import { BedDouble, Check, Eye, Maximize, Users, MessageCircle } from "lucide-react";
import { getRoom, POLICIES, ROOMS } from "../../shared/resort";
import { ButtonLink, ImageCard, Reveal, SectionTitle, money } from "../components/ui-kit";
import { Accordion } from "../components/accordion";
import { openConcierge } from "../components/chat/chat-widget";
import { useSeo } from "../hooks/use-seo";
import NotFound from "./not-found";

export default function RoomDetail() {
  const { slug } = useParams<{ slug: string }>();
  const room = getRoom(slug);
  const [img, setImg] = useState(0);
  useSeo(room ? room.name : "Room not found", room?.description);
  if (!room) return <NotFound />;
  const others = ROOMS.filter((r) => r.slug !== room.slug).slice(0, 3);
  const specs = [
    { icon: Maximize, label: "Size", value: room.size },
    { icon: Users, label: "Guests", value: `Up to ${room.guests}` },
    { icon: BedDouble, label: "Bedding", value: room.bed },
    { icon: Eye, label: "View", value: room.view },
  ];

  return (
    <>
      <section className="relative h-[82vh] min-h-[560px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img key={img} src={room.gallery[img]} alt={room.name} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-ink" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 px-6 pb-12 md:flex-row md:items-end">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eyebrow">{room.category}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.9 }} className="mt-3 font-display text-5xl font-light md:text-7xl">{room.name}</motion.h1>
          </div>
          <div className="flex gap-2">
            {room.gallery.map((g, i) => (
              <button key={g} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`} className={`h-14 w-20 overflow-hidden rounded-md border-2 transition ${i === img ? "border-bone" : "border-transparent opacity-60 hover:opacity-100"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-14 px-6 py-20 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <p className="font-display text-[24px] font-light leading-[1.5] md:text-[28px]">{room.short}</p>
          <p className="mt-6 text-mist">{room.description}</p>
          <div className="mt-12 grid grid-cols-2 border-t border-l border-line sm:grid-cols-4">
            {specs.map((s) => (
              <div key={s.label} className="border-b border-r border-line p-5">
                <s.icon size={18} strokeWidth={1.25} className="text-sand" />
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-mist">{s.label}</p>
                <p className="mt-1 text-[14px]">{s.value}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-14 font-display text-[26px] font-light">In your {room.category.toLowerCase()}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-3 text-[14px]"><Check size={15} className="text-sand" /> {a}</li>
            ))}
          </ul>
          <h2 className="mb-4 mt-14 font-display text-[26px] font-light">Good to know</h2>
          <Accordion items={POLICIES.slice(0, 4).map((p) => ({ title: p.q.replace("?", ""), body: p.a }))} />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="panel-gradient sticky top-28 rounded-[16px] border border-line p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-mist">Nightly from</p>
            <p className="mt-2 font-display text-[44px] font-light">{money(room.rate)}</p>
            <p className="text-[12px] text-mist">Before taxes · No resort fee</p>
            <ButtonLink href={`/book?room=${room.slug}`} className="mt-8 w-full">Request this {room.category.toLowerCase()}</ButtonLink>
            <button onClick={() => openConcierge(`I'm interested in the ${room.name}. Can you tell me more and help me check dates?`)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line py-3 text-[13px] font-semibold hover:border-bone/50">
              <MessageCircle size={15} /> Ask the concierge
            </button>
            <ul className="mt-8 space-y-2 text-[12px] text-mist">
              <li>· Free cancellation up to 30 days before arrival</li>
              <li>· Best rate when booking direct</li>
              <li>· Reply from reservations within hours</li>
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-28">
        <SectionTitle title="You May Also Love" />
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {others.map((r) => (
            <ImageCard key={r.slug} image={r.image} title={r.name} text={r.short} meta={`from ${money(r.rate)}`} href={`/rooms/${r.slug}`} />
          ))}
        </div>
      </section>
    </>
  );
}
