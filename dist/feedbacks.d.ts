import type { PlayerState } from './types.js';
import type ModuleInstance from './main.js';
export type FeedbacksSchema = {
    is_playing: {
        type: 'boolean';
        options: Record<string, never>;
    };
    is_paused: {
        type: 'boolean';
        options: Record<string, never>;
    };
    player_state_matches: {
        type: 'boolean';
        options: {
            state: PlayerState;
        };
    };
};
export declare function UpdateFeedbacks(self: ModuleInstance): void;
//# sourceMappingURL=feedbacks.d.ts.map