import { serve } from "@hono/node-server";
import {
  CopilotRuntime,
  createCopilotEndpointSingleRoute,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

const agent = new LangGraphAgent({
  deploymentUrl: process.env.LANGGRAPH_DEPLOYMENT_URL ?? "http://localhost:8123",
  graphId: "default",
  langsmithApiKey: process.env.LANGSMITH_API_KEY ?? "",
  assistantConfig: {
    recursion_limit: Number(process.env.LANGGRAPH_RECURSION_LIMIT ?? 60),
  },
});

import { logger } from "hono/logger";
import { cors } from "hono/cors";

const app = createCopilotEndpointSingleRoute({
  basePath: "/api/copilotkit",
  runtime: new CopilotRuntime({
    agents: { default: agent },
  }),
});

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

import * as fs from "node:fs";
import * as path from "node:path";

// Ruta de salud para verificar que el servidor responde
app.get("/api/health", (c) => c.json({ status: "ok", runtime: "v2" }));

// Endpoint para proveer los beneficios actualizados al frontend
app.get("/api/benefits", (c) => {
  try {
    const dataPath = path.resolve(__dirname, "../../agent/data/benefits.json");
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf-8");
      return c.json(JSON.parse(data));
    }
    return c.json([]);
  } catch (error) {
    console.error("Error reading benefits.json:", error);
    return c.json({ error: "Failed to load benefits" }, 500);
  }
});

const port = Number(process.env.PORT) || 4000;

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`BFF ready at http://localhost:${port}`);
});
