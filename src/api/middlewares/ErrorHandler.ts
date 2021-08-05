import {
    Middleware,
    ExpressErrorMiddlewareInterface,
    UnauthorizedError
} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    public error(error: Error, req: Request, res: Response, next: (err: any) => NextFunction): any {
        if (res.headersSent) {
            return;
        }

        // Exception check
        if (error instanceof UnauthorizedError) {
            res.json(error);
        } else {
            next(error);
        }
    }
}
