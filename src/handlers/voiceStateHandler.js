import { VoiceState } from 'discord.js';

import { logger } from '../utils.js';
import { getNewChannelName, setNewChannelName } from '../helpers/channelRenaming.js';
import { CHANNELS } from '../settings.js';


/**
 * Handle Voice State changes of the Voice Channel
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */
function voiceStateHandler(oldState, newState) {
    const states = [oldState, newState];
    const ourChannels = states.filter(state => CHANNELS.includes(state.channelID || ""));

    if (!ourChannels.length) return;

    for (const { member, channel } of ourChannels) {
        if (!channel) continue;
        logger.info(`On voiceStateUpdate - ${member.user.username} (${member.user.id})`);
        const channelName = getNewChannelName(channel);
        logger.info(`Expected final channel name is ${channelName}`);
        setNewChannelName(channel, channelName);
    };
}

export default voiceStateHandler;

