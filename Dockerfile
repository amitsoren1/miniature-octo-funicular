#get the latest alpine image from node registry
FROM node:16.13.1-alpine AS build-stage

EXPOSE 80

#Run command npm install to install packages
RUN npm install

#copy all the folder contents from local to container
COPY . /frontsrc

WORKDIR /frontsrc

#create a react production build
RUN npm run build

#get the latest alpine image from nginx registry
# FROM nginx:alpine

#we copy the output from first stage that is our react build
#into nginx html directory where it will serve our index file
COPY --from=build-stage /frontsrc/build/ /whatsapp/frontend
