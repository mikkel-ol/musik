import { Authorized, Body, Controller, CurrentUser, Get, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Client } from '../../Client';
import { Player } from '../../music/Player';
import { PlayRequest } from '../../types/api/PlayRequest';

@Service()
@Authorized()
@Controller('/music')
export class MusicController {
    constructor(private player: Player, private client: Client) {}

    @Get()
    getAll(@CurrentUser() user?: any): string {
        return user;
    }

    @Post()
    async play(@Body() song: PlayRequest, @CurrentUser() user?: any): Promise<any> {
        const discordUser = await this.client.users.fetch(user.id);

        return discordUser;

        // discordUser.

        // this.player.play(song.name);
    }
}
