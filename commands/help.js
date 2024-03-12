const { settings, resetTxt, boldTxt } = require(`../config`)

module.exports = {
    getHelp(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> getHelp(bot: ${typeof bot}, channel: ${channel}`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }
        bot.say(channel, `${tags[`display-name`]}: This bot simulates playing Undertale! You can interact with others (try !commands to learn more), and check the stats of yourself or other users with !stats, !hp, !exp, !gold, etc. You can also view all known players by using !memory.`)
    },
    getCommands(props) {
        const { bot, channel } = props
        if (settings.debug) { console.log(`${boldTxt}> getCommands(bot: ${typeof bot}, channel: ${channel})${resetTxt}`) }
        bot.say(channel, `!FIGHT user -> Attack a user, !ACT -> With or without another user, !ITEM -> Check for (or use) items in your inventory, !MERCY user -> Attempt to spare a user. Use !buy and/or !price to spend gold. Manage your SAVE file with !save and !load. Try !docs to read more!`)
    },
    getDocs(props) {
        const { bot, channel } = props
        if (settings.debug) { console.log(`${boldTxt}> getDocs(bot: ${typeof bot}, channel: ${channel})${resetTxt}`) }
        bot.say(channel, `Check out the docs here: https://github.com/jordbort/Twitch-UndertaleBot/blob/main/README.md`)
    }
}
