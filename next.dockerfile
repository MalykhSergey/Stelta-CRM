FROM node:20-alpine

WORKDIR /app

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY ./.env.test ./.env.production

EXPOSE 3000

CMD ["node", "server.js"]