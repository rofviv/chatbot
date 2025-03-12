## Whatsapp Chatbot Baileys
node: 20.11.0
pnpm: 9.12.1

#### comands:
pnpm run dev

#### New client
- Edit .env file with your credentials DOMAIN
- Edit prompts/prompt_ai_order.txt with your new prompt
- Edit constants.ts with your new constants providerName, clientMerchantId

#### Start server
- Change {provider} with your new provider name (kiky, burger, etc)
- Dont forget to create or change .env.{provider} with your new credentials

```bash
ENV_FILE=.env.{provider} pnpm run dev
```

#### Build docker
- Change {provider} with your new provider name (kiky, burger, etc)
- Change {port} with your new port (7000, 7001, etc)
- Dont forget to create or change .env.{provider} with your new credentials

```bash
sudo docker build -t chatbot-baileys .
sudo docker rm -f chatbot-{provider}
sudo docker run -d -p {port}:3000 -e ENV_FILE=.env.{provider} --env-file .env.{provider} --name chatbot-{provider} chatbot-baileys
```
