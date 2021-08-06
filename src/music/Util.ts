/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as YTSR from 'ytsr';
import * as Discord from 'discord.js';
import * as YouTubeClient from '@sushibtw/youtubei';
import { getPreview, getData } from 'spotify-url-info';
import { VoiceState } from 'discord.js';
import { Song } from './Song';
import { Queue } from './Queue';
import { Playlist } from './Playlist';
import { PlayOptions } from '../types/player/PlayOptions';
import { PlayerOptions } from '../types/player/PlayerOptions';
import { ProgressOptions } from '../types/player/ProgressOptions';

// External Packages
const YouTube = new YouTubeClient.Client();

// RegExp Definitions
const RegExpList = {
    YouTubeVideo: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w-]+)(\S+)?$/,
    YouTubeVideoID: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    YouTubePlaylist: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
    YouTubePlaylistID: /[&?]list=([^&]+)/,
    Spotify: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
    SpotifyPlaylist: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|playlist)\/|\?uri=spotify:playlist:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/
};

// Helper Functions
/**
 * Get ID from YouTube link.
 * @param {String} url
 * @returns {String}
 */
function ParseYouTubeVideo(url: string): string | boolean {
    const match = url.match(RegExpList.YouTubeVideoID);
    return match && match[7].length === 11 ? match[7] : false;
}
/**
 * Get ID from Playlist link.
 * @param {String} url
 * @returns {String}
 */
function ParseYouTubePlaylist(url: string): string | boolean {
    const match = url.match(RegExpList.YouTubePlaylistID);
    return match && match[1].length === 34 ? match[1] : false;
}
/**
 * Stringify Video duration.
 * @param {String|Number} time
 * @returns {String}
 */
function VideoDurationResolver(time: string | number): string {
    const date = new Date();
    date.setSeconds(Number(time));
    const duration = date.toISOString().substr(11, 8);
    return duration.replace(/^0(?:0:0?)?/, '');
}

/**
 * Utils Class
 * @ignore
 */
export class Util {
    static PlayerOptions = {
        leaveOnEnd: true,
        leaveOnStop: true,
        leaveOnEmpty: true,
        deafenOnJoin: false,
        timeout: 0,
        volume: 100,
        quality: 'high'
    };
    static PlayOptions = {
        search: '',
        uploadDate: null,
        duration: null,
        sortBy: 'relevance',
        requestedBy: null,
        index: null,
        localAddress: null
    };
    static PlaylistOptions = {
        search: '',
        maxSongs: -1,
        requestedBy: null,
        shuffle: false,
        localAddress: null
    };
    static ProgressOptions = {
        size: 20,
        arrow: '>',
        block: '='
    };

    /**
     * @param {String} search
     * @param {Partial<PlayOptions>} sOptions
     * @param {Queue} queue
     * @param {String} requester
     * @param {Number} æimit
     * @return {Promise<Song[]>}
     */
    static async search(
        search: string,
        sOptions: Partial<PlayOptions>,
        queue: Queue,
        requester: string,
        limit = 1
    ): Promise<Song[]> {
        // eslint-disable-next-line no-param-reassign
        sOptions = Object.assign({}, this.PlayOptions, sOptions);
        let filters;

        // Default Options - Type: Video
        const filtersTypes = await YTSR.getFilters(search);
        filters = filtersTypes.get('Type')?.get('Video');

        // Custom Options - Upload date: null
        if (sOptions?.uploadDate !== null)
            filters =
                Array.from(
                    (await YTSR.getFilters(filters?.url!)).get('Upload date')!,
                    ([name, value]) => ({ name, url: value.url })
                ).find(o => o.name.toLowerCase().includes(sOptions?.uploadDate!)) ?? filters;

        // Custom Options - Duration: null
        if (sOptions?.duration !== null)
            filters =
                Array.from(
                    (await YTSR.getFilters(filters?.url!)).get('Duration')!,
                    ([name, value]) => ({ name, url: value.url })
                ).find(o => o.name.toLowerCase().startsWith(sOptions?.duration!)) ?? filters;

        // Custom Options - Sort by: relevance
        if (sOptions?.duration !== null)
            filters =
                Array.from(
                    (await YTSR.getFilters(filters?.url!)).get('Sort by')!,
                    ([name, value]) => ({ name, url: value.url })
                ).find(o => o.name.toLowerCase().includes(sOptions?.sortBy!)) ?? filters;

        try {
            // ! This might be wrong
            const result = await YTSR(filters?.url!, {
                limit: limit,
                requestOptions: {
                    nextPageRef: {
                        nextPageRef: filters?.url!
                    }
                }
            });

            const { items } = result;

            const i = items
                .map(item => {
                    if (item?.type?.toLowerCase() !== 'video') return null;
                    // eslint-disable-next-line no-param-reassign
                    const i = {
                        title: (item as any).title,
                        duration: (item as any).duration,
                        channel: {
                            name: (item as any).author.name
                        },
                        url: (item as any).url,
                        thumbnail: (item as any).bestThumbnail.url,
                        isLiveContent: (item as any).isLive
                    };
                    return new Song(i as any, queue, requester);
                })
                .filter(i => i) as Song[];

            return i;
        } catch (e) {
            throw new Error('SearchIsNull');
        }
    }

