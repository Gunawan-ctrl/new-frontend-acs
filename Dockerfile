FROM nginx:alpine3.18-slim

LABEL com.centurylinklabs.watchtower.enable=true
LABEL maintainer="Rizul Hanif"
LABEL developer="Ananta Noviandanu"

COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /app
