// Logging options
module.exports = {
    loggerOptions: {
        prettyPrint: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: true
        }
    },
    BOT_TOKEN: process.env.BOT_TOKEN,
    /// `useDefaultGameName` option:
    // true - use `channelNameByGame` as shortcuts and any game name for channel name
    // false - ignore any other games and only use the described in `channelNameByGame`
    useDefaultGameName: false,
    // Games shortcuts OR selected games
    channelNameByGame: {
        "Call of Duty®: Modern Warfare®": "Warzone",
        "Counter-Strike: Global Offensive": "CS:GO"
    },
    /// Usage: `${channelNamePrefix} ${gameName} ${channelNameSuffix}`
    channelNamePrefix: "NP: ",
    channelNameSuffix: "",
    // Adds a game user counter to the end of the channel name
    addPlayersCounter: true,
    // Default channel name when no one players in the game
    defaultChannelName: "Room #",
    // Adds channel counter due to `CHANNELS` constant
    addDefaultChannelNameCounter: true,
    // Channels to use this bot
    CHANNELS: ["780166534021906462", "800087476164755456"],
};
