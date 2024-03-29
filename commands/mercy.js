const { BOT_USERNAME, settings, resetTxt, boldTxt, cyanBg } = require(`../config`)
const { players } = require(`../data`)
const { getUserMaxHP, stainedApronHeal, initProps } = require(`./utils`)
const { getThirdPersonFlavorText } = require(`./act`)
const { printMercy } = require(`./graphics`)

function handleMercy(user, toUser, player, capsPlayer, target, capsTarget) {
    if (settings.debug) { console.log(`${boldTxt}> handleMercy(user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printMercy()

    const randNum = target.hp <= 5
        ? Math.floor(Math.random() * 2)
        : target.hp <= 10
            ? Math.floor(Math.random() * 4)
            : Math.floor(Math.random() * 10)

    const randGold = (Math.floor(Math.random() * 21) + 20) * 5
    let response = `* `

    if (randNum === 0) {
        response += `YOU WON! ${capsTarget} was spared. ${capsPlayer} earned 0 EXP and ${randGold} gold.`
        player.gold += randGold
        player.hp = getUserMaxHP(user)
        target.hp = getUserMaxHP(toUser)
    } else {
        response += `${capsPlayer} tried to spare ${target.displayName}. ${capsTarget}`
        response += getThirdPersonFlavorText()
    }
    if (player.armor === `Stained Apron`) { response += stainedApronHeal(user, player, capsPlayer) }

    console.log(`${cyanBg} sender: ${player.displayName} (${player.hp} HP), target: ${toUser === `dummy` ? `DUMMY` : target?.displayName || `none`}${target ? ` (${target.hp} HP)` : ``}, randNum: ${randNum} ${resetTxt}`)
    return response
}

module.exports = {
    attemptMercy(props) {
        const { bot, channel, user, toUser, player, capsPlayer, target, capsTarget, lastStanding } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> attemptMercy( user: ${user}, toUser: ${toUser}, lastStanding:`, lastStanding, `)${resetTxt}`) }

        if (player.dead) { return bot.say(channel, `Sorry ${player.displayName}, you are dead! :(`) }

        // Check if toUser is the sender
        if (toUser && toUser !== user) {
            if (lastStanding) { return bot.say(channel, `* But nobody came.`) }
            if (toUser === BOT_USERNAME) { return bot.say(channel, `You can't MERCY me, but you can try MERCYing the Dummy!`) }
            if (!target) { return bot.say(channel, `${toUser} is not a known player!`) }
            if (target.dead) { return bot.say(channel, `Sorry ${player.displayName}, ${players[toUser].displayName} is dead!`) }
        }
        else { return bot.say(channel, `* ${player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)} tried to spare themself. But nothing happened.`) }

        const response = handleMercy(user, toUser, player, capsPlayer, target, capsTarget)
        bot.say(channel, response)
    }
}
