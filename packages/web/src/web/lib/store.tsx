import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../types/product";

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  image: string;
  price: number;
  size: number;
  qty: number;
}

interface StoreValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (p: Product, size: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = usePersisted<CartLine[]>("alukicks.cart", []);
  const [wishlist, setWishlist] = usePersisted<string[]>("alukicks.wish", []);
  const [cartOpen, setCartOpen] = useState(false);

  const add = useCallback(
    (p: Product, size: number) => {
      const key = `${p.id}-${size}`;
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(10, l.qty + 1) } : l));
        return [
          ...prev,
          { key, productId: p.id, slug: p.slug, name: p.model, colorway: p.colorway, image: p.image, price: p.price, size, qty: 1 },
        ];
      });
      setCartOpen(true);
    },
    [setLines],
  );

  const value = useMemo<StoreValue>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.price, 0),
      add,
      setQty: (key, qty) =>
        setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(10, qty) } : l)))),
      remove: (key) => setLines((prev) => prev.filter((l) => l.key !== key)),
      clear: () => setLines([]),
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWish: (id) => setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    }),
    [lines, wishlist, cartOpen, add, setLines, setWishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
