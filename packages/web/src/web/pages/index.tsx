import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "wouter";
import { ArrowRight, MessageCircle, Quote } from "lucide-react";
import { DINING, EXPERIENCES, GALLERY, OFFERS, ROOMS, SPA, TESTIMONIALS } from "../../shared/resort";
import { ButtonLink, Chip, ImageCard, Reveal, SectionTitle, money } from "../components/ui-kit";
import { Accordion } from "../components/accordion";
import { ContactPanel } from "../components/contact-panel";
import { openConcierge } from "../components/chat/chat-widget";
import { useSeo } from "../hooks/use-seo";

const HIGHLIGHTS = [
  ["1 mile", "of private beach"],
  ["42", "suites & villas"],
  ["62 acres", "of tropical gardens"],
  ["3", "restaurants & bars"],
  ["6", "open-air spa hale"],
  ["5 min", "to Hanalei town"],
  ["24/7", "concierge"],
  ["Nā Pali", "coast sails"],
  ["Reef-safe", "everything"],
  ["Zero", "resort fees"],
];

const AMENITIES = ["Infinity pool", "Beach butlers", "Keiki Club", "Sunrise yoga", "Outrigger canoes", "Paddleboards", "Snorkel gear", "Private chef", "Airport transfers", "Wedding lawn", "Fitness pavilion", "Valet parking"];

function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
      <motion.img
        src="/images/hero.jpg"
        alt="Infinity pool lanai overlooking Hanalei Bay and the mountains of Kauaʻi at golden hour"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      <div className="relative px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="eyebrow mb-6">
          Hanalei Bay · Kauaʻi · Hawaiʻi
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(48px,9vw,120px)] font-light leading-[0.95] tracking-[-0.02em]"
        >
          where the mountains
          <br />
          <em className="font-light">meet the sea</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9 }}
          className="mx-auto mt-7 max-w-xl text-[14px] font-medium uppercase tracking-[0.08em] text-bone/90 md:text-[16px]"
        >
          Oceanfront suites and private villas on the north shore of the Garden Isle
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.9 }} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/book" variant="glass">Reserve your stay</ButtonLink>
          <button onClick={() => openConcierge()} className="inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-[13px] font-semibold text-bone/90 hover:text-bone">
            <MessageCircle size={15} /> Ask the concierge
          </button>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-bone/60">
        Scroll
        <span className="mx-auto mt-2 block h-8 w-px bg-gradient-to-b from-bone/60 to-transparent" />
      </motion.div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="px-6 py-24">
      <SectionTitle title="Lūana Kai at a Glance" />
      <Reveal className="mx-auto mt-14 grid max-w-5xl grid-cols-2 md:grid-cols-5">
        {HIGHLIGHTS.map(([big, small], i) => (
          <div
            key={big + small}
            className={[
              "flex flex-col items-center justify-center px-3 py-8 text-center",
              i % 5 !== 4 ? "md:border-r" : "",
              i < 5 ? "md:border-b" : "",
              i % 2 === 0 ? "border-r md:border-r-0" : "",
              i < 8 ? "border-b md:border-b-0" : "",
              "border-line",
            ].join(" ")}
          >
            <span className="font-display text-[26px] font-light">{big}</span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-mist">{small}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function About() {
  return (
    <section className="px-6 pb-24">
      <SectionTitle title="Aloha & Welcome" />
      <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl text-center font-display text-[22px] font-light leading-[1.5] md:text-[26px]">
        Lūana means <em>to be at leisure, content and at ease</em>. Set between the emerald peaks of Namolokama and the reef-sheltered waters of Hanalei Bay, our resort was designed to disappear into the landscape — so the island can do what it does best.
      </Reveal>
    </section>
  );
}

function Amenities() {
  return (
    <section className="px-4 md:px-6">
      <div className="panel-gradient grain relative mx-auto max-w-[1240px] overflow-hidden rounded-[16px] px-6 py-20 text-center">
        <SectionTitle title="Every Comfort, Considered" intro="Rates include beach and pool service, sunrise yoga, water-sports gear, Wi-Fi and valet — no resort fee, ever." />
        <Reveal delay={0.1} className="mx-auto mt-12 grid max-w-[520px] grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITIES.map((a) => (
            <Chip key={a}>{a}</Chip>
          ))}
        </Reveal>
        <Reveal delay={0.2} className="mt-20">
          <p className="text-[22px] font-medium leading-snug">
            Ready to trade your inbox
            <br />
            for the north shore?
          </p>
          <ButtonLink href="/book" className="mt-7 w-[220px] uppercase tracking-[0.1em]">Check availability</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function Rooms() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-28">
      <SectionTitle title="Suites & Villas" intro="Six ways to stay, from bay-view rooms to a three-bedroom beachfront estate." />
      <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((r, i) => (
          <Reveal key={r.slug} delay={(i % 3) * 0.08}>
            <ImageCard image={r.image} title={r.name} text={r.short} meta={`from ${money(r.rate)}`} href={`/rooms/${r.slug}`} />
          </Reveal>
        ))}
      </div>
      <div className="mt-16 text-center">
        <ButtonLink href="/rooms" variant="outline">Compare all rooms <ArrowRight size={14} /></ButtonLink>
      </div>
    </section>
  );
}

