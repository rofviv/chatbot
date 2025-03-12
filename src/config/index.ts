import { config as dotenvConfig } from "dotenv"
import path from "path"

const envFile = process.env.ENV_FILE || ".env"
const envPath = path.resolve(process.cwd(), 
    envFile.startsWith('.env') ? envFile : `.env.${envFile}`
)

dotenvConfig({ path: envPath })
console.log(`Loading environment from: ${envPath}`)

export const config = {
    port: process.env.PORT ?? 3008,
    host: process.env.HOST ?? '0.0.0.0',
    // AI
    model: process.env.MODEL ?? 'gpt-3.5-turbo',
    apiKeyAI: process.env.API_KEY_AI ?? '',
    patioServiceUrl: process.env.PATIO_SERVICE_URL ?? 'http://localhost:3000',
    patioServiceToken: process.env.PATIO_SERVICE_TOKEN ?? 'patio-service-token',
    // Translation
    defaultLanguage: process.env.DEFAULT_LANGUAGE ?? 'es',
    domain: process.env.DOMAIN ?? 'chatbot.patiodelivery.com',
    clientMerchantId: (process.env.CLIENT_MERCHANT_ID ?? 1) as number,
    merchantDefaultId: (process.env.MERCHANT_DEFAULT_ID ?? 1) as number,
    providerAssetsOrder: process.env.PROVIDER_ASSETS_ORDER ?? 'default',
    providerAssetsMenu: process.env.PROVIDER_ASSETS_MENU ?? 'default'
}
