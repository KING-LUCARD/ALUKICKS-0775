import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Custom cursor (pointer: fine only). Elements can set data-cursor="View" / "Drag"
 * to show a label inside the expanded ring.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input, select, textarea, label");
      setLabel(el?.dataset.cursor ?? null);
      setHovering(!!el);
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 88 : hovering ? 44 : 12;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", mixBlendMode: label ? "normal" : "difference" }}
      animate={{
        width: size,
        height: size,
        backgroundColor: label ? "#FF4A1C" : hovering ? "rgba(237,234,227,0)" : "#EDEAE3",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            className="label text-[10px] font-medium text-vanta"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="absolute inset-0 rounded-full border border-bone/70" style={{ opacity: hovering && !label ? 1 : 0 }} />
    </motion.div>
  );
}
