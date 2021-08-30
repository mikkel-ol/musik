import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Embedder } from '../utils/Embedder';
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
        const embedder = Container.get<Embedder>(Embedder);

        message.delete();

        try {
            const newQueue = await player.shuffle(message.guild?.id!);
            await embedder.update(message.guild?.id!);
        } catch (e: any) {
            if (e.context === 'QueueIsNull') {
                await super.respond(message.channel, 'Nothing in queue.');
            } else {
                Logger.error(e);
            }
        }
    }
}
