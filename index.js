const Discord = require("discord.js");
const config = require("./config.json");
const logger = require('pino')();

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

    const defaultChannelName = "CoD/CS:GO | Go!";
    let finalChannelName = defaultChannelName;
    if (statuses.length) {
        const mostFrGame = mostFrequent(statuses);
        finalChannelName = mostFrGame.name + ` (${mostFrGame.times} / ${members.length})`;
    };

    if (finalChannelName == channel.name) return logger.info("Don't need to change the channel name!");

    logger.info(`Expected final channel name is ${finalChannelName}`)
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
    const states = [oldState, newState].filter(state => config.CHANNELS.includes(state.channelID || ""));

    if (states.length == 1) {
        const state = states.pop()
        logger.info(`On voiceStateUpdate - ${state.member.user.username} (${state.member.id})`)
        checkAndUpdateChannelName(state.channel);
    }
});


client.on("presenceUpdate", (_, state) => {
    if (
        config.CHANNELS.includes(state.member.voice.channelID || "")   // Only in the desired channel
        || !state.clientStatus.desktop                      // Only for desktop status changes
        || !['online', 'offline'].includes(state.status)    // Filter `idle` and `dnd` status
    ) return;
    logger.info(`On presenceUpdate of ${state.member.user.username} (${state.userID})`)
    checkAndUpdateChannelName(state.member.voice.channel)
});


client.on("ready", () => {
    logger.info('Bot started!')
    client.user.setActivity('Jersey Jam is waiting to play!');
});

// Start Bot
client.login(config.BOT_TOKEN);