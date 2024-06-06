FROM node:18-alpine AS builder

ARG GITHUB_TOKEN

ARG VITE_APP_VERSION
ARG VITE_NEUTRON_SERVER_URL

ENV VITE_APP_VERSION=$VITE_APP_VERSION
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

RUN echo 'http { \
    include mime.types; \
    set_real_ip_from 0.0.0.0/0; \
    real_ip_recursive on; \
    real_ip_header X-Forward-For; \
    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s; \
    server { \
        listen 80; \
        server_name localhost; \
        root /proxy; \
        limit_req zone=mylimit burst=70 nodelay; \
        location / { \
            root /usr/share/nginx/html; \
            index index.html index.htm; \
            try_files $uri /index.html; \
        } \
        error_page 500 502 503 504 /50x.html; \
        location = /50x.html { \
            root /usr/share/nginx/html; \
        } \
    } \
} \
events {}' > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
