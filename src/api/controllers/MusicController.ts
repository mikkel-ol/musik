import { Authorized, Controller, Get } from 'routing-controllers';

@Controller('/music')
export class MusicController {
    @Authorized()
    @Get()
    getAll(): string {
        return 'Works';
    }
}
