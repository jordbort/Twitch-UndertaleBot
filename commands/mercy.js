const { BOT_USERNAME, settings, resetTxt, boldTxt, cyanBg } = require(`../config`)
const { players } = require(`../data`)
const { getUserMaxHP, getToUser, stainedApronHeal } = require(`./utils`)
const { getThirdPersonFlavorText } = require(`./act`)
const { printMercy } = require(`./graphics`)

function handleMercy(user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleMercy(user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printMercy()
    const sendingPlayer = players[user]
    const targetPlayer = players[toUser]
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    const capsTarget = targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)
    const randNum = targetPlayer.hp <= 5
        ? Math.floor(Math.random() * 2)
        : targetPlayer.hp <= 10
            ? Math.floor(Math.random() * 4)
            : Math.floor(Math.random() * 10)

    const randGold = (Math.floor(Math.random() * 21) + 20) * 5
    let response = `* `

    if (randNum === 0) {
        response += `YOU WON! ${capsTarget} was spared. ${capsSender} earned 0 EXP and ${randGold} gold.`
        sendingPlayer.gold += randGold
        sendingPlayer.hp = getUserMaxHP(user)
        targetPlayer.hp = getUserMaxHP(toUser)
    } else {
        response += `${capsSender} tried to spare ${targetPlayer.displayName}. ${capsTarget}`
        response += getThirdPersonFlavorText()
    }
    if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

    console.log(`${cyanBg} sender: ${sendingPlayer.displayName} (${sendingPlayer.hp} HP), target: ${toUser === `dummy` ? `DUMMY` : targetPlayer?.displayName || `none`}${targetPlayer ? ` (${targetPlayer.hp} HP)` : ``}, randNum: ${randNum} ${resetTxt}`)
    return response
}

module.exports = {
    attemptMercy(props) {
        const { bot, channel, tags, message, args } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptMercy(channel: ${channel},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`}, args:`, args, `)${resetTxt}`) }

        const user = tags.username
        const toUser = getToUser(args[0])
        const player = players[user]
        const target = toUser in players ? players[toUser] : null
        const lastStanding = Object.keys(players).filter((player) => { return !players[player].dead }).length === 1

        if (player.dead) { return bot.say(channel, `Sorry ${player.displayName}, you are dead! :(`) }

        // Check if toUser is the sender
        if (toUser && toUser !== user) {
            if (lastStanding) { return bot.say(channel, `* But nobody came.`) }
            if (toUser === BOT_USERNAME) { return bot.say(channel, `You can't MERCY me, but you can try MERCYing the Dummy!`) }
            if (!target) { return bot.say(channel, `${toUser} is not a known player!`) }
            if (target.dead) { return bot.say(channel, `Sorry ${player.displayName}, ${players[toUser].displayName} is dead! :(`) }
        }
        else { return bot.say(channel, `* ${player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)} tried to spare themself. But nothing happened.`) }

        const response = handleMercy(user, toUser)
        bot.say(channel, response)
    }
}
