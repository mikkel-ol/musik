import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Clear extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'clear',
            description: 'Clear queue.',
            category: 'Command',
            usage: client.settings.prefix.concat('clear'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            const queue = await player.clear(message);

            await super.respond(message.channel, `Cleared queue.`);
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
