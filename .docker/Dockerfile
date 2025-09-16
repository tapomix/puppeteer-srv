### BASE ###
FROM node:24-alpine AS base

RUN apk add --no-cache \
    chromium \
    nss \
    harfbuzz \
    freetype \
    ttf-freefont \
    ttf-dejavu \
    fontconfig \
    bash \
    tini

WORKDIR /app

RUN chown -R node:node .

USER node

### DEV ###

FROM base AS dev

# volume is handled in compose.dev.yaml

CMD ["npm", "run", "dev"]

### PROD ###

FROM base AS prod

COPY --chown=node:node --link src/package*.json ./

RUN npm install --production

COPY --chown=node:node --link src .

# use tini as PID 1 with this entrypoint to avoid zombie process
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["npm", "run", "start"]
