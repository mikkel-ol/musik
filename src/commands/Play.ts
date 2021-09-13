/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Embedder } from '../utils/Embedder';
import { Logger } from '../utils/Logger';

export default class Play extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'play',
            description: 'Plays a song.',
            category: 'Command',
            usage: client.settings.prefix.concat('play'),
            cooldown: 200,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);
        const embedder = Container.get<Embedder>(Embedder);

        message.delete();

        const args = message.content
            .slice(this.client.settings.prefix.length)
            .trim()
            .split(/ +/g);

        args.shift();

        const search = args.join(' ');

        try {
            const song = await player.play(
                search,
                message.guild?.id!,
                message.member?.voice.channelId!
            );

            await embedder.add(message.guild?.id!, song, message.channel?.id!);
        } catch (e: any) {
            if (e.context === 'VoiceChannelTypeInvalid') {
                await super.respond(message.channel, 'Join a voice channel to play music.');
            } else {
                Logger.error(e);
            }
        }
    }
}
