"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 2026-07-02: Generated following official Bitfocus Companion module best practices.
const base_1 = require("@companion-module/base");
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const config_js_1 = require("./config.js");
const actions_js_1 = require("./actions.js");
const feedbacks_js_1 = require("./feedbacks.js");
const presets_js_1 = require("./presets.js");
const variables_js_1 = require("./variables.js");
const helpers_js_1 = require("./helpers.js");
const types_js_1 = require("./types.js");
const execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
class ModuleInstance extends base_1.InstanceBase {
    config = (0, config_js_1.normalizeConfig)(undefined);
    pollTimer = null;
    state = { ...types_js_1.DEFAULT_STATE };
    constructor(internal) {
        super(internal);
    }
    async init(config, _isFirstInit, _secrets) {
        this.config = (0, config_js_1.normalizeConfig)(config);
        this.updateActions();
        this.updateFeedbacks();
        this.updatePresets();
        this.updateVariableDefinitions();
        this.publishState();
        if (process.platform !== 'darwin') {
            this.updateStatus(base_1.InstanceStatus.BadConfig, 'Apple Music module is macOS-only');
            this.log('error', 'Apple Music module loaded on a non-macOS platform');
            return;
        }
        this.updateStatus(base_1.InstanceStatus.Connecting);
        this.startPolling();
    }
    async destroy() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
        this.log('debug', 'destroy');
    }
    async configUpdated(config, _secrets) {
        const nextConfig = (0, config_js_1.normalizeConfig)(config);
        const didIntervalChange = nextConfig.pollInterval !== this.config.pollInterval;
        this.config = nextConfig;
        if (process.platform === 'darwin' && didIntervalChange) {
            this.restartPolling();
        }
    }
    getConfigFields() {
        return (0, config_js_1.GetConfigFields)();
    }
    updateActions() {
        (0, actions_js_1.UpdateActions)(this);
    }
    updateFeedbacks() {
        (0, feedbacks_js_1.UpdateFeedbacks)(this);
    }
    updatePresets() {
        (0, presets_js_1.UpdatePresets)(this);
    }
    updateVariableDefinitions() {
        (0, variables_js_1.UpdateVariableDefinitions)(this);
    }
    getState() {
        return this.state;
    }
    async runTransportCommand(command) {
        if (process.platform !== 'darwin') {
            this.updateStatus(base_1.InstanceStatus.BadConfig, 'Apple Music module is macOS-only');
            return;
        }
        const script = this.scriptForCommand(command);
        try {
            await this.runAppleScript(script);
            await this.pollStatus();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.log('warn', `AppleScript command failed: ${message}`);
            this.updateStatus(base_1.InstanceStatus.ConnectionFailure, 'Unable to control Apple Music');
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(() => {
            void this.pollStatus();
        }, this.config.pollInterval);
        void this.pollStatus();
    }
    restartPolling() {
        this.startPolling();
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    async pollStatus() {
        try {
            this.state = await this.queryMusicState();
            this.publishState();
            this.updateStatus(base_1.InstanceStatus.Ok);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.log('debug', `Apple Music polling failed: ${message}`);
            this.state = { ...types_js_1.DEFAULT_STATE };
            this.publishState();
            this.updateStatus(base_1.InstanceStatus.ConnectionFailure, 'Unable to query Apple Music');
        }
    }
    publishState() {
        const elapsed = this.state.elapsedSeconds;
        const total = this.state.totalSeconds;
        const remaining = Math.max(0, total - elapsed);
        this.setVariableValues({
            track_name: this.state.trackName,
            artist: this.state.artist,
            album: this.state.album,
            elapsed_seconds: elapsed,
            total_seconds: total,
            remaining_seconds: remaining,
            elapsed_formatted: (0, helpers_js_1.secondsToFormatted)(elapsed),
            total_formatted: (0, helpers_js_1.secondsToFormatted)(total),
            remaining_formatted: (0, helpers_js_1.secondsToFormatted)(remaining),
            player_state: this.state.playerState,
            is_playing: this.state.playerState === 'playing',
        });
        this.checkFeedbacks('is_playing', 'is_paused', 'player_state_matches');
    }
    scriptForCommand(command) {
        switch (command) {
            case 'play':
                return 'tell application "Music" to play';
            case 'pause':
                return 'tell application "Music" to pause';
            case 'toggle_play_pause':
                return this.state.playerState === 'playing'
                    ? 'tell application "Music" to pause'
                    : 'tell application "Music" to play';
            case 'stop':
                return 'tell application "Music" to stop';
            case 'next_track':
                return 'tell application "Music" to next track';
            case 'previous_track':
                return 'tell application "Music" to previous track';
        }
    }
    async queryMusicState() {
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
		`;
        const result = await this.runAppleScript(script);
        const fields = result.trim().split(helpers_js_1.OUTPUT_SEPARATOR);
        if (fields.length < 6) {
            return { ...types_js_1.DEFAULT_STATE };
        }
        const total = (0, helpers_js_1.toInteger)(fields[3]);
        const elapsed = (0, helpers_js_1.toInteger)(fields[4]);
        const playerState = (0, helpers_js_1.parsePlayerState)(fields[5]);
        return {
            trackName: fields[0] ?? '',
            artist: fields[1] ?? '',
            album: fields[2] ?? '',
            totalSeconds: total,
            elapsedSeconds: Math.min(elapsed, total || elapsed),
            playerState,
        };
    }
    async runAppleScript(script) {
        const { stdout } = await execFileAsync('osascript', ['-e', script]);
        return String(stdout);
    }
}
exports.default = ModuleInstance;
(0, base_1.runEntrypoint)(ModuleInstance, []);
//# sourceMappingURL=main.js.map