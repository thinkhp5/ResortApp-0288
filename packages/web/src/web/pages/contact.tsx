import { MapPin, Plane, Clock } from "lucide-react";
import { POLICIES, RESORT } from "../../shared/resort";
import { PageHero, Reveal, SectionTitle } from "../components/ui-kit";
import { ContactPanel } from "../components/contact-panel";
import { Accordion } from "../components/accordion";
import { useSeo } from "../hooks/use-seo";

export default function ContactPage() {
  useSeo("Location & Contact", `Find Lūana Kai at ${RESORT.address}. Directions from Līhuʻe Airport, contact details and FAQs.`);
  const info = [
    { icon: MapPin, title: "Address", text: RESORT.address },
    { icon: Plane, title: "Getting here", text: `${RESORT.airport}. Private transfers available.` },
    { icon: Clock, title: "Arrival", text: `Check-in ${RESORT.checkIn} · Check-out ${RESORT.checkOut}` },
  ];
  return (
    <>
      <PageHero image="/images/about.jpg" eyebrow="Location" title="Find Your Way to Hanalei" intro="On the north shore of Kauaʻi, where the road narrows and the island slows down." />
      <section className="mx-auto grid max-w-[1240px] gap-6 px-6 py-20 md:grid-cols-3">
        {info.map((i) => (
          <Reveal key={i.title} className="rounded-[14px] border border-line p-8">
            <i.icon size={20} strokeWidth={1.25} className="text-sand" />
            <p className="mt-5 font-display text-[22px]">{i.title}</p>
            <p className="mt-2 text-[14px] text-mist">{i.text}</p>
          </Reveal>
        ))}
      </section>
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <Reveal className="overflow-hidden rounded-[14px] border border-line">
          <iframe
            title="Map of Hanalei Bay"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-159.53%2C22.19%2C-159.47%2C22.23&layer=mapnik&marker=22.211%2C-159.499"
            className="h-[420px] w-full grayscale invert-[0.92] contrast-[0.9]"
            loading="lazy"
          />
        </Reveal>
      </section>
      <section className="px-4 pb-24 md:px-6">
        <ContactPanel />
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <SectionTitle title="Frequently Asked" />
        <div className="mt-12">
          <Accordion items={POLICIES.map((p) => ({ title: p.q.replace("?", ""), body: p.a }))} />
        </div>
      </section>
    </>
  );
}
