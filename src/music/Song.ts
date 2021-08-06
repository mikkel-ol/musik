import { Video, VideoCompact, LiveVideo } from '@sushibtw/youtubei';
import { Queue } from './Queue';

/**
 * Represents a song.
 */
export class Song {
    name: string;
    duration: string | number;
    author?: string;
    url: string;
    thumbnail: string;
    queue: Queue;
    isLive: boolean;
    requestedBy: Record<string, any> | string;
    seekTime: number;

    /**
     * @param {YouTubeClient.Video|YouTubeClient.VideoCompact|YouTubeClient.LiveVideo} video The Youtube video
     * @param {Queue} queue The queue in which the song is
     * @param {String} requestedBy The request user
     */
    constructor(video: Video | VideoCompact | LiveVideo, queue: Queue, requestedBy: string) {
        /**
         * Song name.
         * @type {String}
         */
        this.name = video.title;
        /**
         * Song duration.
         * @type {String|Number}
         */
        this.duration = (video as any).duration;
        /**
         * Author channel of the song.
         * @type {String}
         */
        this.author = video.channel?.name;
        /**
         * Youtube video URL.
         * @type {String}
         */
        this.url = (video as any).url;
        /**
         * Youtube video thumbnail.
         * @type {String}
         */
        this.thumbnail = (video as any).thumbnail || video.thumbnails.best;
        /**
         * The queue in which the song is.
         * @type {Queue}
         */
        this.queue = queue;
        /**
         * Whenever the song is a livestream.
         * @type {Boolean}
         */
        this.isLive = (video as any).isLiveContent;
        /**
         * The user who requested that song.
         * @type {String}
         */
        this.requestedBy = requestedBy;
        /**
         * The song seek time.
         * @type {Number}
         */
        this.seekTime = 0;
    }
}
