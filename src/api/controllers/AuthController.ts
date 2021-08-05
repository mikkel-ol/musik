import * as passport from 'passport';
import { Controller, Get, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Controller('/auth')
export class AuthController {
    @Get()
    @UseBefore((req: any, res: any, next: any) => {
        const { returnTo } = req.query;
        const state = returnTo
            ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
            : undefined;

        passport.authenticate('discord', { state: state })(req, res, next);
    })
    login(): void {
        // won't be reached
    }

    @Get('/callback')
    @UseBefore(passport.authenticate('discord'), (req: any, res: any) => {
        try {
            const { state } = req.query;
            const { returnTo } = JSON.parse(Buffer.from(state as string, 'base64').toString());
            if (typeof returnTo === 'string') {
                return res.redirect(returnTo);
            }
        } catch {
            // just redirect normally below
        }
        return res.redirect('/');
    })
    callback(): void {
        // won't be reached
    }
}
