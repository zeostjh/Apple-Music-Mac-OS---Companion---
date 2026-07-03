import type { CompanionPresetDefinitions } from '@companion-module/base'
import type ModuleInstance from './main.js'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}

	presets.play_pause_toggle = {
		type: 'button',
		category: 'Transport',
		name: 'Play/Pause Toggle',
		style: {
			text: 'Play/Pause',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x1f1f1f,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'toggle_play_pause',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'is_playing',
				options: {},
				style: {
					bgcolor: 0x00aa00,
					color: 0xffffff,
				},
			},
		],
	}

	presets.next_track = {
		type: 'button',
		category: 'Transport',
		name: 'Next Track',
		style: {
			text: 'Next',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x1f1f1f,
			show_topbar: false,
		},
		steps: [{ down: [{ actionId: 'next_track', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets.previous_track = {
		type: 'button',
		category: 'Transport',
		name: 'Previous Track',
		style: {
			text: 'Previous',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x1f1f1f,
			show_topbar: false,
		},
		steps: [{ down: [{ actionId: 'previous_track', options: {} }], up: [] }],
		feedbacks: [],
	}

	presets.track_info = {
		type: 'button',
		category: 'Track Info',
		name: 'Track Info',
		style: {
			text: '$(apple-music:track_name)\\n$(apple-music:artist)',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x2a2a2a,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	}

	presets.elapsed_time = {
		type: 'button',
		category: 'Track Info',
		name: 'Elapsed Time',
		style: {
			text: 'Elapsed\\n$(apple-music:elapsed_formatted)',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	}

	presets.remaining_time = {
		type: 'button',
		category: 'Track Info',
		name: 'Remaining Time',
		style: {
			text: 'Remaining\\n$(apple-music:remaining_formatted)',
			size: '14',
			color: 0xffffff,
			bgcolor: 0x000000,
			show_topbar: false,
		},
		steps: [],
		feedbacks: [],
	}

	self.setPresetDefinitions(presets)
}
