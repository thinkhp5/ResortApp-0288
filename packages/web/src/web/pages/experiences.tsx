import { EXPERIENCES } from "../../shared/resort";
import { PageHero, Reveal, money } from "../components/ui-kit";
import { openConcierge } from "../components/chat/chat-widget";
import { useSeo } from "../hooks/use-seo";

export default function ExperiencesPage() {
  useSeo("Island Experiences", "Surf lessons, Nā Pali coast sails, honu snorkeling, beach lūʻau and waterfall hikes from Lūana Kai, Kauaʻi.");
  return (
    <>
      <PageHero image="/images/exp-napali.jpg" eyebrow="Explore" title="The Garden Isle, Up Close" intro="Small-group and private adventures led by guides who grew up on the north shore." />
      <section className="mx-auto grid max-w-[1240px] gap-x-6 gap-y-16 px-6 py-24 md:grid-cols-2">
        {EXPERIENCES.map((e, i) => (
          <Reveal key={e.slug} delay={(i % 2) * 0.08} className={i === 0 ? "md:col-span-2" : ""}>
            <div className="group">
              <div className={`relative overflow-hidden rounded-[8px] ${i === 0 ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
                <img src={e.image} alt={e.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
                <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold">{e.duration} · {money(e.price)} pp</span>
              </div>
              <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="max-w-xl">
                  <h2 className="font-display text-[24px] uppercase tracking-wide">{e.name}</h2>
                  <p className="mt-2 text-[14px] text-mist">{e.description}</p>
                </div>
                <button onClick={() => openConcierge(`I'd like to book ${e.name}. What dates and times are available?`)} className="shrink-0 rounded-[10px] border border-line px-5 py-2.5 text-[12px] font-semibold hover:border-bone/60">
                  Plan with concierge
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </section>
    </>
  );
}
