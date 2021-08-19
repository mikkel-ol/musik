export class MusicPlayerError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'MusicPlayerError';
    }
}
