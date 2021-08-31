import { TextChannel } from 'discord.js';
import { Authorized, Body, CurrentUser, Get, JsonController, NotFoundError, OnUndefined, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { Client } from '../../Client';
import { Player } from '../../music/Player';
import { PlayRequest } from '../../types/api/PlayRequest';
import { GuildNotFoundError } from '../../types/errors/GuildNotFoundError';
import { Embedder } from '../../utils/Embedder';

@Service()
@Authorized()
@JsonController('/music')
export class MusicController {
    constructor(private player: Player, private client: Client, private embedder: Embedder) { }

    @Post()
    @OnUndefined(201)
    async play(@Body() req: PlayRequest, @CurrentUser() user?: any): Promise<void> {
        const guild = await this.client.guilds.fetch(req.guildId);

        if (!(await guild.channels.fetch(req.voiceChannelId)))
            throw new GuildNotFoundError(`Type ${typeof (TextChannel)} with ID ${req.voiceChannelId} not found in guild ${req.guildId}`);

        this.player.play(req.song, req.guildId, req.voiceChannelId).then(song => this.embedder.add(req.guildId, song, req.messageChannelId));
    }
}
