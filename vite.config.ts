import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { IncomingMessage, ServerResponse } from "node:http";

/**
 * En production, `api/soumission.ts` est déployé comme fonction serverless par
 * Vercel. Ce plugin la monte aussi pendant `npm run dev`, afin que le
 * formulaire de soumission fonctionne sans avoir à lancer `vercel dev`.
 */
function apiDevServer(): Plugin {
  return {
    name: "bioanlov-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        "/api/soumission",
        async (req: IncomingMessage, res: ServerResponse) => {
          const send = (code: number, payload: unknown) => {
            res.statusCode = code;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(payload));
          };

          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);
            const raw = Buffer.concat(chunks).toString("utf8");

            const shimmed = req as IncomingMessage & { body?: unknown };
            try {
              shimmed.body = raw ? JSON.parse(raw) : {};
            } catch {
              return send(400, { error: "Requête invalide." });
            }

            // Vercel expose `res.status().json()` : on reproduit ces deux méthodes.
            const shimmedRes = res as ServerResponse & {
              status?: (code: number) => unknown;
              json?: (payload: unknown) => unknown;
            };
            shimmedRes.status = (code: number) => {
              res.statusCode = code;
              return shimmedRes;
            };
            shimmedRes.json = (payload: unknown) => {
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify(payload));
              return shimmedRes;
            };

            const module = (await server.ssrLoadModule("/api/soumission.ts")) as {
              default: (request: unknown, response: unknown) => Promise<unknown>;
            };
            await module.default(shimmed, shimmedRes);
          } catch (error) {
            server.config.logger.error(`[api/soumission] ${String(error)}`);
            if (!res.writableEnded) send(500, { error: "Erreur interne du serveur de dev." });
          }
        },
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  // Rend RESEND_API_KEY & co. disponibles dans process.env pour le plugin ci-dessus.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), tailwindcss(), apiDevServer()],
    server: { port: 5173 },
    build: { outDir: "dist" },
  };
});
