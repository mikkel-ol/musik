import { Message } from 'discord.js';
import { Container } from 'typedi';
import { Command } from '../Command';
import { Player } from '../music/Player';
import { BotClient } from '../types';
import { Logger } from '../utils/Logger';

export default class Queue extends Command {
    constructor(client: BotClient) {
        super(client, {
            name: 'q',
            description: 'Shows queue of songs.',
            category: 'Command',
            usage: client.settings.prefix.concat('q'),
            cooldown: 1000,
            requiredPermissions: ['SEND_MESSAGES']
        });
    }

    public async run(message: Message): Promise<void> {
        // ! Disabled - no need with Embedder
//         const player = Container.get<Player>(Player);

//         try {
//             const queue = await player.getQueue(message.guild?.id!);

//             if (!queue) {
//                 await super.respond(message.channel, 'Nothing is playing.');
//                 return;
//             }

//             const msg = `Queue:

// ${queue.songs.map(song => song.name).join('\n')}
// `;

//             await super.respond(message.channel, msg);
//         } catch (e: any) {
//             Logger.error(e);
//         } finally {
//             message.delete();
//         }
    }
}
