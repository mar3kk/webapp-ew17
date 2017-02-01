# webapp-ew17 dockerfile

# LTS node version/npm - image
FROM node:boron

# Create app directory (working dir)
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm i --production

# Bundle app source
COPY . /usr/src/app

# Exposed port
EXPOSE 3001

# Run the APP
CMD [ "npm", "start" ]

ARG VCS_REF
ARG VCS_URL
ARG BUILD_DATE
LABEL \
	org.label-schema.build-date=$BUILD_DATE \
	org.label-schema.vcs-ref=$VCS_REF \
	org.label-schema.vcs-url=$VCS_URL