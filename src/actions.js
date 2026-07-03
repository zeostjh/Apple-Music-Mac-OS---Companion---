module.exports = function (self) {
	self.setActionDefinitions({
		play_pause: {
			name: 'Play/Pause',
			options: [],
			callback: async () => {
				await self.runTransportCommand('playpause')
			},
		},
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
		next_track: {
			name: 'Next Track',
			options: [],
			callback: async () => {
				await self.runTransportCommand('next track')
			},
		},
		previous_track: {
			name: 'Previous Track',
			options: [],
			callback: async () => {
				await self.runTransportCommand('previous track')
			},
		},
		refresh_metadata: {
			name: 'Refresh Metadata',
			options: [],
			callback: async () => {
				await self.refreshState()
			},
		},
	})
}
