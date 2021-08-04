import 'reflect-metadata';
import { createKoaServer } from 'routing-controllers';
import * as KoaLogger from 'koa-logger-winston';
import * as dotenv from 'dotenv';
import { Container } from 'typedi';
import { Client } from './Client';
import { Player } from './Player';
import { Logger } from './utils/Logger';
import { AuthController } from './api/controllers/AuthController';

dotenv.config();

// Initialize the Client using the IoC.
Container.get<Client>(Client);

// Initialize music player same way
Container.get<Player>(Player);

// creates koa app, registers all controller routes and returns you koa app instance
const app = createKoaServer({
    routePrefix: '/api',
    controllers: [AuthController] // we specify controllers we want to use
});

app.use(KoaLogger(Logger));

// run koa application
const port = process.env.PORT;
if (!port) Logger.error('No port set, cannot start Koa');
else {
    app.listen(port, (err: any) => {
        if (err) {
            Logger.error(err);
        } else {
            Logger.info(`Koa started on port ${port}`);
        }
    });
}
