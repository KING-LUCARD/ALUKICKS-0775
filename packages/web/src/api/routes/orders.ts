import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { catalog } from "../data/catalog";

const FREE_SHIPPING_THRESHOLD = 250;
const SHIPPING = 15;

export const orders = {
  create: base
    .input(
      z.object({
        email: z.string().email().max(254),
        name: z.string().trim().min(2).max(100),
        address: z.object({
          line1: z.string().trim().min(3).max(200),
          city: z.string().trim().min(2).max(100),
          postcode: z.string().trim().min(2).max(20),
          country: z.string().trim().min(2).max(80),
        }),
        items: z
          .array(z.object({ productId: z.string(), size: z.number(), qty: z.number().int().min(1).max(10) }))
          .min(1).max(20),
      }),
    )
    .handler(async ({ input }) => {
      // Prices are always recomputed server-side from the catalog.
      const items = input.items.map((item) => {
        const product = catalog.find((p) => p.id === item.productId);
        if (!product) throw new ORPCError("BAD_REQUEST", { message: `Unknown product ${item.productId}` });
        if (!product.sizes.includes(item.size) || product.soldOut.includes(item.size))
          throw new ORPCError("BAD_REQUEST", { message: `${product.model} US ${item.size} is unavailable` });
        return { productId: product.id, name: `${product.model} ${product.colorway}`, size: item.size, qty: item.qty, price: product.price };
      });
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING;
      const number = `AK-${Date.now().toString(36).toUpperCase()}`;
      const [order] = await db
        .insert(schema.orders)
        .values({ number, email: input.email, name: input.name, address: input.address, items, subtotal, shipping, total: subtotal + shipping })
        .returning();
      return order;
    }),
};
