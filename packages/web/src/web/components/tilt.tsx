import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

/** Pointer-driven 3D tilt. Children get `transform-style: preserve-3d` depth. */
export function Tilt({
  children,
  max = 12,
  className,
  scope = "self",
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
  /** "window" tracks pointer anywhere on screen (hero) */
  scope?: "self" | "window";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max * 0.7, -max * 0.7]);

  const handle = (clientX: number, clientY: number) => {
    if (reduce) return;
    if (scope === "window") {
      px.set(clientX / window.innerWidth);
      py.set(clientY / window.innerHeight);
      return;
    }
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((clientX - r.left) / r.width);
    py.set((clientY - r.top) / r.height);
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1200 }}
      onPointerMove={(e) => handle(e.clientX, e.clientY)}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
