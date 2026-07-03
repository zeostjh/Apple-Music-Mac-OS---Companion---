import type ModuleInstance from './main.js';
export type ActionsSchema = {
    play: {
        options: Record<string, never>;
    };
    pause: {
        options: Record<string, never>;
    };
    toggle_play_pause: {
        options: Record<string, never>;
    };
    stop: {
        options: Record<string, never>;
    };
    next_track: {
        options: Record<string, never>;
    };
    previous_track: {
        options: Record<string, never>;
    };
};
export declare function UpdateActions(self: ModuleInstance): void;
//# sourceMappingURL=actions.d.ts.map