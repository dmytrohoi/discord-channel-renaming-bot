#!/usr/bin node
const settings = require('./settings');
const logger = require('pino')(settings.loggerOptions);

const Discord = require('discord.js');

// Create Discord client
const client = new Discord.Client();

// Utils
function mostFrequent(array) {
    const map = array.map((a) => array.filter((b) => a === b).length);
    const maxTimes = Math.max.apply(null, map);
    return [array[map.indexOf(maxTimes)], maxTimes];
}


// Processing
function getNewChannelName(channel) {
    const members = channel.members.array();
    const statuses = members.reduce((acc, member) => {
        const activity = member.presence.activities[0];
        if (!activity) return acc;
        const gameName = settings.channelNameByGame[activity.name || ""]
            || (settings.useDefaultGameName ? activity.name : null);
        if (gameName) acc.push(gameName);
        return acc;
    }, []);

    if (!statuses.length) {
        return settings.defaultChannelName
        + (settings.addDefaultChannelNameCounter
           ? `${settings.CHANNELS.indexOf(channel.id) + 1}`
           : '');
    };

    const [currentGameName, currentPlayers] = mostFrequent(statuses);
    return settings.channelNamePrefix
        + currentGameName
        + settings.channelNameSuffix
        + (settings.addPlayersCounter ? ` (${currentPlayers} / ${members.length})` : '');
};


function setNewChannelName(channel, newName) {
    if (newName == channel.name) return logger.info("Don't need to change the channel name!");

    channel.setName(newName)
        .then(updated => logger.info(`Channel name has been updated: ${updated.name}`))
        .catch(logger.error);
}


// Handlers
client.on("voiceStateUpdate", (oldState, newState) => {
    const states = [oldState, newState];
    const ourChannels = states.filter(state => settings.CHANNELS.includes(state.channelID || ""));

    if (!ourChannels.length) return;

    for (const {member, channel} of states) {
        if (!channel) continue;
        logger.info(`On voiceStateUpdate - ${member.user.username} (${member.id})`);
        const channelName = getNewChannelName(channel);
        logger.info(`Expected final channel name is ${channelName}`);
        setNewChannelName(channel, channelName);
    };
});


client.on("presenceUpdate", (oldState, newState) => {
    const states = [oldState, newState];
    const ourChannels = states.filter(state => state && settings.CHANNELS.includes(state.member.voice.channelID || ""));

    if (!ourChannels.length
        || !oldState.clientStatus.desktop                   // Only for desktop status changes
        || !newState.clientStatus.desktop                   // same
        || !['online', 'offline'].includes(oldState.status)    // Filter `idle` and `dnd` status
        || !(oldState.activities.length || newState.activities.length)
    ) return;

    for (const {member} of states) {
        if (!member || !member.voice.channel) continue;
        logger.info(`On presenceUpdate of ${member.user.username} (${member.user.id})`);
        const channelName = getNewChannelName(member.voice.channel);
        logger.info(`Expected final channel name is ${channelName}`);
        setNewChannelName(member.voice.channel, channelName);
    };
});


client.on("ready", () => {
    logger.info('Bot started!');
    client.user.setActivity("I'm watching you!");
});

// Start Bot
client.login(settings.BOT_TOKEN);
