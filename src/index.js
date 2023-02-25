const express = require('express');
const ENV_VARS = require('./config');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const UrlMessage = require('viber-bot').Message.Url;
const ContactMessage = require('viber-bot').Message.Contact;
const FileMessage = require('viber-bot').Message.File;
const LocationMessage = require('viber-bot').Message.Location;
const PictureMessage = require('viber-bot').Message.Picture;
const VideoMessage = require('viber-bot').Message.Video;
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const VIBER_BOT = new ViberBot({
    authToken: ENV_VARS.viberToken,
    name: "EchoBot",
    avatar: "http://viber.com/avatar.jpg" // It is recommended to be 720x720, and no more than 100kb.
});

const TELEGRAM_BOT = new TelegramBot(ENV_VARS.telegramToken, { polling: true });


const app = express();


//========================================================
//=================VIBER BOT==============================
//========================================================

VIBER_BOT.onSubscribe(response => {
    response.send(new TextMessage("Thanks for subscribing!"));
});

VIBER_BOT.setWebhook("https://1d4f-2400-1a00-b010-306f-1d3e-9028-a00f-463f.in.ngrok.io/webhook").catch(error => {
    console.log('Can not set webhook on following server. Is it running?');
    console.error(error);
    process.exit(1);
});
//create a route for webhook
app.use("/webhook", VIBER_BOT.middleware());

app.post("/webhook", (req, res) => {
    res.send('ok');
});

VIBER_BOT.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => {
    console.log('Conversation started with user profile', userProfile);
    onFinish(new TextMessage('Conversation started'));
});



VIBER_BOT.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    console.log('Message received: ' + JSON.stringify(message) + message.type);
    switch (true) {
        case Boolean(message.filename):
            const buffer = await axios.get(message.url, { responseType: 'arraybuffer' });
            TELEGRAM_BOT.sendDocument("@texas_viber", buffer.data, {}, { filename: message.filename });
            break;
        case Boolean(message.thumbnail):
            TELEGRAM_BOT.sendPhoto("@texas_viber", message.url);
            break;
        default:
            TELEGRAM_BOT.sendMessage("@texas_viber", message.text);
        // TELEGRAM_BOT.sendMessage

    }
});

//========================================================
//=================TELEGRAM BOT===========================
//========================================================

TELEGRAM_BOT.on('message', async (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
    TELEGRAM_BOT.sendMessage(chatId, 'Received your message');
});

TELEGRAM_BOT.getUpdates().then((updates) => {
    console.log(updates);
});

TELEGRAM_BOT.getChat(ENV_VARS.chatId).then((chat) => {
    console.log(chat);
});



app.listen(8080);
