import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Resume extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'resume',
            description: 'Resume playback.',
            category: 'Command',
            usage: client.settings.prefix.concat('resume'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            if (player.isPlaying(message.guild?.id)) {
                await super.respond(message.channel, 'Already playing.');
            } else {
                await player.resume(message.guild?.id!);

                await super.respond(message.channel, `Resumed`);
            }
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
