import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Volume extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'volume',
            description: 'Set or show the volume',
            category: 'Command',
            usage: client.settings.prefix.concat('volume'),
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
                const volume = await player.volume(message);

                await super.respond(message.channel, `Volume is ${volume}%`);
            }
        } catch (e) {
            if (e.context === 'someerrortype') {
                //
            } else {
                Logger.error(e);
            }
        } finally {
            message.delete();
        }
    }
}
