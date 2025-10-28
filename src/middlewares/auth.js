// Bearer authentication middleware

import { APP_TOKEN } from "../config.js";

export const authenticateToken = (request, response, next) => {
    const token = request.headers['authorization'];

    if (!token) {
        console.log('[AUTH] Missing token.');

        return response.status(401).send({ error: 'Access denied, missing token !' });
    }

    if (token !== `Bearer ${APP_TOKEN}`) {
        console.log('[AUTH] Invalid token.');

        return response.status(403).send({ error: 'Access denied, invalid token !' });
    }

    next(); // execute next middleware if token is ok
};
