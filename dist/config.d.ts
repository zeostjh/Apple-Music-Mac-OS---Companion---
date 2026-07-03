import type { SomeCompanionConfigField } from '@companion-module/base';
export type ModuleConfig = {
    pollInterval: number;
};
export declare function normalizeConfig(config: Partial<ModuleConfig> | undefined): ModuleConfig;
export declare function GetConfigFields(): SomeCompanionConfigField[];
//# sourceMappingURL=config.d.ts.map