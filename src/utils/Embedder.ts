/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Song } from 'discord-music-player';
import { EmbedField, Guild, MessageEmbed } from 'discord.js';
import { Service } from 'typedi';
import { EmbedConstruct } from '../types/embedder/EmbedConstruct';
import { GuildNotFoundError } from '../types/errors/GuildNotFoundError';
import '../extensions/StringExtensions';

@Service()
export class Embedder {
    private embeds: Map<Guild, EmbedConstruct>;

    constructor() {
        this.embeds = new Map<Guild, EmbedConstruct>();
    }

    public generate(guild: Guild, song: Song): MessageEmbed {
        const newEmbed = new MessageEmbed();

        const title =
            song.name.substr(0, 50).length < song.name.length
                ? `${song.name.shorten(50)}`
                : song.name;

        newEmbed
            .setThumbnail(song.thumbnail.valueOf())
            .setTitle(title)
            .setURL(song.url.valueOf())
            .setImage('https://media.tenor.com/images/42d860bb74f3f334d569f9dad53fcc60/tenor.gif')
            .setAuthor('Playing', guild.client.user?.avatarURL()!);

        const songArray = new Array<Song>();

        this.embeds.set(guild, {
            queue: songArray,
            embed: newEmbed
        });

        return newEmbed;
    }

    public queue(guild: Guild, song: Song): MessageEmbed {
        const embedConstruct = this.embeds.get(guild);

        if (!embedConstruct) throw new GuildNotFoundError();

        embedConstruct.queue.push(song);

        let queueField = embedConstruct.embed.fields[0];

        // no queue atm
        if (!queueField) {
            queueField = {
                name: 'Queue:',
                value: '',
                inline: false
            } as EmbedField;
        }

        // clear field
        queueField.value = '';

        // rebuild field
        for (let i = 0; i < embedConstruct.queue.length; i += 1) {
            queueField.value += `${i + 1}: ${song.name.shorten(50)}\n`;
        }

        embedConstruct.embed.fields[0] = queueField;

        return embedConstruct.embed;
    }
}
