import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Pause extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'pause',
            description: 'Pause playback.',
            category: 'Command',
            usage: client.settings.prefix.concat('pause'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            if (!player.isPlaying(message.guild?.id)) {
                await super.respond(message.channel, 'Nothing is playing.');
            } else {
                const song = await player.pause(message);

                await super.respond(message.channel, `Paused ${song.name}`);
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
