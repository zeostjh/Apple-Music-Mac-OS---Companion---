module.exports = async function (self) {
	self.setFeedbackDefinitions({
		is_playing: {
			name: 'Playing',
			type: 'boolean',
			label: 'Player is playing',
			defaultStyle: {
				bgcolor: 0x00ff00,
				color: 0x000000,
			},
			options: [],
			callback: () => self.state.player_state === 'playing',
		},
		is_paused: {
			name: 'Paused',
			type: 'boolean',
			label: 'Player is paused',
			defaultStyle: {
				bgcolor: 0xffff00,
				color: 0x000000,
			},
			options: [],
			callback: () => self.state.player_state === 'paused',
		},
	})
}
