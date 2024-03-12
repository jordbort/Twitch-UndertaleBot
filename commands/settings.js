const { BOT_DISPLAY_NAME, DEV, settings, resetTxt, boldTxt, yellowBg } = require(`../config`)
const { players, playerSave, highestLevels } = require(`../data`)
const { printLogo } = require(`./graphics`)

module.exports = {
    reviveDummy(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> reviveDummy(username: ${tags.username}, channel: ${channel})${resetTxt}`) }

        // Dev use only
        if (tags.username !== DEV) { return }

        clearTimeout(settings.respawnTimer)
        players.dummy.hp = 20
        players.dummy.dead = false
        bot.say(channel, `The Dummy has been revived!`)
    },
    playersReset(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> playersReset(username: ${tags.username}, channel: ${channel})${resetTxt}`) }

        // Dev use only
        if (tags.username !== DEV) { return }

        clearTimeout(settings.respawnTimer)
        for (const player in players) {
            players[player].lv = 1
            players[player].hp = 20
            players[player].dead = false
            players[player].timesKilled = 0
            players[player].at = 0
            players[player].df = 0
            players[player].exp = 0
            players[player].next = 10
            players[player].weapon = `Stick`
            players[player].armor = `Bandage`
            players[player].gold = 0
            players[player].stainedApronHealTime = false
            highestLevels[player] = 1
            if (player !== `dummy`) {
                players[player].inventory = [`Monster Candy`, `Butterscotch Pie`]
            }
        }
        const quote = `* When humans fall down here, strangely... I often feel like I already know them. Strange, is it not?`
        bot.say(channel, `/me ${quote}`)
        console.log(`${yellowBg}${channel} ${boldTxt}${BOT_DISPLAY_NAME}:${resetTxt}${yellowBg}${quote}${resetTxt}`)
    },
    playersTrueReset(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> playersReset(username: ${tags.username}, channel: ${channel})${resetTxt}`) }

        // Dev use only
        if (tags.username !== DEV) { return }

        clearTimeout(settings.respawnTimer)
        for (const player in players) {
            if (player !== `dummy`) {
                delete players[player]
                delete playerSave[player]
                delete highestLevels[player]
            } else {
                players[player].lv = 1
                players[player].hp = 20
                players[player].dead = false
                players[player].timesKilled = 0
                players[player].at = 0
                players[player].df = 0
                players[player].exp = 0
                players[player].next = 10
                players[player].weapon = `Stick`
                players[player].armor = `Bandage`
                players[player].gold = 0
                players[player].stainedApronHealTime = false
                players[player].inventory = []
                highestLevels[player] = 1
            }
        }
        const quote = `* If you DO end up erasing everything... You have to erase my memories, too.`
        bot.say(channel, `/me ${quote}`)
        console.log(`${yellowBg}${channel} ${boldTxt}${BOT_DISPLAY_NAME}:${resetTxt}${yellowBg}${quote}${resetTxt}`)
    },
    toggleDebugMode(props) {
        const { bot, channel, tags, args } = props
        if (settings.debug) { console.log(`${boldTxt}> toggleDebugMode(username: ${tags.username}, channel: ${channel}, args:`, args, `)${resetTxt}`) }

        // Dev use only
        if (tags.username !== DEV) { return }

        const initialDebugState = settings.debug
        if (args[0] === `on`) { settings.debug = true }
        else if (args[0] === `off`) { settings.debug = false }
        else { settings.debug = !settings.debug }

        settings.debug === initialDebugState
            ? bot.say(channel, `Debug mode is currently ${settings.debug ? `on` : `off`}!`)
            : bot.say(channel, `Debug mode is now ${settings.debug ? `on` : `off`}!`)
    },
    portraitMode(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> portraitMode(username: ${tags.username}, channel: ${channel})${resetTxt}`) }

        // Dev use only
        if (tags.username !== DEV) { return }

        settings.landscapeView = false
        printLogo()
        bot.say(channel, `Display is in portrait orientation mode`)
    },
    landscapeMode(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> landscapeMode(username: ${tags.username}, channel: ${channel})${resetTxt}`) }

        // Dev use only
        if (tags.username !== DEV) { return }

        settings.landscapeView = true
        printLogo()
        bot.say(channel, `Display is in landscape orientation mode`)
    }
}
