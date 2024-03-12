const tmi = require(`tmi.js`)

const { BOT_USERNAME, OAUTH_TOKEN, BOT_CHANNEL } = require(`./config`)

const { onChatHandler, onJoinedHandler, onPartedHandler, onWhisperHandler, onConnectedHandler } = require(`./handlers`)

const client = new tmi.client({
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [BOT_CHANNEL]
})

client.on(`connected`, onConnectedHandler)
client.on(`chat`, onChatHandler)
client.on(`join`, onJoinedHandler)
client.on(`part`, onPartedHandler)
client.on(`whisper`, onWhisperHandler)

module.exports = client
