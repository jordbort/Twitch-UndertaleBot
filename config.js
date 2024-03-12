// Bot and channel information
const BOT_DISPLAY_NAME = process.env.BOT_DISPLAY_NAME
const BOT_USERNAME = BOT_DISPLAY_NAME.toLowerCase()
const BOT_CHANNEL = `#${BOT_USERNAME}`
const DEV = process.env.DEV
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const KNOWN_CHANNELS = process.env.KNOWN_CHANNELS.split(`,`)

const settings = {
    // Helper functions log their params when invoked
    debug: false,

    // Time zone setting for logs
    timeZone: `America/New_York`,
    locale: `en-US`,

    // Upon first connection to Twitch IRC
    firstConnection: true,

    // Change to false for portrait-oriented screens
    landscapeView: true,

    // The Dummy's respawn timer
    respawnTimer: null,
    msDelay: 300000
}

const dateOptions = {
    weekday: `long`,
    month: `long`,
    day: `numeric`,
    year: `numeric`,
    timeZone: settings.timeZone
}

const timeOptions = {
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
    timeZone: settings.timeZone,
    timeZoneName: `short`
}

const start = new Date()

module.exports = {
    BOT_DISPLAY_NAME,
    BOT_USERNAME,
    BOT_CHANNEL,
    DEV,
    OAUTH_TOKEN,
    KNOWN_CHANNELS,

    settings,
    dateOptions,
    timeOptions,
    startDate: start.toLocaleDateString(settings.locale, dateOptions),
    startTime: start.toLocaleTimeString(settings.locale, timeOptions),

    // ANSI colors
    resetTxt: `\x1b[0m`,
    boldTxt: `\x1b[1m`,
    underlined: `\x1b[4m`,
    inverted: `\x1b[7m`,

    blackTxt: `\x1b[30m`,
    redTxt: `\x1b[31m`,
    greenTxt: `\x1b[32m`,
    yellowTxt: `\x1b[33m`,
    blueTxt: `\x1b[34m`,
    magentaTxt: `\x1b[35m`,
    cyanTxt: `\x1b[36m`,
    whiteTxt: `\x1b[37m`,
    grayTxt: `\x1b[90m`,
    orangeTxt: `\x1b[38;5;208m`,

    blackBg: `\x1b[40m`,
    redBg: `\x1b[41m`,
    greenBg: `\x1b[42m`,
    yellowBg: `\x1b[43m`,
    blueBg: `\x1b[44m`,
    magentaBg: `\x1b[45m`,
    cyanBg: `\x1b[46m`,
    whiteBg: `\x1b[47m`,
    grayBg: `\x1b[100m`,
    orangeBg: `\x1b[48;2;255;164;0m`
}
