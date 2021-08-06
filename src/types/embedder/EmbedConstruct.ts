import { Song } from 'discord-music-player';
import { MessageEmbed } from 'discord.js';

export interface EmbedConstruct {
    queue: Song[];
    embed: MessageEmbed;
}
