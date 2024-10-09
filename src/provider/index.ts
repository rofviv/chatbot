import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { createProvider } from "@builderbot/bot"
import { config } from "../config"

export const provider = createProvider(Provider)