import { BotSettings } from '../types/bot/bot';

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
    }
};
