const { BOT_USERNAME, BOT_CHANNEL, DEV, KNOWN_CHANNELS, settings, resetTxt, boldTxt } = require(`../config`)
const { getUsername } = require(`./utils`)

module.exports = {
    handleJoin(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> handleJoin(channel: ${channel}, display-name: ${tags[`display-name`]},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // In bot's channel only
        if (channel !== BOT_CHANNEL) { return }

        const user = `#${tags.username}`
        if (bot.channels.includes(user)) { return bot.say(channel, `${tags[`display-name`]}, I should already be active in your channel! Use !part if you would like me to leave!`) }
        bot.join(user)
        bot.say(channel, `${tags[`display-name`]}, I am now active in your Twitch channel! Use !part in this channel if you would like me to leave!`)
    },
    handlePart(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> handlePart(channel: ${channel}, display-name: ${tags[`display-name`]},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // In bot's channel only
        if (channel !== BOT_CHANNEL) { return }

        const user = `#${tags.username}`
        if (!bot.channels.includes(user)) { return bot.say(channel, `${tags[`display-name`]}, I am not active in your Twitch channel! Use !join if you would like to add me to it!`) }
        bot.say(channel, `${tags[`display-name`]}, I have left your Twitch channel! Use !join in this channel if you would like me to come back!`)
        bot.part(user)
    },
    handleRecruit(props) {
        const { bot, channel, tags, args } = props
        if (settings.debug) { console.log(`${boldTxt}> handleRecruit(channel: ${channel}, display-name: ${tags[`display-name`]},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`}, args:`, args, `)${resetTxt}`) }

        // Dev use in bot's channel only
        if (channel !== BOT_CHANNEL || tags.username !== DEV) { return }

        const validUsers = args.map(arg => getUsername(arg)).filter(user => user !== null)
        const alreadyJoined = validUsers.filter(user => bot.channels.includes(`#${user}`))
        const notYetJoined = validUsers.filter(user => !bot.channels.includes(`#${user}`))

        // Stagger multiple channel joins
        for (const [i, channel] of notYetJoined.entries()) {
            const delay = 600
            setTimeout(() => bot.join(channel), delay * i)
        }

        notYetJoined.length
            ? alreadyJoined.length
                ? bot.say(channel, `Joined channel${notYetJoined.length === 1 ? `` : `s`}: ${notYetJoined.join(`, `)} - Already joined: ${alreadyJoined.join(`, `)}`)
                : bot.say(channel, `Joined channel${notYetJoined.length === 1 ? `` : `s`}: ${notYetJoined.join(`, `)}`)
            : bot.say(channel, `All active users: ${bot.channels.map(channel => channel.substring(1)).join(`, `)}`)
    },
    handleUnrecruit(props) {
        const { bot, channel, tags, args } = props
        if (settings.debug) { console.log(`${boldTxt}> handleUnrecruit(channel: ${channel}, display-name: ${tags[`display-name`]},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`}, args:`, args, `)${resetTxt}`) }

        // Dev use in bot's channel only
        if (channel !== BOT_CHANNEL || tags.username !== DEV) { return }

        // Bot's channel is not allowed to be parted
        const validUsers = args.map(arg => getUsername(arg)).filter(user => user !== null && user !== BOT_USERNAME)
        const needToPart = validUsers.filter(user => bot.channels.includes(`#${user}`))
        const notInChannel = validUsers.filter(user => !bot.channels.includes(`#${user}`))

        needToPart.forEach(user => bot.part(user))
        needToPart.length
            ? notInChannel.length
                ? bot.say(channel, `Parted from channel${needToPart.length === 1 ? `` : `s`}: ${needToPart.join(`, `)} - Not already in: ${notInChannel.join(`, `)}`)
                : bot.say(channel, `Parted from channel${needToPart.length === 1 ? `` : `s`}: ${needToPart.join(`, `)}`)
            : bot.say(channel, `All active users: ${bot.channels.map(channel => channel.substring(1)).join(`, `)}`)
    },
    handleKnownJoin(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> handleKnownJoin(channel: ${channel}, display-name: ${tags[`display-name`]},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // Dev use in bot's channel only
        if (channel !== BOT_CHANNEL || tags.username !== DEV) { return }

        const alreadyJoined = KNOWN_CHANNELS.filter(user => bot.channels.includes(`#${user}`))
        const notYetJoined = KNOWN_CHANNELS.filter(user => !bot.channels.includes(`#${user}`))

        // Stagger multiple channel joins
        for (const [i, channel] of notYetJoined.entries()) {
            const delay = 2000
            setTimeout(() => bot.join(channel), delay * i)
        }

        notYetJoined.length
            ? alreadyJoined.length
                ? bot.say(channel, `Joined channel${notYetJoined.length === 1 ? `` : `s`}: ${notYetJoined.join(`, `)} - Already joined: ${alreadyJoined.join(`, `)}`)
                : bot.say(channel, `Joined channel${notYetJoined.length === 1 ? `` : `s`}: ${notYetJoined.join(`, `)}`)
            : bot.say(channel, `All active users: ${bot.channels.map(channel => channel.substring(1)).join(`, `)}`)
    }
}
