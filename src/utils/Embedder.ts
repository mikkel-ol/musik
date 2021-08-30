/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Song } from 'discord-music-player';
import { Channel, EmbedField, Guild, MessageEmbed, TextChannel } from 'discord.js';
import { Service } from 'typedi';
import { EmbedConstruct } from '../types/embedder/EmbedConstruct';
import { GuildNotFoundError } from '../types/errors/GuildNotFoundError';
import '../extensions/StringExtensions';
import { Client } from '../Client';
import { Player } from '../music/Player';
import { PlayerState } from '../music/PlayerState';

@Service()
export class Embedder {
    private embedMap: Map<string, EmbedConstruct>;

    constructor(private client: Client) {
        this.embedMap = new Map<string, EmbedConstruct>();
    }

    public add(guildId: string, song: Song, channelId: string) {
        let embedConstr = this.embedMap.get(guildId);

        if (!embedConstr) {
            if (!channelId) throw new Error(`Cannot initiate message embed without a text channel`);
            this.generate(guildId, channelId);
            embedConstr = this.embedMap.get(guildId);
        }

        embedConstr!.state = PlayerState.PLAYING;
        embedConstr!.queue.push(song);

        this.update(guildId);
    }

    public pop() {

    }

    public pause() {

    }

    public async patch(guildId: string) {
        const embedConstr = this.embedMap.get(guildId);

        if (!embedConstr) throw new GuildNotFoundError(`Could not find guild with ID ${guildId}`);

        const channel = await this.client.channels.fetch(embedConstr.channel) as TextChannel;

        if (embedConstr.messageId) {
            const msg = await channel.messages.fetch(embedConstr.messageId);
            msg.edit({ embeds: [embedConstr.embed] });
        } else {
            const msg = await channel.send({ embeds: [embedConstr.embed] });
            embedConstr.messageId = msg.id;
        }
    }

    /**
     * 
     * @param guildId 
     */
    private update(guildId: string) {
        const embedConstr = this.embedMap.get(guildId);

        if (!embedConstr) throw new GuildNotFoundError(`Could not find guild with ID ${guildId}`);

        const embed = embedConstr.embed;
        const currentSong = embedConstr.queue[0];

        const title = this.makeSongTitle(currentSong);

        embed
            .setThumbnail(currentSong.thumbnail.valueOf())
            .setTitle(title)
            .setURL(currentSong.url.valueOf())
            .setAuthor(embedConstr.state!, this.client.user?.avatarURL()!);
            
        this.makeQueueField(embedConstr);
    }

    /**
     * 
     * @param guildId 
     * @param song 
     * @param channelId 
     * @returns 
     */
    private generate(guildId: string, channelId: string): MessageEmbed {
        const newEmbed = new MessageEmbed();

        const songArray = new Array<Song>();

        this.embedMap.set(guildId, {
            state: undefined,
            queue: songArray,
            embed: newEmbed,
            channel: channelId,
            messageId: undefined
        });

        return newEmbed;
    }

    /**
     * 
     * @param embedConstr 
     * @returns 
     */
    private makeQueueField(embedConstr: EmbedConstruct): EmbedField | undefined {
        if (embedConstr.queue.length <= 1) return undefined;

        let queueField = {
            name: 'Queue:',
            value: '',
            inline: false
        } as EmbedField;

        // build field
        for (let i = 1; i < embedConstr.queue.length; i += 1) {
            queueField.value += `${i}: ${embedConstr.queue[i].name.shorten(50)}\n`;
        }

        embedConstr.embed.fields[0] = queueField;

        return queueField;
    }

    /**
     * Helper function to format song title to fit into message
     * @param song The Song object with title
     * @returns Formatted song title
     */
    private makeSongTitle(song: Song): string {
        return song.name.substr(0, 50).length < song.name.length
            ? `${song.name.shorten(50)}`
            : song.name;
    }
}
