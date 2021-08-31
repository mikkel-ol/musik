/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Action, useContainer, useExpressServer } from 'routing-controllers';
import Container, { Service } from 'typedi';
import * as expressWinston from 'express-winston';
import * as express from 'express';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { Logger } from './utils/Logger';
import { MusicController } from './api/controllers/MusicController';
import { ErrorHandler } from './api/middlewares/ErrorHandler';
import { AuthController } from './api/controllers/AuthController';
import { UsersController } from './api/controllers/UsersController';

@Service()
export class Express {
    private _app!: express.Application;

    public get app(): express.Application {
        return this._app;
    }

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        useContainer(Container);

        this._app = express();

        this._app.use(cors({
            origin: [process.env.CORS__SPA!],
            credentials: true
        }));

        const sessionConf: session.SessionOptions = {
            secret: process.env.SESSION_SECRET!,
            saveUninitialized: true,
            resave: true
        };

        this._app.use(cookieParser());
        this._app.use(session(sessionConf));

        this._app.use(expressWinston.logger(Logger));
    }

    public run(): void {
        useExpressServer(this._app, {
            routePrefix: '/api',
            defaultErrorHandler: false,
            middlewares: [ErrorHandler],
            controllers: [AuthController, MusicController, UsersController],
            authorizationChecker: this.authChecker,
            currentUserChecker: (action: Action) => action.request.user
        });

        const port = process.env.PORT;

        if (!port) Logger.error('No port set, cannot start Express');
        else this._app.listen(port, () => Logger.info(`Express started on port ${port}`));
    }

    private async authChecker(action: Action, roles: string[]): Promise<boolean> {
        if (action.request.isAuthenticated()) return true;

        action.response.sendStatus(401);
        return false;
    }
}
