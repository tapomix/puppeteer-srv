# alpine version must match the one of the node image (node binary is copied in prod)
ARG ALPINE_VERSION=3.24
ARG NODE_VERSION=26

# system packages needed by the server (shared by dev and prod)
ARG SYSTEM_PACKAGES="\
    chromium \
    nss \
    harfbuzz \
    freetype \
    ttf-freefont \
    ttf-dejavu \
    fontconfig \
    bash \
    tini \
    curl"
# curl is used by the healthcheck

### NODE ###
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS node

### DEV ###

FROM node AS dev

ARG SYSTEM_PACKAGES

RUN apk add --no-cache ${SYSTEM_PACKAGES}

# upgrade the npm shipped with the node image
RUN npm install -g npm@12.2.1

WORKDIR /app

RUN chown -R node:node .

USER node

# volume is handled in compose.dev.yaml

CMD ["npm", "run", "dev"]

### DEPS ###

FROM node AS deps

WORKDIR /app

COPY --link src/package*.json ./

RUN npm ci --omit=dev

### PROD ###

# plain alpine + node binary only: no npm in the final image (lighter, smaller attack surface)
FROM alpine:${ALPINE_VERSION} AS prod

ARG SYSTEM_PACKAGES

# shared libraries required by the node binary
RUN apk add --no-cache libatomic libgcc libstdc++ ${SYSTEM_PACKAGES} \
    && addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node

COPY --from=node --link /usr/local/bin/node /usr/local/bin/node

WORKDIR /app

# numeric uid:gid (= node user): names can't be resolved with --link
COPY --from=deps --chown=1000:1000 --link /app/node_modules ./node_modules

COPY --chown=1000:1000 --link src .

USER node

# use tini as PID 1 with this entrypoint to avoid zombie process
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]
