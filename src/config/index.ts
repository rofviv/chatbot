import "dotenv/config"

export const config = {
    port: process.env.PORT ?? 3008,
    host: process.env.HOST ?? '0.0.0.0',
    // AI
    model: process.env.MODEL ?? 'gpt-3.5-turbo',
    apiKeyAI: process.env.API_KEY_AI ?? '',
    patioServiceUrl: process.env.PATIO_SERVICE_URL ?? 'http://localhost:3000',
    patioServiceToken: process.env.PATIO_SERVICE_TOKEN ?? 'patio-service-token',
}
