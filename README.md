# Tambut Desktop Pet

An improved version of the Desktop Goose, built with Electron for cross-platform compatibility.

## Features

- Transparent overlay window that stays on top
- Random movement with direction changes
- Periodic honking (console log for now)
- Leaves temporary footprints
- Customizable via config.json
- Placeholder for memes and mouse interactions

## Setup

1. Install Node.js and npm.
2. Run `npm install` to install Electron.
3. Run `npm start` to launch the app.

## Customization

Edit `config.json` to change speed, honk frequency, etc.

Add images to `assets/` for sprites, sounds to `assets/` for honks, memes to `memes/` folder.

## Note

This is a basic implementation. For full features like mouse dragging, install `robotjs` and add IPC communication.
