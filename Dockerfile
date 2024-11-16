# # Image size ~ 400MB
# # FROM node:21-alpine3.18 as builder
# FROM node:21-slim AS build

# WORKDIR /app

# RUN corepack enable && corepack prepare pnpm@latest --activate
# ENV PNPM_HOME=/usr/local/bin

# COPY . .

# COPY package*.json *-lock.yaml ./

# RUN apk add --no-cache --virtual .gyp \
#         python3 \
#         make \
#         g++ \
#     && apk add --no-cache git \
#     && pnpm install && pnpm run build \
#     && apk del .gyp

# # FROM node:21-alpine3.18 as deploy
# FROM node:21-slim AS production

# WORKDIR /app

# ARG PORT
# ENV PORT $PORT
# EXPOSE $PORT

# COPY --from=builder /app/assets ./assets
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/*.json /app/*-lock.yaml ./

# RUN corepack enable && corepack prepare pnpm@latest --activate 
# ENV PNPM_HOME=/usr/local/bin

# RUN npm cache clean --force && pnpm install --production --ignore-scripts \
#     && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
#     && rm -rf $PNPM_HOME/.npm $PNPM_HOME/.node-gyp

# CMD ["npm", "start"]

# Primera etapa: compilación
FROM node:21-slim AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json .
COPY pnpm-lock.yaml .

# Instalar dependencias
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN pnpm run build

# Segunda etapa: producción
FROM node:21-slim AS production
WORKDIR /app

# Copiar archivos necesarios de la etapa de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/assets ./assets
COPY --from=build /app/package*.json ./
COPY --from=build /app/pnpm-lock.yaml ./

# Instalar solo dependencias de producción
RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --prod

# Configurar el contenedor
EXPOSE 3000
CMD ["pnpm", "start"]

# sudo docker build -t chatbot-baileys .
# sudo docker run -d -p 7000:3000 --env-file .env --name chatbot-kiky chatbot-baileys