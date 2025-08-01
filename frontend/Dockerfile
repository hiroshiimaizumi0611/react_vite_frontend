# --- Build Stage ---
FROM node:slim AS build
ARG VITE_STAGE
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# --- Runtime Stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/nginx.conf
CMD ["/bin/sh", "-c", \
     "envsubst '$$BACKEND_HOST $$BACKEND_PORT' < /etc/nginx/templates/nginx.conf > /etc/nginx/conf.d/default.conf && \
      exec nginx -g 'daemon off;'"]

EXPOSE 80