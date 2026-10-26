# CHANGELOG

## 0.3.0 @ 2026-10-23

- bump puppeteer-core to 25.16.0
- bump express to 5.3.0 + express-rate-limit to 8.7.1 + nodemon to 3.1.14
- fix npm audit vulnerabilities
- rename docker network puppeteer-net to puppeteer
- expose the service to traefik on an internal puppeteer entrypoint
- trust one proxy hop to rate-limit callers behind traefik
- raise default api rate limit to 10 req/min
- bind the dev port to the host loopback only
- disable javascript and block non-https requests in rendered html
- fix castor 1.8 deprecation (define CASTOR_USE_CHDIR)

## 0.2.0 @ 2025-10-28

- bump puppeteer version to 24.26.1
- upgrade castor scripts
- upgrade docker compose files
- add /health route + healthcheck in docker compose
- validate values from .env
- move configuration in specific file
- move middlewares in separate files
- add rate limit middleware

## 0.1.1 @ 2025-09-16

- upgrade browser closing process

## 0.1.0 @ 2025-08-29

- initial version
