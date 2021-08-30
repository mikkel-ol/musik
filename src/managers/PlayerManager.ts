import { Service } from 'typedi';
import { join } from 'path';
import { readdir } from 'fs';
import { Logger } from '../utils/Logger';
import { Player, PlayerEvents, Queue } from 'discord-music-player';
import { Client } from '../Client';

@Service()
export class PlayerManager {
    public initializeEvents(client: Client, player: Player): void {
        const events = client.settings.paths.events.player;

        readdir(events, (err, files) => {
            if (err) Logger.error(err);

            files.forEach(evt => {
                const Event: any = require(join(
                    __dirname,
                    '../../',
                    `${events}/${evt.replace('ts', 'js')}`
                )).default;

                const event = new Event(player);
                const eventName = evt.split('.')[0];

                player.on(
                    (eventName.charAt(0).toLowerCase() + eventName.slice(1) as keyof PlayerEvents),
                    (...args: any) => event.run(args)
                );
            });
        });
    }
}
