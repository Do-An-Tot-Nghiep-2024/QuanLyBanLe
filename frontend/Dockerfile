# create docker file multistage build 
# https://docs.docker.com/develop/develop-images/multistage-build/

# build stage
FROM node:22.3.0-alpine AS build-stage
ARG VITE_URL_BE=http://windytech.crabdance.com/api/v1
ARG VITE_SOCKET=http://backend:8080/ws
ENV VITE_URL_BE=$VITE_URL_BE
ENV VITE_SOCKET=$VITE_SOCKET
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
# Copy SSL certificates

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# how to build image
# docker build -t my-image .
# how to run image
# docker run -p 80:80 my-image