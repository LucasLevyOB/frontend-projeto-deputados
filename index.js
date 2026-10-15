import { createRequestHandler } from "@react-router/express";
import express from "express";

const app = express();

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || "0.0.0.0";

// 1. Arquivos estáticos do cliente
app.use(
  "/assets",
  express.static("build/client/assets", { immutable: true, maxAge: "1y" })
);
app.use(express.static("build/client", { maxAge: "1h" }));
app.use(express.static("public", { maxAge: "1h" }));

// 2. Cache-Control padrão para respostas SSR na CDN do Firebase App Hosting
app.use((_req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
  );
  next();
});

// 3. React Router SSR handler (sintaxe compatível com Express 5 / path-to-regexp)
app.all(
  "/{*splat}",
  createRequestHandler({
    build: () => import("./build/server/index.js"),
  })
);

app.listen(port, host, () => {
  console.log(`[server] Servidor rodando em http://${host}:${port}`);
});
