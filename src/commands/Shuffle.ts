import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Shuffle extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'shuffle',
            description: 'Shuffle the queue',
            category: 'Command',
            usage: client.settings.prefix.concat('shuffle'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            const newQueue = await player.shuffle(message);

            await super.respond(message.channel, `Queue has been shuffled`);
        } catch (e) {
            if (e.context === 'QueueIsNull') {
                await super.respond(message.channel, 'Nothing in queue.');
            } else {
                Logger.error(e);
            }
        } finally {
            message.delete();
        }
    }
}
