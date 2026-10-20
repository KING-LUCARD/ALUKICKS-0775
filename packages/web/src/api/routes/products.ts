import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { catalog } from "../data/catalog";

export const products = {
  list: base.handler(() => catalog),
  get: base.input(z.object({ slug: z.string() })).handler(({ input }) => {
    const product = catalog.find((p) => p.slug === input.slug);
    if (!product) throw new ORPCError("NOT_FOUND", { message: "Product not found" });
    const related = catalog.filter((p) => p.slug !== input.slug && (p.model === product.model || p.category === product.category));
    const fill = catalog.filter((p) => p.slug !== input.slug && !related.includes(p));
    const colorways = catalog.filter((p) => p.model === product.model);
    return { product, colorways, related: [...related, ...fill].slice(0, 4) };
  }),
};
