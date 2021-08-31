import { User } from 'discord.js';
import { Authorized, CurrentUser, Get, JsonController, NotFoundError, Post } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
//@Authorized()
@JsonController('/users')
export class UsersController {
    constructor() { }

    @Get("/@me")
    async play(@CurrentUser() user?: any): Promise<User> {
        return user;
    }
}
