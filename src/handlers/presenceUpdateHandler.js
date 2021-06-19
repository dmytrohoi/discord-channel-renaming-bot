import { Presence } from 'discord.js';

import { logger } from '../utils.js';
import { getNewChannelName, setNewChannelName } from '../helpers/channelRenaming.js';
import { CHANNELS } from '../settings.js';


/**
 * Handle Presence (Activity) changes of Guild Members
 * @param {Presence} oldState
 * @param {Presence} newState
 */
function presenceUpdateHandler(oldState, newState) {
    const states = [oldState, newState];
    const ourChannels = states.filter(state => state && CHANNELS.includes(state.member.voice.channelID || ""));

    if (!ourChannels.length
        || !oldState.clientStatus.desktop                   // Only for desktop status changes
        || !newState.clientStatus.desktop                   // same
        || !['online', 'offline'].includes(oldState.status)    // Filter `idle` and `dnd` status
        || !(oldState.activities.length || newState.activities.length)
    ) return;

    for (const { member } of ourChannels) {
        if (!member || !member.voice.channel) continue;
        logger.info(`On presenceUpdate of ${member.user.username} (${member.user.id})`);
        const channelName = getNewChannelName(member.voice.channel);
        logger.info(`Expected final channel name is ${channelName}`);
        setNewChannelName(member.voice.channel, channelName);
    };
}

export default presenceUpdateHandler;
