"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFeedbacks = UpdateFeedbacks;
function UpdateFeedbacks(self) {
    self.setFeedbackDefinitions({
        is_playing: {
            type: 'boolean',
            name: 'Is Playing',
            defaultStyle: {
                bgcolor: 0x00aa00,
                color: 0xffffff,
            },
            options: [],
            callback: () => {
                return self.getState().playerState === 'playing';
            },
        },
        is_paused: {
            type: 'boolean',
            name: 'Is Paused',
            defaultStyle: {
                bgcolor: 0xcc8800,
                color: 0xffffff,
            },
            options: [],
            callback: () => {
                return self.getState().playerState === 'paused';
            },
        },
        player_state_matches: {
            type: 'boolean',
            name: 'Player State Matches',
            defaultStyle: {
                bgcolor: 0x0055aa,
                color: 0xffffff,
            },
            options: [
                {
                    id: 'state',
                    type: 'dropdown',
                    label: 'State',
                    default: 'playing',
                    choices: [
                        { id: 'playing', label: 'Playing' },
                        { id: 'paused', label: 'Paused' },
                        { id: 'stopped', label: 'Stopped' },
                    ],
                },
            ],
            callback: (feedback) => {
                const selectedState = String(feedback.options.state ?? 'playing');
                return self.getState().playerState === selectedState;
            },
        },
    });
}
//# sourceMappingURL=feedbacks.js.map