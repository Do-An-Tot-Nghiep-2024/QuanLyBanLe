# create docker file multistage build 
# https://docs.docker.com/develop/develop-images/multistage-build/

# build stage
FROM node:22.3.0-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# how to build image
# docker build -t my-image .
# how to run image
# docker run -p 80:80 my-image