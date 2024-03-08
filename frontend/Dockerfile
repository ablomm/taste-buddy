FROM node:21.6-alpine3.18
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY ./ .
EXPOSE 8081
CMD [ "npm", "start"]