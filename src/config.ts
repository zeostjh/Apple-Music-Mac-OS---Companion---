import type { SomeCompanionConfigField } from '@companion-module/base'

export type ModuleConfig = {
	pollInterval: number
}

const DEFAULT_POLL_INTERVAL = 1500
const MIN_POLL_INTERVAL = 500
const MAX_POLL_INTERVAL = 5000

export function normalizeConfig(config: Partial<ModuleConfig> | undefined): ModuleConfig {
	const pollInterval = Number.isFinite(config?.pollInterval)
		? Math.max(MIN_POLL_INTERVAL, Math.min(MAX_POLL_INTERVAL, Math.floor(config?.pollInterval ?? DEFAULT_POLL_INTERVAL)))
		: DEFAULT_POLL_INTERVAL

	return {
		pollInterval,
	}
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Poll Interval (ms)',
			width: 8,
			default: DEFAULT_POLL_INTERVAL,
			min: MIN_POLL_INTERVAL,
			max: MAX_POLL_INTERVAL,
			step: 100,
		},
	]
}
