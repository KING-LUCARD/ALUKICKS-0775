# App template

Runable copies this Bun and Turborepo project into each new sandbox.

The root package commands are the external contract:

- `bun run dev` starts the web app.
- `bun run dev:desktop` and `bun run dev:mobile` start platform clients.
- `bun run build` builds every package.
- `bun run start` starts or restarts the production server.
- `bun run stop` stops the production server.
- `bun run lint` and `bun run typecheck` validate the project.
- The `db:generate`, `db:migrate`, and `db:push` commands manage the database.

Deployment tools depend on these command names. Their implementations may change, but the names must remain stable.

The web package owns the API, database, and shared web interface. The mobile package is an Expo client. The desktop package is an Electron shell around the web app. Services use the fixed ports defined in `__ports.cjs`, and the web health endpoint is `/api/health`.

Secrets belong in the root `.env` file. Browser values must use the `VITE_` prefix. Commands prefixed with `internal:` are for template maintenance.

---

## ALU KICKS — project map

- **Design system:** `design.md` (colors, type, motion rules). Tokens live in `packages/web/src/web/styles.css` (`@theme`).
- **Products:** `packages/web/src/api/data/catalog.ts` — add a sneaker by dropping a transparent `.webp` into `packages/web/public/images/products/` and appending an entry.
- **API (oRPC):** `src/api/routes/products.ts` (list/get), `orders.ts` (server-side priced checkout → `orders` table), `newsletter.ts` (→ `subscribers` table).
- **Pages:** `src/web/pages/` — `index` (home), `shop`, `product`, `checkout`, `story`, `not-found`.
- **Home sections:** `src/web/components/home/` — hero, manifesto, collection-rail, anatomy, campaign, lookbook, next-drop.
- **Motion primitives:** `components/motion.tsx` (Reveal, SplitHeading, Magnetic, Marquee), `tilt.tsx`, `cursor.tsx`, `preloader.tsx`, `smooth-scroll.tsx` (Lenis).
- **Cart / wishlist:** `src/web/lib/store.tsx` (React context + localStorage).
- **Payments:** checkout is in demo mode; swap the payment fieldset for Stripe/Autumn when ready.
