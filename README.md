# Description

[Puppeteer](https://pptr.dev/) JS server to generate pdf or image from html code.

The server will be exposed on : `http://puppeteer:3000` (port is configurable)

## Installation

Just clone the repository.

```bash
git clone https://github.com/tapomix/puppeteer-srv puppeteer
```

In dev, you also need to install dependencies with :

```bash
castor npm install
```

## Configuration

Copy the file `.env.dist` to `.env` then edit it to customize the environment variables for your project.

For production (or even in dev), you can generate a random token with :

```bash
castor token
```

### Default values

- APP_TOKEN: tapomix_puppeteer-srv_dev-token
- KEEP_BROWSER_OPEN: false
- SERVER_PORT: 3000

## Usage

Start the container with :

```bash
castor start # ( or the first time : castor build )
```

Add in the container of your *client* project the network `puppeteer-net`.

```yaml
# compose.yaml / compose.override.yaml
services:
  my-service:
    // ...
    networks:
      - puppeteer-net

networks:
  puppeteer-net:
    external: true
```

Then you can call the server with the address : `http://puppeteer:3000`

> See [https://github.com/tapomix/chrome-wrapper](https://github.com/tapomix/chrome-wrapper), it's the PHP *client* to dialog with this server.
