FROM node:22.4.1-alpine3.20

# Establece el directorio de trabajo inicial.
WORKDIR /usr/src/app

# Instala dependencias globales necesarias.
RUN apk add --no-cache bash

# Copia solo los archivos necesarios para instalar dependencias.
COPY package.json yarn.lock ./

# Instala dependencias de la aplicación.
RUN yarn install --frozen-lockfile

COPY . .

RUN cp .env.development .env || true

# Construye la aplicación.
RUN yarn build


EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]
