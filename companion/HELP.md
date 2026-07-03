# Apple Music Companion Module

Control the macOS Music app from Bitfocus Companion.

## Platform Support

This module is macOS-only and uses AppleScript through osascript.

If loaded on Windows or Linux, the instance status is set to Bad Config with a clear message.

## Requirements

1. macOS with the Music app installed.
2. Bitfocus Companion running on the same Mac.
3. macOS Automation permission granted to Companion/Node for controlling Music.

## Setup

1. Add the Apple Music connection in Companion.
2. Set Poll Interval (ms) as needed (default 1500, range 500 to 5000).
3. Press any transport action once so macOS shows permission prompts, then allow control.

## Actions

1. Play
2. Pause
3. Toggle Play/Pause
4. Stop
5. Next Track
6. Previous Track

Each action sends an AppleScript command to the Music app and immediately refreshes module state.

## Variables

1. track_name
2. artist
3. album
4. elapsed_seconds
5. total_seconds
6. remaining_seconds
7. elapsed_formatted
8. total_formatted
9. remaining_formatted
10. player_state
11. is_playing

Formatted time variables are returned as mm:ss.

## Feedbacks

1. is_playing (boolean): Useful for green-on-play button styling.
2. is_paused (boolean): True when player state is paused.
3. player_state_matches (boolean): Select playing, paused, or stopped in feedback options.

## Presets Included

1. Play/Pause Toggle with is_playing feedback.
2. Next Track transport button.
3. Previous Track transport button.
4. Track Info button with current track and artist.
5. Elapsed Time button.
6. Remaining Time button.

## Polling Behavior

The module polls Music on an interval and requests the current track name, artist, album, duration, player position, and player state in one AppleScript query.

After each poll, variable values are updated and feedbacks are recalculated.

## Troubleshooting

1. If buttons do nothing, verify macOS Automation permission for Companion and Node.
2. If state stays stopped, confirm Music is open and has a track loaded.
3. If status shows connection failure, check that osascript is available and Music responds to AppleScript.
