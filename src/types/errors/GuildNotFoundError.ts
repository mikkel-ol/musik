export class GuildNotFoundError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'GuildNotFoundError';
    }
}
