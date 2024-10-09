import { createFlow } from "@builderbot/bot"
import { mainFlow } from "./main_flow"
import { faqFlow } from "./faq_flow"
export default createFlow([
    mainFlow,
    faqFlow
])