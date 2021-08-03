import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Play extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'play',
            description: 'Plays a song.',
            category: 'Command',
            usage: client.settings.prefix.concat('play'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        try {
            const song = await player.play(message);

            await super.respond(message.channel, `Playing ${song.name}`);
        } catch (e) {
            if (e.context === 'VoiceChannelTypeInvalid') {
                await super.respond(message.channel, 'Join a voice channel to play music.');
            } else {
                Logger.error(e);
            }
        } finally {
            message.delete();
        }
    }
}
