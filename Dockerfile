FROM node:10.17.0
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN chmod 777 /opt/app
COPY . .
RUN npm install --quiet
RUN npm install nodemon -g --quiet
RUN npm install express --save
RUN npm install --save-dev nodemon
RUN npm install bcrypt-nodejs --save
RUN npm install cookie-parser --save
RUN npm install cors
RUN npm install debug
RUN npm install ejs
RUN npm install http-errors
RUN npm install jsonwebtoken --save
RUN npm install jwt-simple --save
RUN npm install moment
RUN npm install morgan
RUN npm install passport --save
RUN npm install passport-jwt --save
RUN npm install pg
RUN npm install pg-backup
RUN npm install pg-hstore
RUN npm install request
RUN npm install sequelize
EXPOSE 3600
CMD npm run dev