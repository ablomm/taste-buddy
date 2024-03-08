FROM node:21.6-alpine3.18
RUN mkdir -p /opt/app
WORKDIR /opt/app
EXPOSE 8080
EXPOSE 8081
CMD ./start.sh