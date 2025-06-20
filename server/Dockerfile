# Dockerfile for Node.js/Express server
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]
