FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server/ ./server/
COPY --from=frontend-build /app/dist ./public/
RUN mkdir -p data
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server/index.js"]
