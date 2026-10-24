import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "../lib/utils";

export function Accordion({ items, onChange, defaultOpen = -1 }: { items: { title: string; body: React.ReactNode; meta?: string }[]; onChange?: (i: number) => void; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title} className="border-b border-line">
            <button
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
              onClick={() => {
                const n = isOpen ? -1 : i;
                setOpen(n);
                onChange?.(n === -1 ? i : n);
              }}
              aria-expanded={isOpen}
            >
              <span className="font-display text-[19px] uppercase tracking-wide md:text-[22px]">{it.title}</span>
              <span className="flex items-center gap-5">
                {it.meta && <span className="hidden text-[12px] text-mist sm:inline">{it.meta}</span>}
                <Plus size={20} strokeWidth={1.25} className={cn("transition-transform duration-300", isOpen && "rotate-45")} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                  <div className="pb-7 pr-10 text-[14px] text-mist">{it.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
