FROM node:latest AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:alpine
WORKDIR /njstm-volume/app
COPY --from=builder /app ./
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod"]
