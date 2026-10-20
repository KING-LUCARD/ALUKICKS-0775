import { motion, useInView, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useRef } from "react";
import { EASE } from "../lib/format";

/** Fade-up reveal when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  ...rest
}: { children: React.ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line reveal: each line slides up from behind a clip.
 * Visibility is observed on the wrapper (the clipped lines themselves never intersect).
 */
export function SplitHeading({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  animateOnMount = false,
  as: Tag = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  animateOnMount?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = animateOnMount || inView;
  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={{ y: "110%" }}
            animate={show ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Wraps a child and pulls it toward the pointer. */
export function Magnetic({ children, strength = 0.35, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({
  items,
  speed = 30,
  reverse = false,
  className,
  separator = <span className="mx-8 inline-block h-3 w-3 rotate-45 bg-infra align-middle" />,
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  className?: string;
  separator?: React.ReactNode;
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          {t}
          {separator}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`flex overflow-hidden ${className ?? ""}`}>
      <div
        className="animate-marquee flex w-max"
        style={{ ["--marquee-speed" as string]: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
