const { BOT_DISPLAY_NAME, BOT_CHANNEL, settings, timeOptions, startTime, resetTxt, boldTxt, inverted, redTxt, greenTxt, yellowTxt, yellowBg } = require(`./config`)
const { printLogo } = require(`./commands/graphics`)
const { makeLogs } = require(`./commands/logs`)
const { initUser } = require(`./commands/utils`)
const { players } = require(`./data`)
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
        if (err) { return console.log(err) }
        // this.say(BOT_CHANNEL, `Whisper received`)
        // No plans to respond to whispers?
    },
    onChatHandler(channel, tags, message, self) {
        // Message context
        const username = tags.username
        const firstMsg = tags[`first-msg`]

        // Command and arguments parser
        const msg = message.replace(/ +/g, ` `).toLowerCase()
        const args = msg.split(` `)
        const cmd = args.shift()

        // First-time message
        if (channel === BOT_CHANNEL && firstMsg) { printLogo() }

        // Add/manage players (props are needed for getIntroText)
        if (!(username in players) && !self) {
            initUser({ bot: this, channel: channel, tags: tags, message: msg, args: args })
        }

        // Update logs, log bot message, ignore user non-command attempt
        makeLogs(this.channels)

        if (self) { return console.log(`${yellowBg}${channel} ${resetTxt}`, `${boldTxt}${yellowTxt}${BOT_DISPLAY_NAME}:${resetTxt}`, `${yellowTxt}${message}${resetTxt}`) }
        if (!msg.startsWith(`!`)) { return }

        for (const command in commands) {
            if (cmd === command) {
                if (settings.debug) { console.log(`> Matched command:`, cmd, commands[command]) }
                const player = players[username]
                console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${player.dead ? redTxt : greenTxt}${player.displayName}:${resetTxt}`, msg)
                return commands[command]({ bot: this, channel: channel, tags: tags, message: msg, args: args })
            }
        }
        if (settings.debug) { console.log(`${boldTxt}> COMMAND NOT RECOGNIZED${resetTxt}`) }
    }
}
