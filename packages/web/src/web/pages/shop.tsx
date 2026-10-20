import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useSearch } from "wouter";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "../queries/products";
import { useStore } from "../lib/store";
import { EASE } from "../lib/format";
import type { Category, ColorFamily } from "../types/product";
import { ProductCard, ProductCardSkeleton } from "../components/product-card";
import { SplitHeading } from "../components/motion";

const CATEGORIES: ("All" | Category)[] = ["All", "Running", "Lifestyle", "Court", "Trail", "High-Top"];
const COLORS: { name: ColorFamily; hex: string }[] = [
  { name: "Black", hex: "#0A0A0A" },
  { name: "White", hex: "#EDEAE3" },
  { name: "Grey", hex: "#8C8A85" },
  { name: "Red", hex: "#FF4A1C" },
  { name: "Green", hex: "#6B7A45" },
  { name: "Blue", hex: "#2F5BFF" },
];
const SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];
const SORTS = ["Featured", "Newest", "Price: Low → High", "Price: High → Low"] as const;
type Sort = (typeof SORTS)[number];

export default function ShopPage() {
  const search = useSearch();
  const initialCat = (new URLSearchParams(search).get("c") as Category | null) ?? "All";
  const { data: products, isLoading } = useProducts();
  const { wishlist } = useStore();

  const [category, setCategory] = useState<"All" | Category>(initialCat);
  const [colors, setColors] = useState<ColorFamily[]>([]);
  const [size, setSize] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(350);
  const [wishOnly, setWishOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("Featured");
  const [panel, setPanel] = useState(false);

  useEffect(() => setCategory(initialCat), [initialCat]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (colors.length === 0 || colors.includes(p.colorFamily)) &&
        (size === null || (p.sizes.includes(size) && !p.soldOut.includes(size))) &&
        p.price <= maxPrice &&
        (!wishOnly || wishlist.includes(p.id)),
    );
    if (sort === "Newest") list = [...list].sort((a, b) => b.release.localeCompare(a.release));
    if (sort === "Price: Low → High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High → Low") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, colors, size, maxPrice, wishOnly, sort, wishlist]);

  const activeFilters = colors.length + (size ? 1 : 0) + (maxPrice < 350 ? 1 : 0) + (wishOnly ? 1 : 0);
  const reset = () => {
    setColors([]);
    setSize(null);
    setMaxPrice(350);
    setWishOnly(false);
  };

  return (
    <div className="pt-28 md:pt-36">
      <header className="px-gutter grid gap-8 pb-12 md:grid-cols-12 md:pb-16">
        <div className="md:col-span-12">
          <p className="label mb-4 text-ash">Shop / {category}</p>
          <SplitHeading as="h1" animateOnMount className="display text-[clamp(2.6rem,9vw,11rem)]" lines={["The", <span key="b">Collection<span className="text-infra">.</span></span>]} />
        </div>
        <p className="max-w-sm text-ash md:col-span-4 md:col-start-9">
          Eight silhouettes. Four disciplines. One philosophy: nothing that doesn't move you forward.
        </p>
      </header>

      {/* toolbar */}
      <div className="sticky top-0 z-30 border-y border-line bg-vanta/85 backdrop-blur-xl">
        <div className="px-gutter flex items-center gap-4 py-3">
          <div className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto px-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`label relative shrink-0 px-4 py-2.5 transition-colors ${category === c ? "text-vanta" : "text-bone/70 hover:text-bone"}`}
              >
                {category === c && <motion.span layoutId="cat-pill" className="absolute inset-0 bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="label hidden border border-line bg-vanta px-3 py-2.5 text-bone outline-none md:block"
            aria-label="Sort"
          >
            {SORTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => setPanel(true)} className="label flex shrink-0 items-center gap-2 border border-line px-4 py-2.5 hover:border-bone/50">
            <SlidersHorizontal size={14} /> Filter{activeFilters > 0 && <span className="text-infra">({activeFilters})</span>}
          </button>
        </div>
      </div>

      <section className="px-gutter py-12">
        <div className="label mb-8 flex items-center justify-between text-ash">
          <span>{isLoading ? "—" : filtered.length} results</span>
          {activeFilters > 0 && (
            <button onClick={reset} className="link-u hover:text-bone">Clear filters</button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-32 text-center">
            <p className="display text-6xl text-bone/15">Nothing here</p>
            <p className="text-ash">No pairs match those filters.</p>
            <button onClick={reset} className="btn btn-ghost">Reset filters</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: EASE }}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* filter panel */}
      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.aside
              data-lenis-prevent
              className="fixed left-0 top-0 z-[61] flex h-full w-full max-w-[420px] flex-col border-r border-line bg-carbon"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="display text-2xl">Filter</span>
                <button onClick={() => setPanel(false)} aria-label="Close filters" className="p-2"><X size={20} /></button>
              </div>
              <div className="flex-1 space-y-10 overflow-y-auto px-6 py-8">
                <div className="md:hidden">
                  <p className="label mb-4 text-ash">Sort</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SORTS.map((s) => (
                      <button key={s} onClick={() => setSort(s)} className={`label border px-3 py-3 text-left ${sort === s ? "border-bone bg-bone text-vanta" : "border-line"}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label mb-4 text-ash">Colour</p>
                  <div className="grid grid-cols-3 gap-2">
                    {COLORS.map((c) => {
                      const on = colors.includes(c.name);
                      return (
                        <button
                          key={c.name}
                          onClick={() => setColors((prev) => (on ? prev.filter((x) => x !== c.name) : [...prev, c.name]))}
                          className={`label flex items-center gap-2 border px-3 py-3 transition-colors ${on ? "border-bone" : "border-line hover:border-bone/40"}`}
                        >
                          <span className="h-3 w-3 border border-bone/30" style={{ background: c.hex }} /> {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="label mb-4 text-ash">Size (US) — in stock</p>
                  <div className="grid grid-cols-5 gap-1">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(size === s ? null : s)}
                        className={`font-mono border py-3 text-xs transition-colors ${size === s ? "border-infra bg-infra text-vanta" : "border-line hover:border-bone/40"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="label mb-4 flex justify-between text-ash">
                    <span>Max price</span>
                    <span className="text-bone">${maxPrice}</span>
                  </div>
                  <input aria-label="Maximum price" type="range" min={200} max={350} step={5} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#FF4A1C]" />
                </div>
                <label className="label flex cursor-pointer items-center justify-between border border-line px-4 py-4">
                  Wishlist only ({wishlist.length})
                  <input aria-label="Wishlist only" type="checkbox" checked={wishOnly} onChange={(e) => setWishOnly(e.target.checked)} className="h-4 w-4 accent-[#FF4A1C]" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-line p-6">
                <button onClick={reset} className="btn btn-ghost">Reset</button>
                <button onClick={() => setPanel(false)} className="btn btn-primary">Show {filtered.length}</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