    /**
     * @param {String} Search
     * @param {Queue} Queue
     * @param {String} Requester
     * @param {String?} LocalAddress
     * @return {Promise<Song>}
     */
    static async link(
        search: string,
        queue: Queue,
        requester: string,
        localAddress: string
    ): Promise<Song | null> {
        const spotifyLink = RegExpList.Spotify.test(search);
        const youTubeLink = RegExpList.YouTubeVideo.test(search);

        if (spotifyLink) {
            try {
                const spotifyResult = await getPreview(search);
                const searchResult = await this.search(
                    `${spotifyResult.artist} - ${spotifyResult.title}`,
                    {},
                    queue,
                    requester
                );
                return searchResult[0];
            } catch (e) {
                throw new Error('InvalidSpotify');
            }
        } else if (youTubeLink) {
            const videoID = ParseYouTubeVideo(search);
            if (!videoID) throw new Error('SearchIsNull');

            YouTube.options.localAddress = localAddress;
            const videoResult = await YouTube.getVideo(videoID.toString());
            (videoResult as any).duration = VideoDurationResolver(
                (videoResult as any).duration ?? 0
            );
            (videoResult as any).url = search;

            return new Song(videoResult as any, queue, requester);
        }

        return null;
    }

    /**
     * @param {String} Search
     * @param {Partial<PlayOptions>} SOptions
     * @param {Queue} Queue
     * @param {String} Requester
     * @param {Number} Limit
     * @return {Promise<Song>}
     */
    static async best(
        search: string,
        sOptions: Partial<PlayOptions>,
        queue: Queue,
        requester: string,
        limit = 1
    ): Promise<Song> {
        let song;

        song = await this.link(search, queue, requester, sOptions?.localAddress!);

        // eslint-disable-next-line prefer-destructuring
        if (!song) song = (await this.search(search, sOptions, queue, requester, limit))[0];

        return song;
    }

    /**
     * @param {String} Search
     * @param {Queue} Queue
     * @param {String} Requester
     * @param {Number} Limit
     * @param {String?} LocalAddress
     * @return {Promise<Playlist>}
     */
    static async playlist(
        Search: string,
        Queue: Queue,
        Requester: string,
        Limit = -1,
        LocalAddress: string
    ): Promise<Playlist> {
        const SpotifyPlaylistLink = RegExpList.SpotifyPlaylist.test(Search);
        const YouTubePlaylistLink = RegExpList.YouTubePlaylist.test(Search);

        if (SpotifyPlaylistLink) {
            let SpotifyResult = await getData(Search).catch(() => null);
            if (!SpotifyResult || !['playlist', 'album'].includes(SpotifyResult.type))
                throw new Error('InvalidPlaylist');

            SpotifyResult = {
                title: SpotifyResult.name,
                channel:
                    SpotifyResult.type === 'playlist'
                        ? { name: SpotifyResult.owner.display_name }
                        : SpotifyResult.artists[0],
                url: Search,
                videos: SpotifyResult.tracks ? SpotifyResult.tracks.items : [],
                videoCount: 0,
                type: SpotifyResult.type
            };

            SpotifyResult.videos = await Promise.all(
                SpotifyResult.videos
                    .map(async (track: any, index: any) => {
                        if (Limit !== -1 && index >= Limit) return null;
                        if (SpotifyResult.type === 'playlist') track = track.track;
                        const Result = await this.search(
                            `${track.artists[0].name} - ${track.name}`,
                            {},
                            Queue,
                            Requester
                        ).catch(() => null);
                        return Result ? Result[0] : null;
                    })
                    .filter((V: any) => V)
            );
            SpotifyResult.videoCount =
                Limit === -1
                    ? SpotifyResult.videos.length
                    : SpotifyResult.videos.length > Limit
                    ? Limit
                    : SpotifyResult.videos.length;

            return new Playlist(SpotifyResult, Queue, Requester);
        }
        if (YouTubePlaylistLink) {
            const PlaylistID = ParseYouTubePlaylist(Search);
            if (!PlaylistID) throw new Error('InvalidPlaylist');

            YouTube.options.localAddress = LocalAddress;
            const YouTubeResult = await YouTube.getPlaylist(PlaylistID.toString());
            if (!YouTubeResult || Object.keys(YouTubeResult).length === 0)
                throw new Error('InvalidPlaylist');

            YouTubeResult.videos = YouTubeResult.videos
                .map((video, index) => {
                    if (Limit !== -1 && index >= Limit) return null;
                    video.duration = Number(VideoDurationResolver(video.duration ?? 0));
                    (video as any).url = `https://youtube.com/watch?v=${video.id}`;
                    (video as any).isLiveContent = video.isLive;

                    return new Song(video, Queue, Requester);
                })
                .filter(V => V) as any;

            (YouTubeResult as any).url = Search;
            YouTubeResult.videoCount =
                Limit === -1
                    ? YouTubeResult.videoCount
                    : YouTubeResult.videoCount > Limit
                    ? Limit
                    : YouTubeResult.videoCount;

            return new Playlist(YouTubeResult, Queue, Requester);
        }

        throw new Error('InvalidPlaylist');
    }

