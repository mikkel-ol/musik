import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Bar extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'bar',
            description: 'bar queue.',
            category: 'Command',
            usage: client.settings.prefix.concat('bar'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        const player = Container.get<Player>(Player);

        const progressBar = await player.createProgressBar(message);

        message.channel.send(progressBar);
    }
}
