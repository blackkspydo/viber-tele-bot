const dotenv = require('dotenv');

dotenv.config();

const ENV_VARS = {
    viberToken: process.env.BOT_TOKEN,
    telegramToken: process.env.TELEGRAM_BOT_API,
    chatId: process.env.TELEGRAM_CHAT_ID
};

console.log('Environment variables', ENV_VARS);

module.exports = ENV_VARS;