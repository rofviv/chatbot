## Whatsapp Chatbot Baileys
node: 20.11.0
pnpm: 9.12.1
provider-whatsapp: Baileys

#### New client
- Create credentials api key from openai: https://platform.openai.com/api-keys
- Create .env.{provider} file with your new credentials and variables
- Create files assets/prompts/{provider}.txt with your new prompt

#### Start server
```bash
ENV_FILE=.env.{provider} pnpm run dev
```

#### Deploy server
- Add new provider and port in VM /var/www/whatsappbot/index.php
- create bot_sessions folder in /var/www/bot_sessions/{provider}
- Clone repo in /var/www/chatbot/
- Copy or create .env.{provider} file in /var/www/chatbot/
- Create docker image with Dockerfile (See commands below)
- Run docker container with docker run command (See commands below)

#### Build docker commands
- Change {provider} with your new provider name (kiky, burger, etc)
- Change {port} with your config port in index.php
- Dont forget to create or change .env.{provider} with your new credentials
- Change {version} with your new version of docker image if needed

```bash
mkdir -p /var/www/bot_sessions/{provider}
sudo docker build -t chatbot-baileys:{version} .
sudo docker rm -f chatbot-{provider}
sudo docker run -d -p {port}:3000 -e ENV_FILE=.env.{provider} --env-file .env.{provider} -v /var/www/bot_sessions/{provider}:/app/bot_sessions --name chatbot-{provider} chatbot-baileys:{version}
```

#### Project structure
- assets
    - prompts
        - {provider}
            - menu.txt                          // (greeting message and menu options)
            - prompt_ai_order.txt               // (Init prompt for AI)
            - medias.json                       // (optional)
        - prompt_format_order.txt               // (format order message for every provider)
        - promt_finish_order.txt                // (format finish order message for every provider)
        - promt_intention_detection.txt         // (intention detection user message)
- src
    - config
        - index.ts                              // (type variables from .env)
    - dtos
        - {file}.dto.ts                         // (type class for json body)
    - models
        - {file}.model.ts                       // (type class from json response)
    - provider
        - index.ts                              // (provider whatsapp login)
    - services
        - {file}.service.ts                     // (services file)
    - templates
        - {file}.template.ts                    // (templates file. Flow of messages chatbot)
    - translations
        - {file}.ts                             // (translations file)
    - utils
        - {file}.utils.ts                       // (utils file)
    - app.ts                                    // (main file)
