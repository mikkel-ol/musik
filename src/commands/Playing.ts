import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Playing extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'playing',
            description: 'Current playing song.',
            category: 'Command',
            usage: client.settings.prefix.concat('playing'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            const song = await player.playing(message.guild?.id!);

            await super.respond(message.channel, `Currently playing ${song.name}`);
        } catch (e) {
            if (e.context === 'QueueIsNull') {
                await super.respond(message.channel, 'Nothing is playing.');
            } else {
                Logger.error(e);
            }
        } finally {
            message.delete();
        }
    }
}
