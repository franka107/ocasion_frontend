#Install dependencies only when needed
FROM node:20.12.2 AS deps
#RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the app with cache dependencies
FROM node:20.12.2 AS builder

ARG ENV_STAGE=$ENV_STAGE
RUN echo "Ejecutando - $ENV_STAGE"
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.$ENV_STAGE .env
RUN yarn build

# Production image, copy all the files and run next
FROM node:20.12.2 AS runner
# Set working directory
WORKDIR /usr/src/app

COPY package.json yarn.lock .env.development .env.production ./

RUN yarn install --prod
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]


#FROM node:22.4.1-alpine3.20
#
## Establece el directorio de trabajo inicial.
#WORKDIR /usr/src/app
#
## Instala dependencias globales necesarias.
#RUN apk add --no-cache bash
#
## Copia solo los archivos necesarios para instalar dependencias.
#COPY package.json yarn.lock ./
#
## Instala dependencias de la aplicación.
#RUN yarn install --frozen-lockfile
#
## Copia el resto del código (exceptuando `node_modules`, según `.dockerignore`).
#COPY . .
#
## Copia el archivo de entorno si es necesario.
##RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
#RUN cp .env.development .env || true
#
## Construye la aplicación.
#RUN yarn build
#
#
#EXPOSE 3000
#CMD [ "node", ".output/server/index.mjs" ]
