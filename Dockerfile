ARG GITHUB_TOKEN
FROM node:18-alpine AS builder
ARG GITHUB_TOKEN

ENV GITHUB_TOKEN $GITHUB_TOKEN
WORKDIR /app

# Use the github token for accessing private package repository
RUN echo //npm.pkg.github.com/:_authToken=$GITHUB_TOKEN >> ~/.npmrc
RUN echo @[hugoperier]:registry=https://npm.pkg.github.com/ >> ~/.npmrc

COPY package.json .
COPY package-lock.json .

RUN npm install --legacy-peer-deps

# Remove the private token from the npmrc
RUN echo > ~/.npmrc

COPY . .

RUN npm run build

FROM nginx:alpine AS server

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
