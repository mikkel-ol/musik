import { Queue } from './Queue';
import { Song } from './Song';

/**
 * Represents a playlist.
 */
export class Playlist {
    name: string;
    author: string;
    url: string;
    videos: Song[];
    videoCount: number;

    /**
     * @param {Object} playlist The Youtube playlist
     * @param {Queue} queue The queue in which the playlist
     * @param {String} requestedBy The request user
     */
    constructor(playlist: any, queue: Queue, requestedBy: string) {
        /**
         * Playlist name.
         * @type {String}
         */
        this.name = playlist.title;
        /**
         * Author channel of the playlist.
         * @type {String}
         */
        this.author = playlist.channel.name;
        /**
         * Youtube playlist URL.
         * @type {String}
         */
        this.url = playlist.url;
        /**
         * Array of Playlist songs.
         * @type {Song[]}
         */
        this.videos = playlist.videos;
        /**
         * Playlist video count.
         * @type {Number}
         */
        this.videoCount = playlist.videoCount;
    }
}
