import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "wouter";
import type { Product } from "../../types/product";
import { EASE } from "../../lib/format";
import { SplitHeading } from "../motion";

const HOTSPOTS = [
  { x: 56, y: 30, title: "Monoknit upper", body: "One-piece engineered knit. Zoned lockdown at the midfoot, open weave at the toe.", n: "01" },
  { x: 36, y: 74, title: "WAVEFORM foam", body: "Supercritical foam sculpted into a flowing sidewall — 72% energy return.", n: "02" },
  { x: 4, y: 14, title: "Infra heel tab", body: "Pull loop and outsole line in signature Infra. The only colour it needs.", n: "03" },
  { x: 82, y: 82, title: "Infra-line rubber", body: "High-abrasion rubber mapped only where you strike the ground.", n: "04" },
];

export function Anatomy({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  const shoeRotate = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -6]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-carbon py-28 md:py-36">
      <motion.p style={{ x: bgX }} aria-hidden className="display pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[28vw] text-bone/[0.03]">
        WAVEFORM WAVEFORM
      </motion.p>
      <div className="px-gutter relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label mb-4 text-ash">/03 — Anatomy of Phantom 01</p>
          <SplitHeading className="display text-[clamp(2.4rem,5vw,5rem)]" lines={["Every", "detail", <span key="c" className="text-infra">earns it.</span>]} />
          <ul className="mt-12 border-t border-line">
            {HOTSPOTS.map((h, i) => (
              <li key={h.n}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-start gap-4 border-b border-line py-5 text-left transition-colors ${active === i ? "text-bone" : "text-ash hover:text-bone"}`}
                >
                  <span className={`label mt-1 ${active === i ? "text-infra" : ""}`}>{h.n}</span>
                  <span className="flex-1">
                    <span className="display-narrow block text-xl">{h.title}</span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="block overflow-hidden text-sm leading-relaxed text-ash"
                        >
                          <span className="block pt-2">{h.body}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <Link to={`/product/${product.slug}`} className="btn btn-primary mt-10">
            Explore Phantom 01 →
          </Link>
        </div>

        <div className="relative flex items-center md:col-span-8">
          <motion.div style={{ rotate: shoeRotate }} className="relative w-full">
            <img src={product.image} alt={`${product.model} ${product.colorway} anatomy`} className="shoe-shadow w-full" loading="lazy" />
            {HOTSPOTS.map((h, i) => (
              <button
                key={h.n}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={h.title}
              >
                <span className={`relative flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-all duration-500 ${active === i ? "scale-110 border-infra bg-infra text-vanta" : "border-bone/50 bg-vanta/40"}`}>
                  <span className="label text-[10px]">{h.n}</span>
                  {active === i && <span className="absolute inset-0 animate-ping rounded-full border border-infra" />}
                </span>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
