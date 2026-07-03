import type { PlayerState } from './types.js'

export const OUTPUT_SEPARATOR = String.fromCharCode(31)

export function toInteger(value: string): number {
	const parsed = Number.parseInt(value, 10)
	if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 0) {
		return 0
	}

	return parsed
}

export function parsePlayerState(state: string): PlayerState {
	const normalized = state.trim().toLowerCase()
	if (normalized === 'playing' || normalized === 'paused' || normalized === 'stopped') {
		return normalized
	}

	return 'stopped'
}

export function secondsToFormatted(seconds: number): string {
	const safeSeconds = Math.max(0, Math.floor(seconds))
	const mins = Math.floor(safeSeconds / 60)
	const secs = safeSeconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
