FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build -- --base=/pharmahome/

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY deployment/vps/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/pharmahome/
USER 101:101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
