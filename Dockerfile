FROM node:16.13-bullseye-slim
# AS build-stage

RUN rm -rf /reactfolder1

COPY . /reactfolder1

WORKDIR /reactfolder1

RUN npm install --save
#create a react production build

ARG REACT_APP_BACKEND_URL

ENV REACT_APP_BACKEND_URL $REACT_APP_BACKEND_URL

RUN npm run build

RUN ls -la
RUN pwd

RUN cp -r /reactfolder1/build /reactfolder
RUN rm -rf /reactfolder1

#get the latest alpine image from nginx registry
# FROM nginx:alpine

#we copy the output from first stage that is our react build
#into nginx html directory where it will serve our index file
# COPY --from=build-stage /frontsrc/build/ /whatsapp/frontend
