# Tapomix \ PuppeteerSrv

[Puppeteer](https://pptr.dev/) JS server to generate **pdf** or **screenshot** from html code.

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
castor start # ( or the first time : castor build && castor start )
```

Client projects reach the server **through Traefik**, never by joining its network :

- Traefik joins the `puppeteer` network and serves the service on an internal entrypoint named `puppeteer` (see the
  labels in `compose.yaml`), never published on the host
- Traefik carries the `puppeteer` alias on each site network

```yaml
# traefik.yaml
entryPoints:
    puppeteer:
        address: :63001
```

Then a client project calls the server with the address : `http://puppeteer:63001`, without any extra network.

## Security

The HTML comes from the client projects and is rendered as untrusted content :

- JavaScript is disabled : templates must be static HTML + CSS (charts, QR codes, ... as images or inline SVG)
- only `https:` and inline (`data:`, `blob:`) resources are loaded : internal services (sites behind Traefik,
  Traefik's internal entrypoints, cloud metadata) only speak plain `http`, and an internal `https` endpoint fails
  certificate validation
- every blocked request is logged with the `[BLOCKED]` prefix

> See [https://github.com/tapomix/chrome-wrapper](https://github.com/tapomix/chrome-wrapper), it's the **PHP client** to dialog with this server.
