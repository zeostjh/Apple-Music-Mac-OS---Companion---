// 2026-07-02: Generated following official Bitfocus Companion module best practices.
import {
	InstanceBase,
	InstanceStatus,
	runEntrypoint,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { GetConfigFields, normalizeConfig, type ModuleConfig } from './config.js'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { UpdateFeedbacks, type FeedbacksSchema } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { UpdateVariableDefinitions, type VariablesSchema } from './variables.js'
import { OUTPUT_SEPARATOR, parsePlayerState, secondsToFormatted, toInteger } from './helpers.js'
import { DEFAULT_STATE, type MusicState, type PlayerState } from './types.js'

const execFileAsync = promisify(execFile)

type ActionCommand =
	| 'play'
	| 'pause'
	| 'toggle_play_pause'
	| 'stop'
	| 'next_track'
	| 'previous_track'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: FeedbacksSchema
	variables: VariablesSchema
}

export default class ModuleInstance extends InstanceBase<ModuleConfig, undefined> {
	config: ModuleConfig = normalizeConfig(undefined)
	private pollTimer: NodeJS.Timeout | null = null
	private state: MusicState = { ...DEFAULT_STATE }

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, _secrets: undefined): Promise<void> {
		this.config = normalizeConfig(config)

		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()
		this.publishState()

		if (process.platform !== 'darwin') {
			this.updateStatus(InstanceStatus.BadConfig, 'Apple Music module is macOS-only')
			this.log('error', 'Apple Music module loaded on a non-macOS platform')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.startPolling()
	}

	async destroy(): Promise<void> {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}

		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig, _secrets: undefined): Promise<void> {
		const nextConfig = normalizeConfig(config)
		const didIntervalChange = nextConfig.pollInterval !== this.config.pollInterval
		this.config = nextConfig

		if (process.platform === 'darwin' && didIntervalChange) {
			this.restartPolling()
		}
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updatePresets(): void {
		UpdatePresets(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	getState(): MusicState {
		return this.state
	}

	async runTransportCommand(command: ActionCommand): Promise<void> {
		if (process.platform !== 'darwin') {
			this.updateStatus(InstanceStatus.BadConfig, 'Apple Music module is macOS-only')
			return
		}

		const script = this.scriptForCommand(command)

		try {
			await this.runAppleScript(script)
			await this.pollStatus()
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.log('warn', `AppleScript command failed: ${message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Unable to control Apple Music')
		}
	}

	private startPolling(): void {
		this.stopPolling()

		this.pollTimer = setInterval(() => {
			void this.pollStatus()
		}, this.config.pollInterval)

		void this.pollStatus()
	}

	private restartPolling(): void {
		this.startPolling()
	}

	private stopPolling(): void {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = null
		}
	}

	private async pollStatus(): Promise<void> {
		try {
			this.state = await this.queryMusicState()
			this.publishState()
			this.updateStatus(InstanceStatus.Ok)
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error)
			this.log('debug', `Apple Music polling failed: ${message}`)
			this.state = { ...DEFAULT_STATE }
			this.publishState()
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Unable to query Apple Music')
		}
	}

	private publishState(): void {
		const elapsed = this.state.elapsedSeconds
		const total = this.state.totalSeconds
		const remaining = Math.max(0, total - elapsed)

		this.setVariableValues({
			track_name: this.state.trackName,
			artist: this.state.artist,
			album: this.state.album,
			elapsed_seconds: elapsed,
			total_seconds: total,
			remaining_seconds: remaining,
			elapsed_formatted: secondsToFormatted(elapsed),
			total_formatted: secondsToFormatted(total),
			remaining_formatted: secondsToFormatted(remaining),
			player_state: this.state.playerState,
			is_playing: this.state.playerState === 'playing',
		})

		this.checkFeedbacks('is_playing', 'is_paused', 'player_state_matches')
	}

	private scriptForCommand(command: ActionCommand): string {
		switch (command) {
			case 'play':
				return 'tell application "Music" to play'
			case 'pause':
				return 'tell application "Music" to pause'
			case 'toggle_play_pause':
				return this.state.playerState === 'playing'
					? 'tell application "Music" to pause'
					: 'tell application "Music" to play'
			case 'stop':
				return 'tell application "Music" to stop'
			case 'next_track':
				return 'tell application "Music" to next track'
			case 'previous_track':
				return 'tell application "Music" to previous track'
		}
	}

	private async queryMusicState(): Promise<MusicState> {
		const script = `
			tell application "Music"
				set _sep to ASCII character 31
				if it is running then
					set _state to (player state as text)
					if _state is "playing" or _state is "paused" then
						set _name to (name of current track as text)
						set _artist to (artist of current track as text)
						set _album to (album of current track as text)
						set _duration to (duration of current track as integer)
						set _position to (player position as integer)
						return _name & _sep & _artist & _sep & _album & _sep & _duration & _sep & _position & _sep & _state
					else
						return "" & _sep & "" & _sep & "" & _sep & "0" & _sep & "0" & _sep & "stopped"
					end if
				else
					return "" & _sep & "" & _sep & "" & _sep & "0" & _sep & "0" & _sep & "stopped"
				end if
			end tell
		`

		const result = await this.runAppleScript(script)
		const fields = result.trim().split(OUTPUT_SEPARATOR)

		if (fields.length < 6) {
			return { ...DEFAULT_STATE }
		}

		const total = toInteger(fields[3])
		const elapsed = toInteger(fields[4])
		const playerState: PlayerState = parsePlayerState(fields[5])

		return {
			trackName: fields[0] ?? '',
			artist: fields[1] ?? '',
			album: fields[2] ?? '',
			totalSeconds: total,
			elapsedSeconds: Math.min(elapsed, total || elapsed),
			playerState,
		}
	}

	private async runAppleScript(script: string): Promise<string> {
		const { stdout } = await execFileAsync('osascript', ['-e', script])
		return String(stdout)
	}
}

runEntrypoint(ModuleInstance, [])
