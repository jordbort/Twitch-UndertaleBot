// Bot and channel information
const BOT_USERNAME = process.env.BOT_USERNAME
const BOT_CHANNEL = `#${BOT_USERNAME}`
const DEV = process.env.DEV
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const ACTIVE_CHANNELS = process.env.ACTIVE_CHANNELS.split(`,`)

// Terminal colors
const resetTxt = `\x1b[0m`
const boldTxt = `\x1b[1m`
const underlined = `\x1b[4m`
const inverted = `\x1b[7m`

const blackTxt = `\x1b[30m`
const redTxt = `\x1b[31m`
const greenTxt = `\x1b[32m`
const yellowTxt = `\x1b[33m`
const blueTxt = `\x1b[34m`
const magentaTxt = `\x1b[35m`
const cyanTxt = `\x1b[36m`
const whiteTxt = `\x1b[37m`
const grayTxt = `\x1b[90m`
const orangeTxt = `\x1b[38;5;208m`

const blackBg = `\x1b[40m`
const redBg = `\x1b[41m`
const greenBg = `\x1b[42m`
const yellowBg = `\x1b[43m`
const blueBg = `\x1b[44m`
const magentaBg = `\x1b[45m`
const cyanBg = `\x1b[46m`
const whiteBg = `\x1b[47m`
const grayBg = `\x1b[100m`
const orangeBg = `\x1b[48;2;255;164;0m`

const settings = {
    // Helper functions log their params when invoked
    debug: false,

    // Time zone setting for logs
    timeZone: `America/New_York`,

    // Upon first connection to Twitch IRC
    firstConnection: true,

    // Change to false for portrait-oriented screens
    landscapeView: true,

    // The Dummy's respawn timer
    respawnTimer: null,
    msDelay: 300000
}

module.exports = {
    BOT_USERNAME,
    BOT_CHANNEL,
    DEV,
    OAUTH_TOKEN,
    ACTIVE_CHANNELS,
    resetTxt,
    boldTxt,
    underlined,
    inverted,
    blackTxt,
    redTxt,
    greenTxt,
    yellowTxt,
    blueTxt,
    magentaTxt,
    cyanTxt,
    whiteTxt,
    grayTxt,
    orangeTxt,
    blackBg,
    redBg,
    greenBg,
    yellowBg,
    blueBg,
    magentaBg,
    cyanBg,
    whiteBg,
    grayBg,
    orangeBg,
    settings
}
