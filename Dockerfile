FROM node:22.0.0-alpine 
# Set working directory
WORKDIR /usr/src/app

ENV NUXT_API_URL=https://back.deocasion.mrmisti.com/v1

COPY . .
RUN yarn install 
RUN yarn build
EXPOSE 3000

# ENV NUXT_SESSION_PASSWORD=ad4e5df3fb844fa897f63cd085400e2b
#ENV NUXT_API_URL=http://localhost:4000/api/v1
CMD [ "node", ".output/server/index.mjs" ]