const {VoiceChannel} = require('discord.js');
const {mostFrequent, logger} = require('./utils');

const settings = require('../settings');


/**
 * Get Voice Channel members, process them activities
 * and create the new name for this Channel
 * @param {VoiceChannel} channel - The desired Voice Channel
 */
function getNewChannelName(channel) {
    const members = channel.members.array();
    const statuses = members.reduce((acc, member) => {
        const activity = member.presence.activities[0];
        if (!activity) return acc;
        const gameName = settings.gameShortcuts[activity.name || ""]
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


/**
 * Set new name of the Voice Channel
 * @param {VoiceChannel} channel - The desired Voice Channel
 * @param {string} newName - New name for the desired channel
 */
function setNewChannelName(channel, newName) {
    if (newName == channel.name) return logger.info("Don't need to change the channel name!");

    channel.setName(newName)
        .then(updated => logger.info(`Channel name has been updated: ${updated.name}`))
        .catch(logger.error);
}


module.exports = {
    getNewChannelName, setNewChannelName
}