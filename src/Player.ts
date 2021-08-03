import { Message } from 'discord.js';
import { Service } from 'typedi';
import { Player as DiscordPlayer, Song } from 'discord-music-player';
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
            leaveOnEmpty: false // This options are optional.
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

    private changeStatus(guildId: string | undefined, newStatus: Status | undefined): void {
        if (!guildId) {
            throw new Error('Cannot change status when guild is null.');
        }

        if (!newStatus) this.status.delete(guildId);
        else this.status.set(guildId, newStatus);
    }
}
