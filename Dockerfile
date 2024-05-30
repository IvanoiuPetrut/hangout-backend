FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npx prisma generate

COPY prisma ./prisma

RUN npm run build

EXPOSE 3000

USER node

CMD ["node", "dist/index.js"]

USER root