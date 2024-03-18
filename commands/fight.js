const { BOT_CHANNEL, settings, resetTxt, boldTxt, redBg, greenBg, yellowBg, blueBg, magentaBg, grayBg } = require(`../config`)
const { players, playerSave, weaponsATK, armorDEF } = require(`../data`)
const { getUserMaxHP, stainedApronHeal, initProps } = require(`./utils`)
const { calculateUserLV } = require(`./math`)
const { printFight } = require(`./graphics`)

function handleFight(bot, channel, user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleFight(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printFight()
    const sendingPlayer = players[user]
    const targetPlayer = players[toUser]
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    let response = `* ${capsSender} attacks `
    targetPlayer ? response += `${targetPlayer.displayName}, ` : response += `themself, `

    const smallDamage = Math.ceil(Math.random() * 4)
    const mediumDamage = Math.ceil(Math.random() * 5) + 1
    const largeDamage = Math.ceil(Math.random() * 6) + 2
    const extraLargeDamage = Math.ceil(Math.random() * 7) + 3
    const weaponDamage = weaponsATK[sendingPlayer.weapon]
    const armorDeduction = targetPlayer ? armorDEF[targetPlayer.armor] : armorDEF[sendingPlayer.armor]
    const defenseBonus = targetPlayer ? targetPlayer.df : sendingPlayer.df
    let attackBonus = sendingPlayer.at

    // Attack bonus for Cowboy Hat and Temmie Armor
    if (sendingPlayer.armor === `Cowboy Hat`) {
        console.log(`${magentaBg} ${sendingPlayer.displayName} is wearing the Cowboy Hat, +5 ATK ${resetTxt}`)
        attackBonus += 5
    } else if (sendingPlayer.armor === `Temmie Armor`) {
        console.log(`${magentaBg} ${sendingPlayer.displayName} is wearing the Temmie Armor, +10 ATK ${resetTxt}`)
        attackBonus += 10
    }

    let smallDamageDealt = (smallDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
    let mediumDamageDealt = (mediumDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
    let largeDamageDealt = (largeDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
    let extraLargeDamageDealt = (extraLargeDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
    if (smallDamageDealt < 0) { smallDamageDealt = 0 }
    if (mediumDamageDealt < 0) { mediumDamageDealt = 0 }
    if (largeDamageDealt < 0) { largeDamageDealt = 0 }
    if (extraLargeDamageDealt < 0) { extraLargeDamageDealt = 0 }

    outcome = [
        `and deals ${smallDamageDealt} damage!`,
        `and deals ${mediumDamageDealt} damage!`,
        `and deals ${largeDamageDealt} damage!`,
        `and deals ${extraLargeDamageDealt} damage!`,
        `but misses!`
    ]
    const randNum = Math.floor(Math.random() * outcome.length)
    response += outcome[randNum]

    if (randNum === 1 && mediumDamage >= 6) { response += ` Critical hit!` }
    else if (randNum === 2 && largeDamage >= 6) { response += ` Critical hit!` }
    else if (randNum === 3 && extraLargeDamage >= 6) { extraLargeDamage === 10 ? response += ` Ouch!` : response += ` Critical hit!` }

    if (targetPlayer) {
        if (randNum === 0) {
            targetPlayer.hp -= smallDamageDealt
            console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
        } else if (randNum === 1) {
            targetPlayer.hp -= mediumDamageDealt
            console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
        } else if (randNum === 2) {
            targetPlayer.hp -= largeDamageDealt
            console.log(`${grayBg} largeDamage: ${largeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${largeDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${largeDamageDealt} ${resetTxt}`)
        } else if (randNum === 3) {
            targetPlayer.hp -= extraLargeDamageDealt
            console.log(`${grayBg} extraLargeDamage: ${extraLargeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${extraLargeDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${extraLargeDamageDealt} ${resetTxt}`)
        }

        if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

        bot.say(channel, response)
        deathCheck(bot, channel, user, toUser)
    } else {
        if (randNum === 0) {
            sendingPlayer.hp -= smallDamageDealt
            console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
        } else if (randNum === 1) {
            sendingPlayer.hp -= mediumDamageDealt
            console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
        } else if (randNum === 2) {
            sendingPlayer.hp -= largeDamageDealt
            console.log(`${grayBg} largeDamage: ${largeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${largeDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${largeDamageDealt} ${resetTxt}`)
        } else if (randNum === 3) {
            sendingPlayer.hp -= extraLargeDamageDealt
            console.log(`${grayBg} extraLargeDamage: ${extraLargeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${extraLargeDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${extraLargeDamageDealt} ${resetTxt}`)
        }

        if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

        bot.say(channel, response)
        deathCheck(bot, channel, user, user)
    }
}

function deathCheck(bot, channel, user, target) {
    if (settings.debug) {
        console.log(`${boldTxt}> deathCheck(channel: ${channel}, user: ${user}, target: ${target})${resetTxt}`)
        if (!channel.startsWith(`#`)) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'channel' data being sent (doesn't start with '#')!${resetTxt}`) }
    }
    const sendingPlayer = players[user]
    const targetPlayer = players[target]
    const targetSaveData = playerSave[target]
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    const capsTarget = targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)
    console.log(`${sendingPlayer.hp <= 0 ? redBg : greenBg} user: ${sendingPlayer.displayName} ${sendingPlayer.hp}/${getUserMaxHP(user)} HP ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} target: ${target === `dummy` ? `DUMMY` : targetPlayer.displayName} ${targetPlayer.hp}/${getUserMaxHP(target)} HP ${resetTxt}`)

    const deathText = [
        `The future of monsters depends on you!`,
        `Don't lose hope!`,
        `You cannot give up just yet...`,
        `Our fate rests upon you...`,
        `It cannot end now!`,
        `You're going to be alright!`
    ]

    if (targetPlayer.hp <= 0) {
        // Building death response
        let response = `* `
        response += deathText[Math.floor(Math.random() * deathText.length)]

        if (target === `dummy`) {
            response += ` The Dummy was ripped to shreds... `
            clearTimeout(settings.respawnTimer)
            settings.respawnTimer = setTimeout(() => {
                const flavorTexts = [
                    `* You encountered the Dummy.`,
                    `* Dummy looks like it's going to fall over.`,
                    `* Dummy stands around absentmindedly.`
                ]
                const flavorText = flavorTexts[Math.floor(Math.random() * flavorTexts.length)]
                players.dummy.hp = getUserMaxHP(`dummy`)
                players.dummy.dead = false
                bot.say(channel, flavorText)
            }, settings.msDelay)
        } else {
            response += ` ${capsTarget}! Stay determined... `
        }

        // Checking if user killed a different user
        if (user !== target) {
            // Appending awarded EXP
            const awardedEXP = 10 + targetPlayer.exp
            response += `${capsSender} earned ${awardedEXP} EXP`

            // Appending awarded gold
            const randGold = Math.ceil(Math.random() * 19) * 5
            sendingPlayer.gold += randGold
            if (targetPlayer.gold > 0) {
                sendingPlayer.gold += targetPlayer.gold
                targetPlayer.gold = 0
                response += `, got ${targetPlayer.displayName}'s gold, and found ${randGold} G.`
            } else {
                response += ` and ${randGold} G.`
            }

            // Resetting target's EXP and Gold in SAVE data, because it was taken by another user, and would otherwise be duplicated if/when they LOAD
            targetSaveData.lv = 1
            if (targetSaveData.hp > 20) { targetSaveData.hp = 20 }
            targetSaveData.at = 0
            targetSaveData.df = 0
            targetSaveData.exp = 0
            targetSaveData.next = 10
            targetSaveData.gold = 0

            // Checking for LV threshold
            sendingPlayer.exp += awardedEXP
            sendingPlayer.next -= awardedEXP
            if (sendingPlayer.next <= 0) {
                response += ` ${capsSender}'s LOVE increased.`
                response += calculateUserLV(user)
            }
        } else {
            if (sendingPlayer.gold > 0) {
                sendingPlayer.gold = 0
                response += ` ${capsSender} lost all their gold!`
            }
        }

        // Resetting target user's stats
        targetPlayer.timesKilled++
        targetPlayer.dead = true
        targetPlayer.hp = 0
        targetPlayer.lv = 1
        targetPlayer.exp = 0
        targetPlayer.next = 10
        targetPlayer.at = 0
        targetPlayer.df = 0

        const msgDelay = channel === BOT_CHANNEL ? 1000 : 2000
        setTimeout(() => bot.say(channel, response), msgDelay)
    }
}

module.exports = {
    attemptFight(props) {
        const { bot, channel, user, toUser, player, capsPlayer, target, capsTarget, lastStanding } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> attemptFight( user: ${user}, toUser: ${toUser}, lastStanding:`, lastStanding, `)${resetTxt}`) }

        if (player.dead) { return bot.say(channel, `Sorry ${player.displayName}, you are dead! :(`) }

        // Stop if target is the bot, dead, or not known, or if no target is specified
        if (toUser) {
            if (lastStanding) { return bot.say(channel, `* But nobody came.`) }
            if (target) {
                if (target.dead) { return bot.say(channel, `${capsName} is already dead! :(`) }
            }
            else if (toUser === `undertalebot`) { return bot.say(channel, `You can't FIGHT me, but you can try FIGHTing the Dummy!`) }
            else { return bot.say(channel, `${toUser} isn't a known player!`) }
        }
        else { return bot.say(channel, `* ${capsName} tried to fight themself. But nothing happened.`) }
        return handleFight(bot, channel, user, toUser)
    }
}
