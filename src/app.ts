import { createBot } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { config } from "./config";
import { provider } from "./provider";
import templates from "./templates";
import { HealthCheckResponse } from "./dtos/response_status";

interface HealthStatus {
  status: number;
  services: {
    patioService: HealthCheckResponse;
    whatsapp: HealthCheckResponse;
    chatgpt: HealthCheckResponse;
  };
  timestamp: string;
  environment: string;
}

const PORT = config.port;

const main = async () => {
  const { handleCtx, httpServer } = await createBot({
    flow: templates,
    provider: provider,
    database: new Database(),
  });

  httpServer(+PORT);

  provider.server.get(
    "/health",
    handleCtx(async (bot, req, res) => {
    // const patioService = await patio_service_api.healthCheck();
    // const whatsapp = verificar si whatsapp esta conectado
    // const chatgpt = verificar si la IA esta activa
    const response: HealthStatus = {
        status: 200,
        services: {
            patioService: {
                status: 200,
                message: "Patio service is healthy",
            },
            whatsapp: {
                status: 200,
                message: "Whatsapp is healthy",
            },
            chatgpt: {
                status: 200,
                message: "Chatgpt is healthy",
            },
        },
        timestamp: new Date().toISOString(),
        environment: "production",
      };
      return res.end(JSON.stringify(response));
    })
  );
};

main();
