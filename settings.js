// Load .env file to process.env
require('dotenv-flow').config();

// Logging options
const loggerOptions = {
    prettyPrint: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: true
    }
};

// === === === === === SETTINGS === === === === ===
// Channels to use this bot
const CHANNELS = [];
/// Add channels from environment variable
CHANNELS.push(...(process.env.CHANNELS || String()).split(',').filter(v => v))

/// `useDefaultGameName` option:
// true - use `gameShortcuts` as shortcuts and any game name for channel name
// false - ignore any other games and only use the described in `gameShortcuts`
const useDefaultGameName = false;

// Games shortcuts OR selected games
const gameShortcuts = {
    "Call of Duty®: Modern Warfare®": "Warzone",
    "Counter-Strike: Global Offensive": "CS:GO"
};

// Usage: `${channelNamePrefix} ${gameName} ${channelNameSuffix}`
const channelNamePrefix = "NP: ";
const channelNameSuffix = "";

// Adds a game user counter to the end of the channel name
const addPlayersCounter = true;

// Default channel name when no one players in the game
const defaultChannelName = "Room #";

// Adds channel counter due to `CHANNELS` constant
const addDefaultChannelNameCounter = true;
// === === === === === === === === === === === ===

module.exports = {
    loggerOptions, useDefaultGameName, gameShortcuts,
    channelNamePrefix, channelNameSuffix, addPlayersCounter,
    defaultChannelName, addDefaultChannelNameCounter, CHANNELS
};
