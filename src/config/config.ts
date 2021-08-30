import { Intents } from 'discord.js';
import { BotSettings } from '../types/bot/Bot';

export const settings: BotSettings = {
    presence: {
        activities: [
            {
            name: 'porn',
            type: 'WATCHING'
            }
        ]
    },
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
    prefix: '!',
    paths: {
        commands: 'src/commands',
        events: {
            bot: 'src/events',
            player: 'src/music/events'
        }
    },
    volume: 50,
    fadeTime: 2000
};
