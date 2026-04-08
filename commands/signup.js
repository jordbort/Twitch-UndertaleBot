const { BOT_USERNAME, BOT_CHANNEL, DEV, settings, resetTxt, boldTxt } = require(`../config`)

const { getUsername } = require(`./utils`)

module.exports = {
    handleJoin(props) {
        const { bot, channel, tags, user } = props
        const displayName = tags[`display-name`]
        if (settings.debug) { console.log(`${boldTxt}> handleJoin(channel: ${channel}, displayName: ${displayName},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // In bot's channel only
        if (channel !== BOT_CHANNEL) { return }

        const username = `#${user}`
        if (bot.channels.includes(username)) {
            bot.say(channel, `${displayName}, I should already be active in your channel! Use !part if you would like me to leave!`)
            return
        }

        bot.join(username)
        bot.say(channel, `${displayName}, I am now active in your Twitch channel! Use !part in this channel if you would like me to leave!`)
    },
    handlePart(props) {
        const { bot, channel, tags, user } = props
        const displayName = tags[`display-name`]
        if (settings.debug) { console.log(`${boldTxt}> handlePart(channel: ${channel}, display-name: ${displayName},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // In bot's channel only
        if (channel !== BOT_CHANNEL) { return }

        const username = `#${user}`
        if (!bot.channels.includes(username)) {
            bot.say(channel, `${displayName}, I am not active in your Twitch channel! Use !join if you would like to add me to it!`)
            return
        }

        bot.say(channel, `${displayName}, I have left your Twitch channel! Use !join in this channel if you would like me to come back!`)
        bot.part(username)
    },
    handleRecruit(props) {
        const { bot, channel, tags, args, user } = props
        if (settings.debug) { console.log(`${boldTxt}> handleRecruit(channel: ${channel}, display-name: ${tags[`display-name`]},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`}, args:`, args, `)${resetTxt}`) }

        // Dev use in bot's channel only
        if (channel !== BOT_CHANNEL || user !== DEV) { return }

        const validUsers = args.map(arg => getUsername(arg)).filter(username => username !== null)
        const alreadyJoined = validUsers.filter(username => bot.channels.includes(`#${username}`))
        const notYetJoined = validUsers.filter(username => !bot.channels.includes(`#${username}`))

        // Stagger multiple channel joins
        const delay = 600
        for (const [i, channel] of notYetJoined.entries()) {
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
        if (channel !== BOT_CHANNEL || user !== DEV) { return }

        // Bot's channel is not allowed to be parted
        const validUsers = args.map(arg => getUsername(arg)).filter(username => username !== null && username !== BOT_USERNAME)
        const needToPart = validUsers.filter(username => bot.channels.includes(`#${username}`))
        const notInChannel = validUsers.filter(username => !bot.channels.includes(`#${username}`))

        needToPart.forEach(username => bot.part(username))
        needToPart.length
            ? notInChannel.length
                ? bot.say(channel, `Parted from channel${needToPart.length === 1 ? `` : `s`}: ${needToPart.join(`, `)} - Not already in: ${notInChannel.join(`, `)}`)
                : bot.say(channel, `Parted from channel${needToPart.length === 1 ? `` : `s`}: ${needToPart.join(`, `)}`)
            : bot.say(channel, `All active users: ${bot.channels.map(channel => channel.substring(1)).join(`, `)}`)
    }
}
