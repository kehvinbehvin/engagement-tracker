FROM amd64/node:18-alpine3.15 as ts-compiler

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./src ./src

RUN npm run build

FROM node:18-alpine3.15 as ts-remover

WORKDIR /usr/src/app

COPY --from=ts-compiler /usr/src/app/package*.json ./

COPY --from=ts-compiler /usr/src/app/build ./build

RUN npm install --only=production

EXPOSE 8080

CMD [ "node", "./build/app.js" ]

#FROM gcr.io/distroless/nodejs:14
#
#WORKDIR /usr/src/app
#
#COPY --from=ts-remover /usr/src/app ./
#
#USER 1000
#
#CMD ["app.js"]


