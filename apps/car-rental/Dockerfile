FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:car-rental

FROM node:20-alpine as production
ENV NODE_ENV=production

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/car-rental ./
RUN npm install --only=production

CMD ["node", "main.js"]