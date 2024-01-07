const { talk, stainedApronHeal, getUserMaxHP } = require(`./utils`)

const { getThirdPersonFlavorText } = require(`./act`)

const { resetTxt, boldTxt, cyanBg, settings } = require(`./config`)

const { players } = require(`./data`)

function printMercy() {
    if (settings.debug) { console.log(`${boldTxt}> printMercy()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const ywSq = `\x1b[43m  \x1b[0m`
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
}

function handleMercy(channel, user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleMercy(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }
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

    const randGoldAmt = Math.floor(Math.random() * 101)
    let response = `* `

    if (randNum === 0) {
        response += `YOU WON! ${capsTarget} was spared. ${capsSender} earned 0 EXP and ${randGoldAmt} gold.`
        sendingPlayer.gold += randGoldAmt
        sendingPlayer.hp = getUserMaxHP(user)
        targetPlayer.hp = getUserMaxHP(toUser)
    } else {
        response += `${capsSender} tried to spare ${targetPlayer.displayName}. ${capsTarget}`
        response += getThirdPersonFlavorText()
    }
    if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

    talk(channel, response)
    console.log(`${cyanBg} sender: ${sendingPlayer.displayName} (${sendingPlayer.hp} HP), target: ${toUser === `dummy` ? `DUMMY` : targetPlayer?.displayName || `none`}${targetPlayer ? ` (${targetPlayer.hp} HP)` : ``}, randNum: ${randNum} ${resetTxt}`)
}

module.exports = { handleMercy }
