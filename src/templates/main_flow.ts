import {  addKeyword, EVENTS } from "@builderbot/bot"
import { faqFlow } from "./faq_flow"


const mainFlow = addKeyword(EVENTS.WELCOME)
    // .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
    .addAction( async (ctx, ctxFn) => {
        return ctxFn.gotoFlow(faqFlow)
    })

export { mainFlow }