import { Song } from 'discord-music-player';
import { MessageEmbed } from 'discord.js';

export interface EmbedConstruct {
    state: string | undefined;
    queue: Song[];
    embed: MessageEmbed;
    channel: string,
    messageId: string | undefined,
}
