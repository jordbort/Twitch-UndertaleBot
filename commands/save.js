const { players, playerSave, weaponsATK, armorDEF } = require(`../data`)
const { settings, resetTxt, boldTxt } = require(`../config`)
const { getUserMaxHP } = require(`./utils`)
const { showStats } = require(`./stats`)

module.exports = {
    handleSave(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> handleSave(From: ${tags[`display-name`]}, channel: ${channel},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        const user = tags.username
        const player = players[user]
        if (player.dead) { return bot.say(channel, `Sorry ${player.displayName}, you are dead!`) }

        playerSave[user] = { ...players[user] }
        playerSave[user].inventory = [...players[user].inventory]
        showStats(user)

        const displayName = player.displayName
        const capsName = displayName.substring(0, 1).toUpperCase() + displayName.substring(1)
        const saveText = [
            `The shadow of the ruins looms above, filling ${displayName} with determination.`,
            `Playfully crinkling through the leaves fills ${displayName} with determination.`,
            `Knowing the mouse might one day leave its hole and get the cheese... It fills ${displayName} with determination.`,
            `Seeing such a cute, tidy house in the RUINS gives ${displayName} determination.`,
            `The cold atmosphere of a new land... it fills ${displayName} with determination.`,
            `The convenience of that lamp still fills ${displayName} with determination.`,
            `Knowing the mouse might one day find a way to heat up the spaghetti... It fills ${displayName} with determination.`,
            `Snow can always be broken down and rebuilt into something more useful. This simple fact fills ${displayName} with determination.`,
            `Knowing that dog will never give up trying to make the perfect snowdog... It fills ${displayName} with determination.`,
            `The sight of such a friendly town fills ${displayName} with determination.`,
            `The sound of rushing water fills ${displayName} with determination.`,
            `A feeling of dread hangs over ${displayName}... But ${displayName} stays determined.`,
            `Knowing the mouse might one day extract the cheese from the mystical crystal... It fills ${displayName} with determination.`,
            `The serene sound of a distant music box... It fills ${displayName} with determination.`,
            `The sound of muffled rain on the cavetop... It fills ${displayName} with determination.`,
            `The waterfall here seems to flow from the ceiling of the cavern... Occasionally, a piece of trash will flow through... and fall into the bottomless abyss below. Viewing this endless cycle of worthless garbage... It fills ${displayName} with determination.`,
            `Partaking in useless garbage fills ${displayName} with determination.`,
            `${capsName} feels a calming tranquility. ${capsName} is filled with determination.`,
            `${capsName} feels... something. ${capsName} is filled with detemmienation.`,
            `The wind is howling. ${capsName} is filled with determination.`,
            `The wind has stopped. ${capsName} is filled with determination.`,
            `The howling wind is now a breeze. This gives ${displayName} determination.`,
            `Seeing such a strange laboratory in a place like this... ${capsName} is filled with determination.`,
            `The wooshing sound of steam and cogs... it fills ${displayName} with determination.`,
            `An ominous structure looms in the distance... ${capsName} is filled with determination.`,
            `Knowing the mouse might one day hack into the computerized safe and get the cheese... It fills ${displayName} with determination.`,
            `The smell of cobwebs fills the air... ${capsName} is filled with determination.`,
            `The relaxing atmosphere of this hotel... it fills ${displayName} with determination.`,
            `The air is filled with the smell of ozone... it fills ${displayName} with determination.`,
            `Behind this door must be the elevator to the King's castle. ${capsName} is filled with determination.`
        ]

        const randSaveText = saveText[Math.floor(Math.random() * saveText.length)]
        bot.say(channel, `* ${randSaveText}`)
    },
    handleLoad(props) {
        const { bot, channel, tags } = props
        if (settings.debug) { console.log(`${boldTxt}> handleLoad(From: ${tags[`display-name`]}, channel: ${channel},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        const user = tags.username
        players[user] = { ...playerSave[user] }
        players[user].inventory = [...playerSave[user].inventory]
        showStats(user)

        const player = players[user]
        const attackBonus = player.armor === `Cowboy Hat` ? 5 : player.armor === `Temmie Armor` ? 10 : 0
        const response = `Reloading: "${player.displayName}" LV: ${player.lv}, HP: ${player.hp}/${getUserMaxHP(user)}, AT: ${player.at}(${weaponsATK[player.weapon] + attackBonus}), DF: ${player.df}(${armorDEF[player.armor]}), EXP: ${player.exp}, NEXT: ${player.next}, WEAPON: ${player.weapon}, ARMOR: ${player.armor}, GOLD: ${player.gold}`
        bot.say(channel, response)
    }
}
