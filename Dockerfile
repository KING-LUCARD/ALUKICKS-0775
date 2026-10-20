FROM oven/bun:1.3.14-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY . .
RUN bun install
RUN bun run build:web

ENV PORT=3000
EXPOSE 3000

# Avoid Bun CLI flag parsing issues by changing directory in the shell.
CMD ["sh", "-c", "cd packages/web && bun run start"]
