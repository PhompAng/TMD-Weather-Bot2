FROM node:10-alpine

ENV NODE_ENV=production \
		BABEL_DISABLE_CACHE=1
ARG APP_DIR=/usr/local/zeus

RUN mkdir ${APP_DIR}
WORKDIR ${APP_DIR}
RUN mkdir .thumb
COPY .env ${APP_DIR}

COPY package.json ${APP_DIR}
RUN npm install

COPY index.js ${APP_DIR}
COPY dist ${APP_DIR}/dist

EXPOSE 3000

CMD ["node", "."]