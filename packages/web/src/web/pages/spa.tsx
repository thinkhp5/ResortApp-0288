import { SPA } from "../../shared/resort";
import { PageHero, Reveal, SectionTitle, money } from "../components/ui-kit";
import { openConcierge } from "../components/chat/chat-widget";
import { useSeo } from "../hooks/use-seo";

export default function SpaPage() {
  useSeo("Hale Ola Spa", "Open-air lomilomi, hot stone and botanical rituals in the rainforest garden at Lūana Kai, Kauaʻi.");
  return (
    <>
      <PageHero image="/images/spa-hale.jpg" eyebrow="Wellness" title={SPA.name} intro={SPA.description} />
      <section className="mx-auto max-w-4xl px-6 py-24">
        <SectionTitle title="Treatment Menu" intro={`Open ${SPA.hours}. We recommend booking 48 hours ahead.`} />
        <div className="mt-14 border-t border-line">
          {SPA.treatments.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05} className="grid gap-2 border-b border-line py-7 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-display text-[22px] uppercase tracking-wide">{t.name}</p>
                <p className="mt-1 text-[14px] text-mist">{t.description}</p>
              </div>
              <div className="flex items-center gap-6 md:justify-end">
                <span className="text-[13px] text-mist">{t.duration}</span>
                <span className="font-display text-[22px] text-sand">{money(t.price)}</span>
                <button onClick={() => openConcierge(`I'd like to book the ${t.name} (${t.duration}). What times are available?`)} className="rounded-lg border border-line px-4 py-2 text-[12px] font-semibold hover:border-bone/60">Book</button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="px-4 pb-28 md:px-6">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[16px] border border-line lg:grid-cols-2">
          <img src="/images/spa-yoga.jpg" alt="Sunrise yoga over Hanalei Bay" loading="lazy" className="h-full min-h-[360px] w-full object-cover" />
          <div className="panel-gradient p-10 md:p-14">
            <p className="eyebrow">Daily rituals</p>
            <h2 className="mt-4 font-display text-[36px] font-light">Move, breathe, restore</h2>
            <ul className="mt-8 space-y-4">
              {SPA.wellness.map((w) => (
                <li key={w} className="border-b border-line pb-4 text-[14px]">{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
