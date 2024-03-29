const { settings, resetTxt, boldTxt } = require(`../config`)

module.exports = {
    getHelp(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> getHelp(bot: ${typeof bot}, channel: ${channel}`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }
        bot.say(channel, `${tags[`display-name`]}: This bot simulates playing Undertale! You can interact with others (try !commands to learn more), buy, use, and drop items, and check prices with !price. Use !players for a count of known users!`)
    },
    getCommands(props) {
        const { bot, channel } = props
        if (settings.debug) { console.log(`${boldTxt}> getCommands(bot: ${typeof bot}, channel: ${channel})${resetTxt}`) }
        bot.say(channel, `!FIGHT user -> Attack a user, !ACT -> With or without another user, !ITEM -> Check for (or use) items in your inventory, !MERCY user -> Attempt to spare a user. Manage your SAVE file with !save and !load. Use !join to add me to your channel!`)
    },
    getDocs(props) {
        const { bot, channel } = props
        if (settings.debug) { console.log(`${boldTxt}> getDocs(bot: ${typeof bot}, channel: ${channel})${resetTxt}`) }
        bot.say(channel, `Check out the docs here: https://github.com/jordbort/Twitch-UndertaleBot/blob/main/README.md`)
    }
}
