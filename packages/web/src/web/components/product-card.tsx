import { motion } from "motion/react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import type { Product } from "../types/product";
import { useStore } from "../lib/store";
import { EASE, money } from "../lib/format";
import { Tilt } from "./tilt";

export function ProductCard({ product, index = 0, size = "md" }: { product: Product; index?: number; size?: "md" | "lg" }) {
  const { wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 4) * 0.08 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block" data-cursor="View">
        <Tilt max={10} className={`relative overflow-hidden bg-carbon ${size === "lg" ? "aspect-[4/5]" : "aspect-[4/5]"}`}>
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: `radial-gradient(60% 50% at 50% 55%, ${product.accent}40, transparent 70%)` }}
          />
          <div className="grid-lines absolute inset-0 opacity-40" />
          <span className="label absolute left-4 top-4 text-ash">/{String(index + 1).padStart(2, "0")}</span>
          {product.badge && (
            <span className={`label absolute right-4 top-4 px-2 py-1 text-[10px] ${product.badge === "Limited" ? "bg-infra text-vanta" : "border border-bone/30"}`}>
              {product.badge}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center p-8" style={{ transform: "translateZ(60px)" }}>
            <img
              src={product.image}
              alt={`${product.model} ${product.colorway}`}
              loading="lazy"
              className="shoe-shadow w-full max-w-[92%] -rotate-[4deg] object-contain transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-4 group-hover:-rotate-[12deg] group-hover:scale-[1.08]"
            />
          </div>
          <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="label text-bone/70">{product.category}</span>
            <span className="label text-infra">View →</span>
          </div>
        </Tilt>
      </Link>
      <button
        onClick={() => toggleWish(product.id)}
        className="absolute right-4 top-12 z-10 p-1 text-bone/60 transition hover:text-bone"
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        <motion.span animate={{ scale: wished ? [1, 1.4, 1] : 1 }} className="block">
          <Heart size={16} fill={wished ? "#FF4A1C" : "transparent"} stroke={wished ? "#FF4A1C" : "currentColor"} />
        </motion.span>
      </button>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="display-narrow text-xl md:text-2xl">{product.model}</h3>
          <p className="label mt-1 text-ash">{product.colorway}</p>
        </div>
        <p className="font-mono text-sm">{money(product.price)}</p>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/5] animate-pulse bg-carbon" />
      <div className="mt-4 h-5 w-2/3 animate-pulse bg-carbon" />
      <div className="mt-2 h-3 w-1/3 animate-pulse bg-carbon" />
    </div>
  );
}
