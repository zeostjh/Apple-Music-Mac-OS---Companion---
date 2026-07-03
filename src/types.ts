export type PlayerState = 'playing' | 'paused' | 'stopped'

export interface MusicState {
	trackName: string
	artist: string
	album: string
	totalSeconds: number
	elapsedSeconds: number
	playerState: PlayerState
}

export const DEFAULT_STATE: MusicState = {
	trackName: '',
	artist: '',
	album: '',
	totalSeconds: 0,
	elapsedSeconds: 0,
	playerState: 'stopped',
}
