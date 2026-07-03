"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OUTPUT_SEPARATOR = void 0;
exports.toInteger = toInteger;
exports.parsePlayerState = parsePlayerState;
exports.secondsToFormatted = secondsToFormatted;
exports.OUTPUT_SEPARATOR = String.fromCharCode(31);
function toInteger(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 0) {
        return 0;
    }
    return parsed;
}
function parsePlayerState(state) {
    const normalized = state.trim().toLowerCase();
    if (normalized === 'playing' || normalized === 'paused' || normalized === 'stopped') {
        return normalized;
    }
    return 'stopped';
}
function secondsToFormatted(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
//# sourceMappingURL=helpers.js.map