import { VoiceChannel } from 'discord.js';
import { mostFrequent, logger } from '../utils.js';

import {
    gameShortcuts, useDefaultGameName, defaultChannelName,
    addDefaultChannelNameCounter, CHANNELS, channelNamePrefix,
    channelNameSuffix, addPlayersCounter
} from '../settings.js';


/**
 * Get Voice Channel members, process them activities
 * and create the new name for this Channel
 * @param {VoiceChannel} channel - The desired Voice Channel
 */
function getNewChannelName(channel) {
    const members = channel.members.array();
    const statuses = members.map((member) => {
        const activity = member.presence.activities[0];
        if (!activity || !activity.name) return null;

        return gameShortcuts[activity.name]
            || (useDefaultGameName ? activity.name : null);
    }).filter(v => Boolean(v));

    if (!statuses.length) {
        return defaultChannelName
            + (addDefaultChannelNameCounter
                ? `${CHANNELS.indexOf(channel.id) + 1}`
                : '');
    };

    const [currentGameName, currentPlayers] = mostFrequent(statuses);
    return channelNamePrefix
        + currentGameName
        + channelNameSuffix
        + (addPlayersCounter ? ` (${currentPlayers} / ${members.length})` : '');
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


export {
    getNewChannelName,
    setNewChannelName
}
