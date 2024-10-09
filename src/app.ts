import { join } from 'path'
import { createBot, } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { config } from './config'
import { provider } from './provider'
import templates from './templates'

const PORT = config.port

const main = async () => {
    
    const { handleCtx, httpServer } = await createBot({
        flow: templates,
        provider: provider,
        database: new Database(),
    })
   
    httpServer(+PORT)
}

main()
