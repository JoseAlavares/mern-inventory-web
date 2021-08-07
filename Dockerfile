#build environment
FROM node:12.16.3-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.0 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]