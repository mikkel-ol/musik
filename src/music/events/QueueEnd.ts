/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Queue, Song } from 'discord-music-player';
import Container from 'typedi';
import { BotEvent } from '../../types';
import { Embedder } from '../../utils/Embedder';
import { Player } from '../Player';

export default class QueueEnd implements BotEvent {
    constructor(private player: Player) {}

    public async run(args: any): Promise<void> {
        const embedder = Container.get<Embedder>(Embedder);

        const [queue]: [Queue] = args;

        await embedder.pop(queue.guild.id);
    }
}
