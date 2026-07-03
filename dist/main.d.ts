import { InstanceBase, type SomeCompanionConfigField } from '@companion-module/base';
import { type ModuleConfig } from './config.js';
import { type ActionsSchema } from './actions.js';
import { type FeedbacksSchema } from './feedbacks.js';
import { type VariablesSchema } from './variables.js';
import { type MusicState } from './types.js';
type ActionCommand = 'play' | 'pause' | 'toggle_play_pause' | 'stop' | 'next_track' | 'previous_track';
export type ModuleSchema = {
    config: ModuleConfig;
    secrets: undefined;
    actions: ActionsSchema;
    feedbacks: FeedbacksSchema;
    variables: VariablesSchema;
};
export default class ModuleInstance extends InstanceBase<ModuleConfig, undefined> {
    config: ModuleConfig;
    private pollTimer;
    private state;
    constructor(internal: unknown);
    init(config: ModuleConfig, _isFirstInit: boolean, _secrets: undefined): Promise<void>;
    destroy(): Promise<void>;
    configUpdated(config: ModuleConfig, _secrets: undefined): Promise<void>;
    getConfigFields(): SomeCompanionConfigField[];
    updateActions(): void;
    updateFeedbacks(): void;
    updatePresets(): void;
    updateVariableDefinitions(): void;
    getState(): MusicState;
    runTransportCommand(command: ActionCommand): Promise<void>;
    private startPolling;
    private restartPolling;
    private stopPolling;
    private pollStatus;
    private publishState;
    private scriptForCommand;
    private queryMusicState;
    private runAppleScript;
}
export {};
//# sourceMappingURL=main.d.ts.map