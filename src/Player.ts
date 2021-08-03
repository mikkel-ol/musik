import { Message } from 'discord.js';
import { Service } from 'typedi';
import { Player as DiscordPlayer, Queue, Song } from 'discord-music-player';
import { Logger } from './utils/Logger';
import { settings as configuration } from './config/config';
import { Client } from './Client';
import { Status } from './types/status';

@Service()
export class Player {
    private player: DiscordPlayer;
    private status = new Map<string, Status>();

    constructor(private client: Client) {
        this.player = new DiscordPlayer(client, {
            leaveOnEmpty: false,
            volume: configuration.volume
        });
    }

    /**
     * Determines whether bot is playing on guild.
     * @param guildId ID on guild
     * @returns Whether bot is playing on guild or not
     */
    public isPlaying(guildId: string | undefined): boolean {
        return guildId ? this.status.get(guildId)?.isPlaying ?? false : false;
    }

    /**
     * Plays a song on a users current voice channel.
     * @param message Discord Message object
     * @returns Promise with found Song object
     */
    public async play(message: Message): Promise<Song> {
        const args = message.content
            .slice(this.client.settings.prefix.length)
            .trim()
            .split(/ +/g);

        const song = this.player.play(message, args.join(' '));

        if (await song) {
            this.changeStatus(message.guild?.id, { isPlaying: true });
        }

        return song;
    }

    /**
     * Pauses a song if currently playing.
     * @param message Discord Message object
     * @returns Promise with paused song
     */
    public async pause(message: Message): Promise<Song> {
        const song = this.player.pause(message);

        this.changeStatus(message.guild?.id, { isPlaying: false });

        return song;
    }

    /**
     * Resumes playback.
     * @param message Discord Message object
     * @returns Promise with resumed song
     */
    public async resume(message: Message): Promise<Song> {
        const song = this.player.resume(message);

        this.changeStatus(message.guild?.id, { isPlaying: true });

        return song;
    }

    /**
     * Stops playback completely and empties queue.
     * @param message Discord Message object
     * @returns Promise with stopped song
     */
    public async stop(message: Message): Promise<Song> {
        const song = this.player.stop(message);

        this.changeStatus(message.guild?.id, undefined);

        return song;
    }

    /**
     * Gets current playing song.
     * @param message Discord Message object
     * @returns Promise with current song playing
     */
    public async playing(message: Message): Promise<Song> {
        const song = this.player.nowPlaying(message);

        return song;
    }

    /**
     * Clear queue of all songs. Does not stop current playing song.
     * @param message Discord Message object
     * @returns Promise with cleared queue
     */
    public async clear(message: Message): Promise<Queue> {
        const queue = this.player.clearQueue(message);

        return queue;
    }

    /**
     * Get the current queue of songs.
     * @param message Discord Message object
     * @returns Promise with current queue
     */
    public async getQueue(message: Message): Promise<Queue> {
        const queue = this.player.getQueue(message);

        return queue;
    }

    /**
     * Skip the current playing song.
     * @param message Discord Message object
     * @returns Promise with skipped song
     */
    public async skip(message: Message): Promise<Song> {
        const song = this.player.skip(message);

        return song;
    }

    /**
     * Get or set the volume.
     * @param message Discord Message object
     * @returns Current or new volume
     */
    public async volume(message: Message): Promise<number> {
        let volume: number;

        const args = message.content
            .slice(this.client.settings.prefix.length)
            .trim()
            .split(/ +/g);

        const newVolume = +args[1];

        if (!newVolume) {
            volume = this.player.getVolume(message).valueOf();
        } else {
            // TODO: Check if volume is between 0 and 100

            const song = this.player.setVolume(message, newVolume);

            volume = newVolume;
        }

        return volume;
    }

    /**
     * Shuffle the queue randomly
     * @param message Discord Message object
     * @returns New, shuffled queue
     */
    public async shuffle(message: Message): Promise<Song[]> {
        const newQueue = this.player.shuffle(message);

        return newQueue;
    }

    /**
     * Fades volume.
     * @param message Discord Message object
     * @returns Promise with new volume or undefined if already fading
     */
    public async fade(message: Message): Promise<number | undefined> {
        const args = message.content
            .slice(this.client.settings.prefix.length)
            .trim()
            .split(/ +/g);

        const newVolume = +args[1];

        // TODO: Maybe throw here instead
        if (!newVolume) return undefined;

        const status = this.getStatus(message.guild?.id);

        if (status.isFading === true) return undefined;

        status.isFading = true;

        const currentVol = this.player.getVolume(message).valueOf();
        const diff = newVolume - currentVol;

        const noOfSteps = 20;
        let i = 0;
        const timer = setInterval(() => {
            i += 1;

            if (i === noOfSteps) {
                status.isFading = false;
                clearInterval(timer);
            }

            const tempVolume = currentVol + (diff / noOfSteps) * i;

            this.player.setVolume(message, tempVolume);
        }, this.client.settings.fadeTime / noOfSteps);

        return newVolume;
    }

    private getStatus(guildId: string | undefined): Status {
        if (!guildId) {
            // TODO: Custom error type
            throw new Error('Cannot change status when guild is null.');
        }

        const status = this.status.get(guildId);

        if (!status) {
            throw new Error('No status found');
        }

        return status;
    }

    private changeStatus(guildId: string | undefined, newStatus: Status | undefined): void {
        if (!guildId) {
            // TODO: Custom error type
            throw new Error('Cannot change status when guild is null.');
        }

        if (!newStatus) this.status.delete(guildId);
        else this.status.set(guildId, newStatus);
    }
}
