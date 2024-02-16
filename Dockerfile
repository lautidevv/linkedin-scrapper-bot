FROM node:20.11-alpine
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      xvfb \
      nodejs

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV DISPLAY=:99

WORKDIR /app

COPY ./package*.json ./
RUN npm ci

COPY . .

RUN npm run build && node register-commands.js

CMD sh -c "Xvfb -ac :99 -screen 0 1280x1024x16 & npm run start"
