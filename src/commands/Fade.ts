import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Fade extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'fade',
            description: 'Fade the volume',
            category: 'Command',
            usage: client.settings.prefix.concat('fade'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        message.delete();

        try {
            if (!player.isPlaying(message.guild?.id)) {
                await super.respond(message.channel, 'Nothing is playing.');
            } else {
                const args = message.content
                    .slice(this.client.settings.prefix.length)
                    .trim()
                    .split(/ +/g);

                const volume = +args[1];

                const result = player.fade(message.guild?.id!, volume);

                // result will be true or false depending if already fading
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
