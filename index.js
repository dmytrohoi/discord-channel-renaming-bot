const Discord = require("discord.js");
const config = require("./config.json");

// Logging
const loggerOptions = {
    prettyPrint: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: true
    }
}

const logger = require('pino')(loggerOptions);

// Create Discord client
const client = new Discord.Client();

// Utils
function mostFrequent(array) {
    let map = array.map((a) => array.filter((b) => a === b).length);
    let maxTimes = Math.max.apply(null, map);
    return {
        name: array[map.indexOf(maxTimes)],
        times: maxTimes
    };
}


// Processing
function getStatusByGameName(name) {
    if (name.includes("Modern Warfare")) {
        return "NP: Warzone";
    } else if (name.includes("Counter-Strike: Global Offensive")) {
        return "NP: CS:GO";
    } else {
        return null;
    }
};


function checkAndUpdateChannelName(channel) {
    if (!channel) return;

    const members = channel.members.array();
    const statuses = members.map(({presence}) => {
        const activity = presence.activities[0];
        return activity ? getStatusByGameName(activity.name) : null;
    }).filter(value => value);

    const defaultChannelName = `Room ${config.CHANNELS.indexOf(channel.id) + 1}`;
    let finalChannelName = defaultChannelName;
    if (statuses.length) {
        const mostFrGame = mostFrequent(statuses);
        finalChannelName = mostFrGame.name + ` (${mostFrGame.times} / ${members.length})`;
    };

    if (finalChannelName == channel.name) return logger.info("Don't need to change the channel name!");

    logger.info(`Expected final channel name is ${finalChannelName}`);
    if (finalChannelName != defaultChannelName) {
        client.user.setActivity(`Jersey Jam ${finalChannelName}!`);
    } else {
        client.user.setActivity('Jersey Jam is waiting to play!');
    }

    channel.setName(finalChannelName)
        .then(updated => logger.info(`Updated channel name to ${updated.name}`))
        .catch(logger.error);
};


// Handlers
client.on("voiceStateUpdate", (oldState, newState) => {
    const states = [oldState, newState];
    const ourChannels = states.filter(state => config.CHANNELS.includes(state.channelID || ""));

    if (!ourChannels.length) return;

    for (const {member, channel} of states) {
        if (!channel) continue;
        logger.info(`On voiceStateUpdate - ${member.user.username} (${member.id})`);
        checkAndUpdateChannelName(channel);
    };
});


client.on("presenceUpdate", (oldState, newState) => {
    const states = [oldState, newState];
    const ourChannels = states.filter(state => state && config.CHANNELS.includes(state.member.voice.channelID || ""));

    if (!ourChannels.length
        || !oldState.clientStatus.desktop 
	|| !newState.clientStatus.desktop                   // Only for desktop status changes
        || !['online', 'offline'].includes(oldState.status)    // Filter `idle` and `dnd` status
        || !(oldState.activities.length || newState.activities.length)
    ) return;
    
    for (const {member} of states) {
        if (!member) continue;
        logger.info(`On presenceUpdate of ${member.user.username} (${member.user.id})`);
        checkAndUpdateChannelName(member.voice.channel);
    };
});


client.on("ready", () => {
    logger.info('Bot started!');
    client.user.setActivity('Jersey Jam is waiting to play!');
});

// Start Bot
client.login(config.BOT_TOKEN);
