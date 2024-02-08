FROM node:20.10.0

WORKDIR /app

COPY ./package*.json .

RUN npm i -g nodemon

RUN npm install -f

COPY ./ .

EXPOSE 1337

CMD [ "npm", "run", "develop" ]
