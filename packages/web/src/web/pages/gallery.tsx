import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY } from "../../shared/resort";
import { PageHero, Reveal } from "../components/ui-kit";
import { useSeo } from "../hooks/use-seo";

export default function GalleryPage() {
  useSeo("Gallery", "Photos of Lūana Kai Resort & Villas on Hanalei Bay, Kauaʻi.");
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o! + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setOpen((o) => (o! - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <PageHero image="/images/gallery-lobby.jpg" eyebrow="Gallery" title="A Glimpse of Lūana" />
      <section className="mx-auto max-w-[1400px] columns-1 gap-4 px-6 py-20 sm:columns-2 lg:columns-3">
        {GALLERY.map((src, i) => (
          <Reveal key={src} delay={(i % 3) * 0.05} className="mb-4 break-inside-avoid">
            <button onClick={() => setOpen(i)} className="group block w-full overflow-hidden rounded-[8px]" aria-label={`Open photo ${i + 1}`}>
              <img src={src} alt="" loading="lazy" className="w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
            </button>
          </Reveal>
        ))}
      </section>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4" onClick={() => setOpen(null)}>
            <motion.img key={open} src={GALLERY[open]} alt="" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[88vh] max-w-full rounded-md object-contain" onClick={(e) => e.stopPropagation()} />
            <button className="glass absolute right-5 top-5 rounded-full p-2.5" aria-label="Close"><X size={18} /></button>
            <button className="glass absolute left-4 top-1/2 rounded-full p-3" aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + GALLERY.length) % GALLERY.length); }}><ChevronLeft size={18} /></button>
            <button className="glass absolute right-4 top-1/2 rounded-full p-3" aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % GALLERY.length); }}><ChevronRight size={18} /></button>
            <span className="absolute bottom-6 text-[12px] text-mist">{open + 1} / {GALLERY.length}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
