export type PlayerState = 'playing' | 'paused' | 'stopped';
export interface MusicState {
    trackName: string;
    artist: string;
    album: string;
    totalSeconds: number;
    elapsedSeconds: number;
    playerState: PlayerState;
}
export declare const DEFAULT_STATE: MusicState;
//# sourceMappingURL=types.d.ts.map