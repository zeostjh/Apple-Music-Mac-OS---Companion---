import type ModuleInstance from './main.js'

export type VariablesSchema = {
	track_name: string
	artist: string
	album: string
	elapsed_seconds: number
	total_seconds: number
	remaining_seconds: number
	elapsed_formatted: string
	total_formatted: string
	remaining_formatted: string
	player_state: string
	is_playing: boolean
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'track_name', name: 'Track Name' },
		{ variableId: 'artist', name: 'Artist' },
		{ variableId: 'album', name: 'Album' },
		{ variableId: 'elapsed_seconds', name: 'Elapsed Time (seconds)' },
		{ variableId: 'total_seconds', name: 'Total Time (seconds)' },
		{ variableId: 'remaining_seconds', name: 'Remaining Time (seconds)' },
		{ variableId: 'elapsed_formatted', name: 'Elapsed Time (mm:ss)' },
		{ variableId: 'total_formatted', name: 'Total Time (mm:ss)' },
		{ variableId: 'remaining_formatted', name: 'Remaining Time (mm:ss)' },
		{ variableId: 'player_state', name: 'Player State' },
		{ variableId: 'is_playing', name: 'Is Playing' },
	])
}
