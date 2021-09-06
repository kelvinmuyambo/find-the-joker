# base image
FROM node:14.17.0

# set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

# start app
CMD ["npm", "start"]

EXPOSE 8000
