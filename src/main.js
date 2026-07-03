const { execFile } = require('node:child_process')
const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpgradeScripts = require('./upgrades')

class AppleMusicInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.execFile = execFile
		this.pollTimer = undefined
		this.state = this.getDefaultState()
	}

	getDefaultState() {
		return {
			track_name: '',
			artist_name: '',
			album_name: '',
			player_state: 'stopped',
		}
	}

	async init(config) {
		this.config = config

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.setVariableValues(this.state)

		this.startPolling()
		await this.refreshState()
	}

	async destroy() {
		this.stopPolling()
	}

	async configUpdated(config) {
		this.config = config
		this.startPolling()
		await this.refreshState()
	}

	getConfigFields() {
		return [
			{
				type: 'number',
				id: 'poll_interval',
				label: 'Metadata poll interval (seconds)',
				width: 6,
				default: 5,
				min: 1,
				max: 60,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}

	startPolling() {
		this.stopPolling()

		const intervalMs = Math.max(Number(this.config?.poll_interval) || 5, 1) * 1000
		this.pollTimer = setInterval(() => {
			void this.refreshState()
		}, intervalMs)
	}

	stopPolling() {
		if (this.pollTimer) {
			clearInterval(this.pollTimer)
			this.pollTimer = undefined
		}
	}

	async runTransportCommand(command) {
		await this.executeMusicScript([command])
		await this.refreshState()
	}

	async refreshState() {
		try {
			const output = await this.executeMusicScript([
				'if it is running then',
				'	set trackName to ""',
				'	set artistName to ""',
				'	set albumName to ""',
				'	set stateName to (player state as text)',
				'	if player state is playing or player state is paused then',
				'		set trackName to name of current track',
				'		set artistName to artist of current track',
				'		set albumName to album of current track',
				'	end if',
				'	return trackName & linefeed & artistName & linefeed & albumName & linefeed & stateName',
				'else',
				'	return linefeed & linefeed & linefeed & "stopped"',
				'end if',
			])

			const [track_name = '', artist_name = '', album_name = '', player_state = 'stopped'] = output.split(/\r?\n/)
			this.state = { track_name, artist_name, album_name, player_state }
			this.setVariableValues(this.state)
			this.checkFeedbacks()
			this.updateStatus(InstanceStatus.Ok)
		} catch (error) {
			this.log('warn', `Unable to query Apple Music: ${error.message}`)
			this.state = this.getDefaultState()
			this.setVariableValues(this.state)
			this.checkFeedbacks()
			this.updateStatus(InstanceStatus.ConnectionFailure, error.message)
		}
	}

	async executeMusicScript(lines) {
		const script = ['tell application "Music"', ...lines, 'end tell'].join('\n')

		return await new Promise((resolve, reject) => {
			this.execFile('osascript', ['-e', script], (error, stdout, stderr) => {
				if (error) {
					reject(new Error((stderr || '').trim() || error.message))
					return
				}

				resolve((stdout || '').trim())
			})
		})
	}
}

runEntrypoint(AppleMusicInstance, UpgradeScripts)