    /**
     * Converts Milliseconds to Time (HH:MM:SS)
     * @param {Number} ms Milliseconds
     * @returns {String}
     */
    static MillisecondsToTime(ms: number): string {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 60000) % 60);
        const hours = Math.floor(ms / 3600000);

        const secondsT = `${seconds}`.padStart(2, '0');
        const minutesT = `${minutes}`.padStart(2, '0');
        const hoursT = `${hours}`.padStart(2, '0');

        return `${hours ? `${hoursT}:` : ''}${minutesT}:${secondsT}`;
    }

    /**
     * Converts Time (HH:MM:SS) to Milliseconds
     * @param {String} time Time
     * @returns {number}
     */
    static TimeToMilliseconds(time: string): number {
        const items = time.split(':');
        return (
            items.reduceRight(
                (prev, curr, i, arr) => prev + parseInt(curr, 10) * 60 ** (arr.length - 1 - i),
                0
            ) * 1000
        );
    }

    /**
     * Create a text progress bar
     * @param {Number} value - The value to fill the bar
     * @param {Number} maxValue - The max value of the bar
     * @param {Number} size - The bar size (in letters)
     * @param {String} loadedIcon - Loaded Icon
     * @param {String} arrowIcon - Arrow Icon
     * @return {String} - Music Bar
     */
    static buildBar(
        value: number,
        maxValue: number,
        size: number,
        loadedIcon: string,
        arrowIcon: string
    ): string {
        const percentage = value / maxValue;
        const progress = Math.round(size * percentage);
        const emptyProgress = size - progress;

        const progressText = loadedIcon.repeat(progress) + arrowIcon;
        const emptyProgressText = ' '.repeat(emptyProgress);

        return `[${progressText}${emptyProgressText}][${this.MillisecondsToTime(
            value
        )}/${this.MillisecondsToTime(maxValue)}]`;
    }

    /**
     * @param {Partial<PlayerOptions>} options
     * @returns {PlayerOptions|Partial<PlayerOptions>}
     */
    static deserializeOptionsPlayer(
        options: Partial<PlayerOptions>
    ): PlayerOptions | Partial<PlayerOptions> {
        if (options && typeof options === 'object')
            return Object.assign({}, this.PlayerOptions, options);
        return this.PlayerOptions as any;
    }

    /**
     * @param {Partial<PlayerOptions>|String} options
     * @returns {Partial<PlayOptions>}
     */
    static deserializeOptionsPlay(options: Partial<PlayerOptions> | string): Partial<PlayOptions> {
        if (options && typeof options === 'object')
            return Object.assign({}, this.PlayOptions, options) as any;
        if (typeof options === 'string')
            return Object.assign({}, this.PlayOptions, { search: options }) as any;
        return this.PlayOptions as any;
    }

    /**
     * @param {Partial<PlayerOptions>|String} options
     * @returns {Partial<PlayOptions>}
     */
    static deserializeOptionsPlaylist(
        options: Partial<PlayerOptions> | string
    ): Partial<PlayOptions> {
        if (options && typeof options === 'object')
            return Object.assign({}, this.PlaylistOptions, options) as any;
        if (typeof options === 'string')
            return Object.assign({}, this.PlaylistOptions, { search: options }) as any;
        return this.PlaylistOptions as any;
    }

    /**
     * @param {Partial<PlayerOptions>} options
     * @returns {Partial<ProgressOptions>}
     */
    static deserializeOptionsProgress(options: Partial<PlayerOptions>): Partial<ProgressOptions> {
        if (options && typeof options === 'object')
            return Object.assign({}, this.ProgressOptions, options);
        return this.ProgressOptions;
    }

    /**
     * @param {Discord.VoiceState} voice
     * @return {Boolean}
     */
    static isVoice(voice: VoiceState): boolean {
        if (voice.constructor.name !== Discord.VoiceState.name) return false;
        return voice.channel
            ? voice.channel.constructor.name === 'VoiceChannel' ||
                  voice.channel.constructor.name === 'StageChannel'
            : false;
    }

    /**
     * @param {Array} array
     * @return {Array}
     */
    static shuffle(array: Array<number>): Array<number> {
        if (!Array.isArray(array)) return [];
        const clone = [...array];
        const shuffled = [];
        while (clone.length > 0)
            shuffled.push(clone.splice(Math.floor(Math.random() * clone.length), 1)[0]);
        return shuffled;
    }
}
