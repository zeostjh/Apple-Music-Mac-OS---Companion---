"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActions = UpdateActions;
function UpdateActions(self) {
    self.setActionDefinitions({
        play: {
            name: 'Play',
            options: [],
            callback: async () => {
                await self.runTransportCommand('play');
            },
        },
        pause: {
            name: 'Pause',
            options: [],
            callback: async () => {
                await self.runTransportCommand('pause');
            },
        },
        toggle_play_pause: {
            name: 'Toggle Play/Pause',
            options: [],
            callback: async () => {
                await self.runTransportCommand('toggle_play_pause');
            },
        },
        stop: {
            name: 'Stop',
            options: [],
            callback: async () => {
                await self.runTransportCommand('stop');
            },
        },
        next_track: {
            name: 'Next Track',
            options: [],
            callback: async () => {
                await self.runTransportCommand('next_track');
            },
        },
        previous_track: {
            name: 'Previous Track',
            options: [],
            callback: async () => {
                await self.runTransportCommand('previous_track');
            },
        },
    });
}
//# sourceMappingURL=actions.js.map