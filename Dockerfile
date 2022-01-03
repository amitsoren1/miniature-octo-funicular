FROM node:16-bullseye
# AS build-stage

EXPOSE 80
RUN rm -rf /reactdataa

#VOLUME /reactdataa
COPY ./files /reactdataa
WORKDIR /reactdataa
RUN npm install --save
#create a react production build

RUN ls -la
RUN pwd
RUN npm run build

#get the latest alpine image from nginx registry
# FROM nginx:alpine

#we copy the output from first stage that is our react build
#into nginx html directory where it will serve our index file
# COPY --from=build-stage /frontsrc/build/ /whatsapp/frontend
