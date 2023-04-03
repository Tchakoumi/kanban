FROM node:18.12.1-alpine3.16 as builder

# #set the working directory
WORKDIR /app

# # install app dependencies
COPY package.json /app
COPY package-lock.json /app

# #clean install dependecies
RUN npm install

# # add app
COPY . /app

# # build app
RUN npx nx run app:build:production

# # expose port 3000 to outer environment
EXPOSE 3000

# # run app
WORKDIR /app/dist/apps/app
CMD ["npm", "start"]

