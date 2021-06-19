#!/usr/bin node
import Discord from 'discord.js';

// Utils
import { logger } from './utils.js';

import voiceStateHandler from './handlers/voiceStateHandler.js';
import presenceUpdateHandler from './handlers/presenceUpdateHandler.js';


// Create Discord client
const client = new Discord.Client();

// Handlers
client.on("voiceStateUpdate", voiceStateHandler);

client.on("presenceUpdate", presenceUpdateHandler);

client.on("ready", () => {
    logger.info(`Bot started in ${process.env.NODE_ENV} mode!`);
    client.user.setActivity("I'm watching you!");
});

// Start Bot
client.login(process.env.BOT_TOKEN);
