require(`dotenv`).config()
const tmi = require('tmi.js')
const BOT_USERNAME = process.env.BOT_USERNAME
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const CHANNEL_1 = process.env.CHANNEL_1
const CHANNEL_2 = process.env.CHANNEL_2

// Define configuration options
const opts = {
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [
        CHANNEL_1,
        CHANNEL_2
    ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return } // Ignore messages from the bot
    const sender = context["display-name"]

    console.log(`${target}: ${msg}`)

    // Remove whitespace from chat message
    // const commandName = msg.trim()
    // console.log(`msg: ${msg}`)
    // console.log(`commandName: ${commandName}`)

    // console.log(`badge-info: ${context["badge-info"]}`) // object
    // console.log(`badges: ${context["badges"]}`) // object
    // console.log(`bits: ${context["bits"]}`) // undefined, unless it's a cheer message
    // console.log(`color: ${context["color"]}`) // username color in #hexcode
    // console.log(`display-name: ${context["display-name"]}`) // includes caps
    // console.log(`emotes: ${context["emotes"]}`) // null?
    // console.log(`id: ${context["id"]}`) // user's unique message ID (whoa)
    // console.log(`mod: ${context["mod"]}`) // Boolean - is the sender a mod in this channel?
    // console.log(`reply-parent-msg-id: ${context["reply-parent-msg-id"]}`) // reply-to-message's unique ID (whoa)
    // console.log(`reply-parent-user-id: ${context["reply-parent-user-id"]}`) // reply-to-user's user ID (whoa)
    // console.log(`reply-parent-user-login: ${context["reply-parent-user-login"]}`) // reply-to-user's username (lowercase?)
    // console.log(`reply-parent-display-name: ${context["reply-parent-display-name"]}`) // reply-to-user's username (includes caps?)
    // console.log(`reply-parent-msg-body: ${context["reply-parent-msg-body"]}`) // reply-to-message's body text (interesting)
    // console.log(`room-id: ${context["room-id"]}`) // the channel in number form
    // console.log(`subscriber: ${context["subscriber"]}`) // Boolean - is the sender subbed to this channel?
    // console.log(`tmi-sent-ts: ${context["tmi-sent-ts"]}`) // UNIX timestamp
    // console.log(`turbo: ${context["turbo"]}`) // Boolean - does the sender have Twitch Turbo? (site-wide commercial-free mode)
    // console.log(`user-id: ${context["user-id"]}`) // sender's user ID (whoa)
    // console.log(`user-type: ${context["user-type"]}`) // options: null (regular user), "admin" (Twitch admin), "global_mod" (Twitch global moderator), "staff" (a Twitch employee)
    // console.log(`vip: ${context["vip"]}`) // 

    // Reply cases
    if (msg.toLowerCase().includes('hello bot')
        || msg.toLowerCase().includes('hey bot')
        || msg.toLowerCase().includes('hi bot')) {
        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const reply = `${greeting}, ${sender}! :)`
        client.say(target, reply)
        console.log(`> Bot replied: ${reply}`)
    }
}

// Helper functions

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
}