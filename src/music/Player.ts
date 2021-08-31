/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Container, { Service } from 'typedi';
import { Player as DiscordPlayer, Queue, Song } from 'discord-music-player';
import { settings as configuration } from '../config/config';
import { Client } from '../Client';
import { Status } from '../types/status';
import { NotFoundError } from 'routing-controllers';
import { MusicPlayerError } from '../types/errors/MusicPlayerError';
import { PlayerManager } from '../managers/PlayerManager';
import { Embedder } from '../utils/Embedder';

@Service()
export class Player {
    private player: DiscordPlayer;
    private status = new Map<string, Status>();

    constructor(private client: Client, private actionManager: PlayerManager) {
        this.player = new DiscordPlayer(client, {
            leaveOnEmpty: false,
            volume: configuration.volume
        });

        this.actionManager.initializeEvents(client, this.player);
    }

    /**
     * Determines whether bot is playing on guild.
     * @param guildId ID on guild
     * @returns Whether bot is playing on guild or not
     */
    public isPlaying(guildId: string | undefined): boolean {
        return guildId ? this.status.get(guildId)?.isPlaying ?? false : false;
    }

    public async play(searchString: string, guildId: string, channelId: string): Promise<Song> {
        let queue;

        try {
            queue = this.getQueue(guildId);
        } catch (e) {
            queue = this.player.createQueue(guildId);
        }

        await queue.join(channelId);

        const song = await queue.play(searchString);

        if (song) {
            this.changeStatus(guildId, { isPlaying: true });
        }

        return song;
    }

    public pause(guildId: string): void {
        const queue = this.getQueue(guildId);

        const result = queue.setPaused(true);

        if (!result) throw new MusicPlayerError();

        this.changeStatus(guildId, { isPlaying: false });
    }

    public resume(guildId: string): void {
        const queue = this.getQueue(guildId);

        queue.setPaused(false);

        this.changeStatus(guildId, { isPlaying: true });
    }

    public stop(guildId: string): void {
        const queue = this.getQueue(guildId);

        queue.stop();

        this.changeStatus(guildId, undefined);
    }

    public playing(guildId: string): Song {
        const queue = this.getQueue(guildId);

        const song = queue.nowPlaying;

        return song;
    }

    public clear(guildId: string): void {
        const queue = this.getQueue(guildId);

        queue.clearQueue();
    }

    public skip(guildId: string): Song {
        const queue = this.getQueue(guildId);

        const song = queue.skip();

        if (!song) throw new NotFoundError(`Could not skip song on guild with ID ${guildId}`);

        return song;
    }

    public shuffle(guildId: string): Song[] {
        const queue = this.getQueue(guildId);

        const result = queue.shuffle();

        if (!result) throw new MusicPlayerError(`Could not shuffle queue on guild with ID ${guildId}`);

        return result;
    }

    public volume(guildId: string, volume?: number): number {
        const queue = this.getQueue(guildId);

        if (!volume) return queue.volume;
        else {
            // TODO: Check if volume is between 0 and 100

            const result = queue.setVolume(volume);

            if (!result) throw new MusicPlayerError(`Could not set volume on guild with ID ${guildId}`);
        }

        return volume;
    }

    public fade(guildId: string, volume: number): number | undefined {
        const embedder = Container.get<Embedder>(Embedder);

        const queue = this.getQueue(guildId);
        const status = this.getStatus(guildId);

        if (status.isFading === true || !volume) return undefined;

        status.isFading = true;

        const currentVol = queue.volume;
        const diff = volume - currentVol;

        const noOfSteps = 20;
        let i = 0;
        const timer = setInterval(async () => {
            i += 1;

            if (i === noOfSteps) {
                status.isFading = false;
                clearInterval(timer);
            }

            const tempVolume = currentVol + (diff / noOfSteps) * i;

            queue.setVolume(tempVolume);
            if (i % 6 === 0 || !status.isFading) embedder.update(guildId);
        }, this.client.settings.fadeTime / noOfSteps);

        return volume;
    }

    public getQueue(guildId: string): Queue {
        const queue = this.player.getQueue(guildId);

        if (!queue) throw new NotFoundError(`Could not find any queue on guild ${guildId}`);

        return queue;
    }

    /*
    *
    *
    * Private
    *
    * 
    */

    private setVolume(guildId: string, vol: number) {
        this.player.getQueue(guildId)?.setVolume(vol);
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
