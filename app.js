#!/usr/bin node
const Discord = require('discord.js');

// Create Discord client
const client = new Discord.Client();

// Utils
const {logger} = require('./src/utils');

const {
    voiceStateHandler,
    presenceUpdateHandler
} = require('./src/handlers');


// Handlers
client.on("voiceStateUpdate", voiceStateHandler);

client.on("presenceUpdate", presenceUpdateHandler);

client.on("ready", () => {
    logger.info(`Bot started in ${process.env.NODE_ENV} mode!`);
    client.user.setActivity("I'm watching you!");
});

// Start Bot
client.login(process.env.BOT_TOKEN);
