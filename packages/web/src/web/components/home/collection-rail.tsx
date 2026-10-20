import { motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import type { Product } from "../../types/product";
import { money } from "../../lib/format";
import { SplitHeading } from "../motion";

/** Pinned section: vertical scroll drives a horizontal rail of sneakers. */
export function CollectionRail({ products }: { products: Product[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [products.length]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={section} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="px-gutter mb-10 flex items-end justify-between gap-8">
          <div>
            <p className="label mb-4 text-ash">/02 — The collection</p>
            <SplitHeading className="display text-[clamp(2.6rem,7vw,7.5rem)]" lines={["Eight ways", <span key="b" className="outline-text">to move.</span>]} />
          </div>
          <Link to="/shop" className="btn btn-ghost hidden shrink-0 md:inline-flex">
            View all →
          </Link>
        </div>

        <motion.div ref={track} style={{ x }} className="px-gutter flex w-max gap-5 md:gap-8">
          {products.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              data-cursor="View"
              className="group relative flex h-[46svh] w-[78vw] shrink-0 flex-col justify-between overflow-hidden border border-line bg-carbon p-5 sm:w-[46vw] md:h-[52svh] md:w-[34vw] md:p-7 lg:w-[28vw]"
            >
              <div
                className="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-80"
                style={{ background: `radial-gradient(70% 55% at 50% 60%, ${p.accent}55, transparent 70%)` }}
              />
              <div className="relative flex justify-between label text-ash">
                <span>/{String(i + 1).padStart(2, "0")}</span>
                <span>{p.category}</span>
              </div>
              <img
                src={p.image}
                alt={`${p.model} ${p.colorway}`}
                loading="lazy"
                className="shoe-shadow relative mx-auto max-h-[58%] w-[90%] -rotate-6 object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:-rotate-[14deg] group-hover:scale-110"
              />
              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <p className="display-narrow text-2xl md:text-3xl">{p.model}</p>
                  <p className="label mt-1 text-ash">{p.colorway}</p>
                </div>
                <p className="font-mono text-sm">{money(p.price)}</p>
              </div>
            </Link>
          ))}
          <Link
            to="/shop"
            className="group flex h-[46svh] w-[60vw] shrink-0 flex-col items-center justify-center gap-6 border border-line sm:w-[30vw] md:h-[52svh] md:w-[22vw]"
          >
            <span className="display text-5xl transition-colors group-hover:text-infra">Shop all</span>
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-bone/30 text-2xl transition group-hover:bg-infra group-hover:text-vanta">→</span>
          </Link>
        </motion.div>

        <div className="px-gutter mt-10">
          <div className="h-px bg-line">
            <motion.div style={{ width: bar }} className="h-px bg-infra" />
          </div>
        </div>
      </div>
    </section>
  );
}
