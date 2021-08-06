import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import { PlayerOptions } from '../types/player/PlayerOptions';
import { Song } from './Song';

/**
 * Represents a guild queue.
 * @param {string} guildID
 * @param {PlayerOptions} options
 * @param {Discord.Message} message
 */
export class Queue {
    guildID: any;
    dispatcher?: StreamDispatcher;
    connection?: VoiceConnection;
    songs: Song[];
    stopped: boolean;
    skipped: boolean;
    volume: number;
    playing: boolean;
    repeatMode: boolean;
    repeatQueue: boolean;
    // initMessage: Message;
    options: PlayerOptions;
    /**
     * Represents a guild queue.
     * @param {string} guildID
     * @param {Util.PlayerOptions} options
     * @param {Discord.Message} message
     */
    constructor(guildID: string, options: any) {
        /**
         * The guild ID.
         * @type {Snowflake}
         */
        this.guildID = guildID;
        /**
         * The stream dispatcher.
         * @type {StreamDispatcher}
         */
        this.dispatcher = undefined;
        /**
         * The voice connection.
         * @type {VoiceConnection}
         */
        this.connection = undefined;
        /**
         * Songs. The first one is currently playing and the rest is going to be played.
         * @type {Song[]}
         */
        this.songs = [];
        /**
         * Whether the stream is currently stopped.
         * @type {Boolean}
         */
        this.stopped = false;
        /**
         * Whether the last song was skipped.
         * @type {Boolean}
         */
        this.skipped = false;
        /**
         * The stream volume.
         * @type {Number}
         */
        this.volume = options.volume ?? 100;
        /**
         * Whether the stream is currently playing.
         * @type {Boolean}
         */
        this.playing = true;
        /**
         * Whether the repeat mode is enabled.
         * @type {Boolean}
         */
        this.repeatMode = false;
        /**
         * Whether the full queue repeat mode is enabled.
         * @type {Boolean}
         */
        this.repeatQueue = false;
        /**
         * First message object.
         * @type {Discord.Message}
         */
        // this.initMessage = message;
        /**
         * Queue Options copied from Default Options.
         * @type {PlayerOptions}
         */
        this.options = options;
    }
}
