import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Serve the same security headers as production (vercel.json) in `vite preview`, so CSP problems show up locally.
const vercel = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
const securityHeaders: Record<string, string> = Object.fromEntries(
  vercel.headers
    .find((h: { source: string }) => h.source === "/(.*)")
    .headers.filter((h: { key: string }) => h.key !== "Strict-Transport-Security")
    .map((h: { key: string; value: string }) => [h.key, h.value]),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Bundle the package for the prerender step so its CSS imports are handled by Vite, not Node.
  ssr: { noExternal: ["coat-of-arms"] },
  preview: { headers: securityHeaders },
});
