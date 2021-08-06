export interface PlayerOptions {
    leaveOnEnd?: boolean;
    leaveOnStop?: boolean;
    leaveOnEmpty?: boolean;
    deafenOnJoin?: boolean;
    timeout?: number;
    volume?: number;
    quality?: 'high' | 'low';
}
