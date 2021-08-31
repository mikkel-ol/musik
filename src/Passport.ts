/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Service } from 'typedi';
import { Strategy as DiscordStrategy } from 'passport-discord';
import * as oauth2 from 'passport-oauth2';
import passport = require('passport');
import { Express } from './Express';

@Service()
export default class Passport {
    constructor(private express: Express) {
        this.initialize();
        this.useDiscord();
    }

    private initialize(): void {
        const { app } = this.express;

        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user: any, done) {
            done(null, user);
        });
    }

    private useDiscord(): void {
        const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

        const strategy: DiscordStrategy.StrategyOptions = {
            clientID: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!,
            callbackURL: '/api/auth/callback',
            scope: scopes
        };

        passport.use(new DiscordStrategy(strategy, this.cb));
    }

    private cb(
        accessToken: string,
        refreshToken: string,
        profile: DiscordStrategy.Profile,
        done: oauth2.VerifyCallback
    ): void {
        // TODO: Implement storing user
        return done(null, profile);
    }
}
