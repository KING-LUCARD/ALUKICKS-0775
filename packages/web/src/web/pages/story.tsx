import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "wouter";
import { Marquee, Reveal, SplitHeading } from "../components/motion";

const VALUES = [
  { n: "01", t: "Precision", b: "Every millimetre of foam, every gram of yarn is argued over. If it doesn't move you, it doesn't ship." },
  { n: "02", t: "Restraint", b: "Black, bone and one line of Infra. We remove until only the statement is left." },
  { n: "03", t: "Movement", b: "Built for the run, the commute, the 3am walk home. Performance that doesn't announce itself." },
  { n: "04", t: "Longevity", b: "Stitched cupsoles, resoleable builds and a lifetime repair programme. Fewer, better pairs." },
];

export default function StoryPage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div className="pt-28 md:pt-36">
      <section className="px-gutter pb-20">
        <p className="label mb-6 text-ash">The story — est. 2019</p>
        <SplitHeading as="h1" animateOnMount className="display text-[clamp(3rem,11vw,12rem)]" lines={["More than", "a shoe.", <span key="c" className="text-infra">A statement.</span>]} />
      </section>

      <div className="border-y border-line py-5">
        <Marquee className="display-narrow text-2xl text-ash md:text-4xl" items={["Precision", "Restraint", "Movement", "Longevity", "Built to move"]} speed={35} />
      </div>

      <section className="px-gutter grid gap-14 py-28 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="display-narrow text-3xl leading-tight md:text-4xl">
            ALU KICKS began in a Paris basement with one question: what if a sneaker could be as quiet as it is fast?
          </p>
        </Reveal>
        <Reveal delay={0.15} className="space-y-5 text-ash md:col-span-5 md:col-start-8">
          <p>ALU KICKS builds footwear that absorbs attention and returns energy. We design in silence — no loud logos, no gimmicks — and let silhouette, material and motion do the talking.</p>
          <p>Each release is produced in small runs with partner factories in Portugal and Vietnam, tested by runners, dancers and couriers across six cities before it ever reaches a box.</p>
        </Reveal>
      </section>

      <section ref={ref} className="relative h-[80svh] overflow-hidden">
        <motion.img style={{ y, scale: 1.3 }} src="/images/campaign/macro.webp" alt="ALU KICKS material detail" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-vanta/40" />
        <div className="px-gutter relative flex h-full items-end pb-14">
          <p className="display text-[clamp(2.5rem,8vw,8rem)]">Built to<br />move<span className="text-infra">.</span></p>
        </div>
      </section>

      <section className="px-gutter py-28">
        <p className="label mb-10 text-ash">What we stand on</p>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.08} className="group bg-vanta p-8 transition-colors duration-500 hover:bg-carbon">
              <p className="label text-infra">/{v.n}</p>
              <p className="display mt-16 text-4xl">{v.t}</p>
              <p className="mt-4 text-sm leading-relaxed text-ash">{v.b}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-10">
          <p className="display-narrow text-3xl md:text-5xl">Find the pair that moves you.</p>
          <Link to="/shop" className="btn btn-primary">Shop the collection →</Link>
        </div>
      </section>
    </div>
  );
}
