const { BOT_DISPLAY_NAME, BOT_CHANNEL, settings, timeOptions, startTime, resetTxt, boldTxt, inverted, redTxt, greenTxt, yellowTxt, yellowBg } = require(`./config`)
const { players } = require(`./data`)

const { initUser, getToUser } = require(`./commands/utils`)
const { printLogo } = require(`./commands/graphics`)
const commands = require(`./commands`)

module.exports = {
    onConnectedHandler(addr, port) {
        if (settings.firstConnection) {
            printLogo()
            console.log(`* Connected to ${addr}:${port} at ${startTime}`)
        } else {
            console.log(`* Reconnected to ${addr}:${port} at ${new Date().toLocaleTimeString(settings.locale, timeOptions)}`)
            this.say(BOT_CHANNEL, `Reconnected!`)
        }
        settings.firstConnection = false
    },
    onJoinedHandler(channel, username, self) {
        if (self) {
            console.log(`* ${BOT_DISPLAY_NAME} joined ${channel}`)
            this.say(channel, `* ${BOT_DISPLAY_NAME} blocks the way!`)
        }
    },
    onPartedHandler(channel, username, self) {
        if (self) { console.log(`* ${BOT_DISPLAY_NAME} parted from ${channel}`) }
        else if (settings.debug) { console.log(`${username} parted from ${channel}`) }
    },
    onWhisperHandler(fromRoom, tags, message, err) {
        if (err) {
            console.log(err)
            return
        }
        // this.say(BOT_CHANNEL, `Whisper received`)
        // No plans to respond to whispers?
    },
    onChatHandler(channel, tags, message, self) {
        // Message context
        const user = tags.username
        if (!user) { return }
        const firstMsg = tags[`first-msg`]

        // Command and arguments parser
        const msg = message.replace(/ +/g, ` `).toLowerCase()
        const args = msg.split(` `)
        const cmd = args.shift()

        // First-time message
        if (channel === BOT_CHANNEL && firstMsg) { printLogo() }

        // Add/manage players (props are needed for getIntroText)
        if (!(user in players) && !self) {
            initUser({ bot: this, channel: channel, tags: tags, message: msg, args: args })
        }

        if (self) {
            console.log(`${yellowBg}${channel} ${resetTxt}`, `${boldTxt}${yellowTxt}${BOT_DISPLAY_NAME}:${resetTxt}`, `${yellowTxt}${message}${resetTxt}`)
            return
        }
        if (!msg.startsWith(`!`)) { return }

        if (cmd in commands) {
            if (settings.debug) { console.log(`> Matched command:`, cmd, commands[cmd]) }
            const player = players[user]
            const toUser = getToUser(args[0])
            const target = toUser in players ? players[toUser] : toUser === `dummy` ? players.dum : null
            const lastStanding = Object.keys(players).filter((player) => { return !players[player].dead }).length === 1

            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${player.dead ? redTxt : greenTxt}${player.displayName}:${resetTxt}`, msg)
            commands[cmd]({
                bot: this,
                channel: channel,
                tags: tags,
                message: msg,
                args: args,
                user: user,
                player: player,
                toUser: toUser,
                target: target,
                lastStanding: lastStanding
            })
            return
        }
        if (settings.debug) { console.log(`${boldTxt}> COMMAND NOT RECOGNIZED${resetTxt}`) }
    }
}
