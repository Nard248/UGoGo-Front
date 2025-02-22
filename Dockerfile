# Build stage: Use Node.js to build the production React app
FROM node:16 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage: Use Nginx to serve the React app
FROM nginx:alpine

# Copy the production build files into Nginx's default directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]