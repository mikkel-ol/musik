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

        message.delete();

        try {
            player.clear(message.guild?.id!);

            await super.respond(message.channel, `Cleared queue.`);
        } catch (e: any) {
            if (e.context === 'QueueIsNull') {
                await super.respond(message.channel, 'Nothing is playing.');
            } else {
                Logger.error(e);
            }
        }
    }
}
