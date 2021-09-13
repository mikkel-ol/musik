/* eslint-disable prettier/prettier */
import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Embedder } from '../utils/Embedder';
import { Logger } from '../utils/Logger';

export default class Stop extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'stop',
            description: 'Stop playback completely.',
            category: 'Command',
            usage: client.settings.prefix.concat('stop'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);
        const embedder = Container.get<Embedder>(Embedder);

        message.delete();

        try {
            if (!player.isPlaying(message.guild?.id)) {
                await super.respond(message.channel, 'Nothing is playing.');
            } else {
                player.stop(message.guild?.id!);
                await embedder.stop(message.guild?.id!);
            }
        } catch (e: any) {
            if (e.context === 'someerrortype') {
                //
            } else {
                Logger.error(e);
            }
        }
    }
}
