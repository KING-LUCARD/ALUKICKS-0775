import { motion, useScroll, useTransform, type MotionValue, useInView, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Marquee } from "../motion";

const WORDS = "More than a shoe. A statement. Every pair is engineered in silence and built for noise — sculpted foam, seamless knit, and a single line of colour that says everything.".split(" ");

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const accent = word.startsWith("statement") || word === "colour";
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${accent ? "text-infra" : ""}`}>
      {word}
    </motion.span>
  );
}

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

const STATS = [
  { v: 248, s: "g", l: "Flagship weight / US 9" },
  { v: 72, s: "%", l: "WAVEFORM energy return" },
  { v: 8, s: "mm", l: "Heel-to-toe drop" },
  { v: 1, s: "", l: "Colour that matters" },
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section className="relative">
      <div className="relative -rotate-2 bg-infra py-4 text-vanta">
        <Marquee
          className="display text-3xl md:text-5xl"
          items={["Built to move", "More than a shoe. A statement.", "Drop 04 — Phantom 01", "Engineered in silence"]}
          separator={<span className="mx-8 inline-block h-3 w-3 rotate-45 bg-vanta align-middle" />}
          speed={40}
        />
      </div>

      <div className="px-gutter grid gap-16 py-28 md:grid-cols-12 md:py-40">
        <div className="label text-ash md:col-span-3">
          <p>/01 — Manifesto</p>
          <p className="mt-2">ALU KICKS Footwear, est. 2019</p>
        </div>
        <div ref={ref} className="md:col-span-9">
          <p className="display-narrow text-[clamp(2.2rem,5.4vw,5.6rem)] leading-[0.95]">
            {WORDS.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / WORDS.length, (i + 1) / WORDS.length]} />
            ))}
          </p>
          <div className="mt-20 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="bg-vanta p-6 md:p-8">
                <p className="display text-5xl md:text-6xl">
                  <Counter to={s.v} suffix={s.s} />
                </p>
                <p className="label mt-4 text-ash">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
