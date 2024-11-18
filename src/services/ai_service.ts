import OpenAI from 'openai'
import { config } from '../config'

class AIService {
    private static apiKey: string
    private openAI: OpenAI

    constructor(apiKey: string) {
        AIService.apiKey = apiKey
        this.openAI = new OpenAI({
            apiKey: AIService.apiKey,
        })
    }

    async chat(prompt: string, messages: any[]): Promise<string> {
        try {
            const completion = await this.openAI.chat.completions.create({
                model: config.model,
                messages: [
                    { role: 'system', content: prompt },
                    ...messages
                ]
            })
            const answer = completion.choices[0].message.content || 'No answer';
            return answer
        } catch (error) {
            console.error('Error in chat:', error)
            throw error
        }
    }
}

export default new AIService(config.apiKeyAI);