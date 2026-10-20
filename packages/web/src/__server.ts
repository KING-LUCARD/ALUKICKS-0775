import app from "./api";
import path from "node:path";

const port = Number(process.env.PORT ?? 3000);
const distDir = path.resolve(import.meta.dirname, "../dist");
const indexPath = path.join(distDir, "index.html");

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

function withSecurityHeaders(response: Response, request: Request) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (new URL(request.url).protocol === "https:" || forwardedProto === "https") {
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const server = Bun.serve({
  hostname: "0.0.0.0",
  port,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return withSecurityHeaders(await app.fetch(request), request);
    }

    let filePath: string;
    try {
      filePath = getStaticFilePath(url.pathname);
    } catch {
      return withSecurityHeaders(new Response("Bad Request", { status: 400 }), request);
    }

    if (!filePath) {
      return withSecurityHeaders(new Response("Bad Request", { status: 400 }), request);
    }

    const file = Bun.file(filePath);
    if (await file.exists()) {
      return withSecurityHeaders(
        new Response(file, {
          headers: { "Content-Type": file.type || "application/octet-stream" },
        }),
        request,
      );
    }

    const index = Bun.file(indexPath);
    if (await index.exists()) {
      return withSecurityHeaders(
        new Response(index, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
        request,
      );
    }

    return withSecurityHeaders(
      new Response("Build output not found. Run `bun run build:web` first.", {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }),
      request,
    );
  },
});

console.log(`Web server listening on port ${server.port}`);

function getStaticFilePath(pathname: string): string | null {
  const decodedPath = decodeURIComponent(pathname);
  const candidate = path.resolve(distDir, `.${decodedPath}`);
  if (candidate !== distDir && !candidate.startsWith(distDir + path.sep)) {
    return null;
  }
  return candidate;
}
