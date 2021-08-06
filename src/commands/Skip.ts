import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Skip extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'skip',
            description: 'Skip to next song in queue.',
            category: 'Command',
            usage: client.settings.prefix.concat('skip'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            const song = await player.skip(message);

            await super.respond(message.channel, `Skipped ${song.name}`);
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
