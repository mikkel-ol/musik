import { BotSettings } from '../types/bot/Bot';

export const settings: BotSettings = {
    presence: {
        activity: {
            name: 'porn',
            type: 'WATCHING'
        }
    },
    prefix: '!',
    paths: {
        commands: 'src/commands',
        events: 'src/events'
    },
    volume: 50,
    fadeTime: 2000
};
