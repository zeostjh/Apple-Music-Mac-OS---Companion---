import type ModuleInstance from './main.js'

export type ActionsSchema = {
	play: {
		options: Record<string, never>
	}
	pause: {
		options: Record<string, never>
	}
	toggle_play_pause: {
		options: Record<string, never>
	}
	stop: {
		options: Record<string, never>
	}
	next_track: {
		options: Record<string, never>
	}
	previous_track: {
		options: Record<string, never>
	}
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		play: {
			name: 'Play',
			options: [],
			callback: async () => {
				await self.runTransportCommand('play')
			},
		},
		pause: {
			name: 'Pause',
			options: [],
			callback: async () => {
				await self.runTransportCommand('pause')
			},
		},
		toggle_play_pause: {
			name: 'Toggle Play/Pause',
			options: [],
			callback: async () => {
				await self.runTransportCommand('toggle_play_pause')
			},
		},
		stop: {
			name: 'Stop',
			options: [],
			callback: async () => {
				await self.runTransportCommand('stop')
			},
		},
		next_track: {
			name: 'Next Track',
			options: [],
			callback: async () => {
				await self.runTransportCommand('next_track')
			},
		},
		previous_track: {
			name: 'Previous Track',
			options: [],
			callback: async () => {
				await self.runTransportCommand('previous_track')
			},
		},
	})
}
