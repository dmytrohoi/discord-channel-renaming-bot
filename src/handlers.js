const {VoiceState, Presence} = require('discord.js');

const {logger} = require('./utils');
const {getNewChannelName, setNewChannelName} = require('./processing');
const settings = require('../settings');


/**
 * Handle Voice State changes of the Voice Channel
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
function voiceStateHandler(oldState, newState) {
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
}


/**
 * Handle Presence (Activity) changes of Guild Members
 * @param {Presence} oldState
 * @param {Presence} newState
 */
function presenceUpdateHandler(oldState, newState) {
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
}


module.exports = {
    voiceStateHandler, presenceUpdateHandler
};
