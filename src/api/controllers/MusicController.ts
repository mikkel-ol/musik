import { GuildChannel } from 'discord.js';
import { Authorized, Body, Controller, CurrentUser, Get, NotFoundError, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Client } from '../../Client';
import { Player } from '../../music/Player';
import { PlayRequest } from '../../types/api/PlayRequest';

@Service()
//@Authorized()
@Controller('/music')
export class MusicController {
    constructor(private player: Player, private client: Client) { }

    @Get()
    getAll(@CurrentUser() user?: any): string {
        return user;
    }

    @Post()
    async play(@Body() song: PlayRequest, @CurrentUser() user?: any): Promise<any> {
        const guild = await this.client.guilds.fetch(song.guildId);

        if (!guild.channels.resolve(song.channelId)) throw new NotFoundError(`Type ${typeof (GuildChannel)} with ID ${song.channelId} not found in guild ${song.guildId}`);

        const result = await this.player.play(song.song, song.guildId, song.channelId);

        const discordUser = await this.client.users.fetch(user.id);

        return discordUser;

        // discordUser.

        // this.player.play(song.name);
    }
}