function Dining() {
  const [main, ...rest] = DINING;
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-28">
      <SectionTitle title="Dining by the Water" />
      <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="relative overflow-hidden rounded-[8px]">
          <img src={main!.image} alt={main!.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-8 pt-24">
            <p className="eyebrow">{main!.type}</p>
            <p className="mt-2 font-display text-[32px] font-light">{main!.name}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[15px] text-mist">{main!.description}</p>
          <p className="mt-4 text-[13px] text-bone/80">{main!.hours}</p>
          <div className="mt-10 space-y-6">
            {rest.map((d) => (
              <div key={d.slug} className="flex gap-5 border-t border-line pt-6">
                <img src={d.image} alt={d.name} loading="lazy" className="h-20 w-24 shrink-0 rounded-[6px] object-cover" />
                <div>
                  <p className="font-display text-[18px] uppercase tracking-wide">{d.name}</p>
                  <p className="text-[13px] text-mist">{d.type} · {d.hours.split("·")[0]}</p>
                </div>
              </div>
            ))}
          </div>
          <ButtonLink href="/dining" variant="outline" className="mt-10">Explore dining</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function Spa() {
  return (
    <section className="relative overflow-hidden">
      <img src="/images/spa-hale.jpg" alt="Open-air spa hale in the rainforest garden" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
      <div className="relative mx-auto max-w-[1240px] px-6 py-32">
        <Reveal className="max-w-lg">
          <p className="eyebrow">Wellness</p>
          <h2 className="mt-4 font-display text-[44px] font-light leading-tight">{SPA.name}</h2>
          <div className="mt-6 h-px w-12 bg-bone/35" />
          <p className="mt-6 text-mist">{SPA.description}</p>
          <ul className="mt-8 space-y-3">
            {SPA.treatments.slice(0, 3).map((t) => (
              <li key={t.name} className="flex items-baseline justify-between gap-4 border-b border-line pb-3 text-[14px]">
                <span>{t.name} <span className="text-mist">· {t.duration}</span></span>
                <span className="text-sand">{money(t.price)}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/spa" variant="solid" className="mt-10">View spa menu</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function Experiences() {
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-28">
      <SectionTitle title="Island Experiences" intro="Curated by our cultural and ocean guides — all bookable through the concierge." />
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="relative hidden aspect-[4/5] overflow-hidden rounded-[8px] lg:block">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={active}
              src={EXPERIENCES[active]!.image}
              alt={EXPERIENCES[active]!.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion
            defaultOpen={0}
            onChange={setActive}
            items={EXPERIENCES.map((e) => ({
              title: e.name,
              meta: `${e.duration} · ${money(e.price)}`,
              body: (
                <>
                  <img src={e.image} alt="" loading="lazy" className="mb-4 aspect-video w-full rounded-[6px] object-cover lg:hidden" />
                  <p>{e.description}</p>
                  <button onClick={() => openConcierge(`I'd like to book the ${e.name} experience. What are the next available times?`)} className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-sand hover:underline">
                    Ask the concierge <ArrowRight size={13} />
                  </button>
                </>
              ),
            }))}
          />
          <ButtonLink href="/experiences" variant="outline" className="mt-10">All experiences</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

function Offers() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-28">
      <SectionTitle title="Offers & Packages" />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {OFFERS.map((o, i) => (
          <Reveal key={o.slug} delay={i * 0.06}>
            <Link to={`/book?offer=${o.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-[8px]">
              <img src={o.image} alt={o.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-sand px-3 py-1 text-[11px] font-bold text-ink">{o.perk}</span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-[22px] font-light leading-tight">{o.name}</p>
                <p className="mt-1 text-[12px] text-mist">{o.nights}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i]!;
  return (
    <section className="border-y border-line px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <Quote className="mx-auto text-sand" size={28} strokeWidth={1.25} />
        <div className="relative mt-8 min-h-[220px] md:min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6 }}>
              <p className="font-display text-[24px] font-light leading-[1.45] md:text-[30px]">“{t.quote}”</p>
              <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.2em]">{t.name}</p>
              <p className="text-[12px] text-mist">{t.from}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {TESTIMONIALS.map((_, k) => (
            <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} className={`h-1 rounded-full transition-all ${k === i ? "w-8 bg-bone" : "w-3 bg-bone/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryStrip() {
  const imgs = GALLERY.slice(0, 6);
  return (
    <section className="py-28">
      <SectionTitle title="Moments from the Bay" />
      <div className="mt-14 flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-thin">
        {imgs.map((src, i) => (
          <Reveal key={src} delay={i * 0.05} className="shrink-0">
            <Link to="/gallery">
              <img src={src} alt="" loading="lazy" className={`h-[360px] rounded-[8px] object-cover ${i % 2 ? "w-[270px]" : "w-[480px]"}`} />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Index() {
  useSeo("Lūana Kai Resort & Villas — Luxury Resort on Hanalei Bay, Kauaʻi");
  return (
    <>
      <Hero />
      <Highlights />
      <About />
      <Amenities />
      <Rooms />
      <Dining />
      <Spa />
      <Experiences />
      <Offers />
      <Testimonials />
      <GalleryStrip />
      <section className="px-4 pb-24 md:px-6">
        <ContactPanel />
      </section>
    </>
  );
}
