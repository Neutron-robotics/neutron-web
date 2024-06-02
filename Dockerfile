FROM node:18-alpine AS builder

ARG GITHUB_TOKEN

ARG VITE_APP_VERSION
ARG VITE_APP_NAME
ARG VITE_NEUTRON_SERVER_URL

ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_NEUTRON_SERVER_URL=$VITE_NEUTRON_SERVER_URL

ENV GITHUB_TOKEN $GITHUB_TOKEN
WORKDIR /app

# Use the github token for accessing private package repository
RUN echo //npm.pkg.github.com/:_authToken=$GITHUB_TOKEN >> ~/.npmrc
RUN echo @[neutron-robotics]:registry=https://npm.pkg.github.com/ >> ~/.npmrc

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
