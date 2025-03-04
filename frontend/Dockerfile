FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --configuration=production
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
