FROM node:21-slim AS build
WORKDIR /app

COPY package*.json .
COPY pnpm-lock.yaml .

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install

COPY . .

RUN pnpm run build


FROM node:21-slim AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/assets ./assets
COPY --from=build /app/package*.json ./
COPY --from=build /app/pnpm-lock.yaml ./

RUN mkdir -p /app/tmp && chmod 777 /app/tmp
RUN mkdir -p /app/bot_sessions && chmod 777 /app/bot_sessions

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --prod

EXPOSE 3000
CMD ["pnpm", "start"]

# mkdir -p /var/www/bot_sessions/kiky
# sudo docker build -t chatbot-baileys .
# sudo docker rm -f chatbot-kiky
# sudo docker run -d -p 7000:3000 -e ENV_FILE=.env.kiky --env-file .env.kiky -v /var/www/bot_sessions/kiky:/app/bot_sessions --name chatbot-kiky chatbot-baileys