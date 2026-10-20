import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "wouter";
import type { Product } from "../../types/product";
import { EASE, money } from "../../lib/format";
import { Magnetic, SplitHeading } from "../motion";
import { Tilt } from "../tilt";

const HERO_SLUGS = ["phantom-01-obsidian", "phantom-01-bone", "void-runner-infra"];

export function Hero({ products, ready }: { products: Product[]; ready: boolean }) {
  const lineup = HERO_SLUGS.map((s) => products.find((p) => p.slug === s)).filter(Boolean) as Product[];
  const [i, setI] = useState(0);
  const active = lineup[i] ?? products[0];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const shoeY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const shoeRot = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  if (!active) return <section className="h-svh" />;

  return (
    <section ref={ref} className="relative h-svh min-h-[640px] overflow-hidden">
      {/* accent glow */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: `radial-gradient(55% 45% at 55% 55%, ${active.accent}38 0%, transparent 70%)` }}
        transition={{ duration: 1.2, ease: EASE }}
      />
      <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]" />

      {/* giant headline */}
      <motion.div style={{ y: textY, opacity: fade }} className="px-gutter absolute inset-x-0 top-[17%] z-0 md:top-[14%]">
        {ready && (
          <SplitHeading
            as="h1"
            animateOnMount
            delay={0.1}
            stagger={0.12}
            className="display select-none text-[clamp(4.2rem,min(17vw,26svh),19rem)]"
            lines={[
              <span key="a">Built to</span>,
              <span key="b" className="flex justify-end">
                Move<span className="text-infra">.</span>
              </span>,
            ]}
          />
        )}
      </motion.div>

      {/* sneaker */}
      <motion.div style={{ y: shoeY, rotate: shoeRot }} className="absolute inset-0 z-10 flex items-center justify-center">
        <Tilt scope="window" max={14} className="w-[92vw] max-w-[1100px] md:w-[62vw]">
          <AnimatePresence mode="popLayout">
            {ready && (
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, x: "-30%", rotate: 8, filter: "blur(18px)" }}
                animate={{ opacity: 1, x: "0%", rotate: -10, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: "30%", rotate: -24, filter: "blur(18px)" }}
                transition={{ duration: 1.1, ease: EASE, delay: i === 0 ? 0.45 : 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.img
                  src={active.image}
                  alt={`${active.model} ${active.colorway}`}
                  className="shoe-shadow w-full"
                  animate={reduce ? {} : { y: [0, -18, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ translateZ: 80 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {/* floor shadow */}
          <motion.div
            className="mx-auto -mt-6 h-6 w-2/3 rounded-[50%] bg-black/70 blur-2xl"
            animate={reduce ? {} : { scaleX: [1, 0.85, 1], opacity: [0.8, 0.5, 0.8] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </Tilt>
      </motion.div>

      {/* top meta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 1 }}
        className="px-gutter label absolute inset-x-0 top-24 z-20 flex justify-between text-ash md:top-28"
      >
        <span>SS—26 / Collection 04</span>
        <span className="hidden md:block">48.8566° N — 2.3522° E</span>
        <span>
          {String(i + 1).padStart(2, "0")} / {String(lineup.length).padStart(2, "0")}
        </span>
      </motion.div>

      {/* bottom bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.9, duration: 1, ease: EASE }}
        className="px-gutter absolute inset-x-0 bottom-6 z-20 grid grid-cols-2 items-end gap-6 md:bottom-10 md:grid-cols-3"
      >
        <div>
          <p className="label mb-3 text-ash">Colourway</p>
          <div className="flex gap-2">
            {lineup.map((p, idx) => (
              <button
                key={p.slug}
                onClick={() => setI(idx)}
                aria-label={`${p.model} ${p.colorway}`}
                className={`relative h-14 w-16 border bg-carbon/60 p-1 backdrop-blur transition-colors md:h-16 md:w-20 ${idx === i ? "border-bone" : "border-line hover:border-bone/40"}`}
              >
                <img src={p.image} alt="" className="h-full w-full object-contain" />
                {idx === i && <motion.span layoutId="hero-swatch" className="absolute -bottom-[5px] left-0 h-[3px] w-full bg-infra" />}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden flex-col items-center gap-3 md:flex">
          <span className="label text-ash">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-line">
            <motion.span className="absolute left-0 top-0 h-1/2 w-px bg-bone" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
          </span>
        </div>

        <div className="flex flex-col items-end text-right">
          <AnimatePresence mode="wait">
            <motion.div key={active.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
              <p className="display-narrow text-2xl md:text-4xl">
                {active.model} <span className="text-ash">{active.colorway}</span>
              </p>
              <p className="label mt-1 text-ash"><span className="hidden sm:inline">{active.tagline} — </span>{money(active.price)}</p>
            </motion.div>
          </AnimatePresence>
          <Magnetic className="mt-4">
            <Link to={`/product/${active.slug}`} className="btn btn-primary h-12 px-6 md:h-14 md:px-8">
              Shop now →
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
