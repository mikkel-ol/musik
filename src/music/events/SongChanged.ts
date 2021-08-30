/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Queue, Song } from 'discord-music-player';
import { Message as DiscordMessage } from 'discord.js';
import { BotEvent } from '../../types';
import { Player } from '../Player';

export default class SongChanged implements BotEvent {
    constructor(private player: Player) {}

    public async run(args: any): Promise<void> {
        const [queue, newSong, oldSong]: [Queue, Song, Song] = args;

        console.log(`${newSong} is now playing.`);
    }
}
