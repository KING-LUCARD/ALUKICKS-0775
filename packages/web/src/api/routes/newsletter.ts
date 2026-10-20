import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export const newsletter = {
  subscribe: base.input(z.object({ email: z.string().email() })).handler(async ({ input }) => {
    await db.insert(schema.subscribers).values({ email: input.email.toLowerCase() }).onConflictDoNothing();
    return { ok: true };
  }),
};
