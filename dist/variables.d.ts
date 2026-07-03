import type ModuleInstance from './main.js';
export type VariablesSchema = {
    track_name: string;
    artist: string;
    album: string;
    elapsed_seconds: number;
    total_seconds: number;
    remaining_seconds: number;
    elapsed_formatted: string;
    total_formatted: string;
    remaining_formatted: string;
    player_state: string;
    is_playing: boolean;
};
export declare function UpdateVariableDefinitions(self: ModuleInstance): void;
//# sourceMappingURL=variables.d.ts.map