# build stage
FROM node:10.17.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
RUN yarn global add nuxt@^2.0.0
COPY . .
ENV NODE_ENV production
RUN nuxt build

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 3030
CMD ["nuxt", "start"]
