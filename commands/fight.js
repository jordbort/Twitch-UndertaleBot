const { BOT_CHANNEL, settings, resetTxt, boldTxt, redBg, greenBg, yellowBg, blueBg, magentaBg, grayBg } = require(`../config`)
const { players, playerSave, weaponsATK, armorDEF } = require(`../data`)
const { getUserMaxHP, stainedApronHeal, initProps } = require(`./utils`)
const { calculateUserLV } = require(`./math`)
const { printFight } = require(`./graphics`)

function handleFight(bot, channel, user, toUser, player, capsPlayer, target, capsTarget) {
    if (settings.debug) { console.log(`${boldTxt}> handleFight(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printFight()

    let response = `* ${capsPlayer} attacks `
    target ? response += `${target.displayName}, ` : response += `themself, `

    const smallDamage = Math.ceil(Math.random() * 4)
    const mediumDamage = Math.ceil(Math.random() * 5) + 1
    const largeDamage = Math.ceil(Math.random() * 6) + 2
    const extraLargeDamage = Math.ceil(Math.random() * 7) + 3
    const weaponDamage = weaponsATK[player.weapon]
    const armorDeduction = target ? armorDEF[target.armor] : armorDEF[player.armor]
    const defenseBonus = target ? target.df : player.df
    let attackBonus = player.at

    // Attack bonus for Cowboy Hat and Temmie Armor
    if (player.armor === `Cowboy Hat`) {
        console.log(`${magentaBg} ${player.displayName} is wearing the Cowboy Hat, +5 ATK ${resetTxt}`)
        attackBonus += 5
    } else if (player.armor === `Temmie Armor`) {
        console.log(`${magentaBg} ${player.displayName} is wearing the Temmie Armor, +10 ATK ${resetTxt}`)
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

    if (target) {
        if (randNum === 0) {
            target.hp -= smallDamageDealt
            console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${target.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : target.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
        } else if (randNum === 1) {
            target.hp -= mediumDamageDealt
            console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${target.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : target.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
        } else if (randNum === 2) {
            target.hp -= largeDamageDealt
            console.log(`${grayBg} largeDamage: ${largeDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${largeDamage + weaponDamage + attackBonus} ${resetTxt} ${target.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : target.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${largeDamageDealt} ${resetTxt}`)
        } else if (randNum === 3) {
            target.hp -= extraLargeDamageDealt
            console.log(`${grayBg} extraLargeDamage: ${extraLargeDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${extraLargeDamage + weaponDamage + attackBonus} ${resetTxt} ${target.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : target.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${extraLargeDamageDealt} ${resetTxt}`)
        }

        if (player.armor === `Stained Apron`) { response += stainedApronHeal(user, player, capsPlayer) }

        bot.say(channel, response)
        deathCheck(bot, channel, user, toUser, player, capsPlayer, target, capsTarget)
    } else {
        if (randNum === 0) {
            player.hp -= smallDamageDealt
            console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
        } else if (randNum === 1) {
            player.hp -= mediumDamageDealt
            console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
        } else if (randNum === 2) {
            player.hp -= largeDamageDealt
            console.log(`${grayBg} largeDamage: ${largeDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${largeDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${largeDamageDealt} ${resetTxt}`)
        } else if (randNum === 3) {
            player.hp -= extraLargeDamageDealt
            console.log(`${grayBg} extraLargeDamage: ${extraLargeDamage} ${resetTxt} ${player.hp <= 0 ? redBg : greenBg} ${player.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${extraLargeDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${extraLargeDamageDealt} ${resetTxt}`)
        }

        if (player.armor === `Stained Apron`) { response += stainedApronHeal(user, player, capsPlayer) }

        bot.say(channel, response)
        deathCheck(bot, channel, user, toUser, player, capsPlayer, target, capsTarget)
    }
}

function deathCheck(bot, channel, user, toUser, player, capsPlayer, target, capsTarget) {
    if (settings.debug) { console.log(`${boldTxt}> deathCheck(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }

    const targetSaveData = playerSave[toUser]
    console.log(`${player.hp <= 0 ? redBg : greenBg} user: ${player.displayName} ${player.hp}/${getUserMaxHP(user)} HP ${resetTxt} ${target.hp <= 0 ? redBg : greenBg} target: ${toUser === `dummy` ? `DUMMY` : target.displayName} ${target.hp}/${getUserMaxHP(toUser)} HP ${resetTxt}`)

    const deathText = [
        `The future of monsters depends on you!`,
        `Don't lose hope!`,
        `You cannot give up just yet...`,
        `Our fate rests upon you...`,
        `It cannot end now!`,
        `You're going to be alright!`
    ]

    if (target.hp <= 0) {
        // Building death response
        let response = `* `
        response += deathText[Math.floor(Math.random() * deathText.length)]

        if (toUser === `dummy`) {
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
        if (user !== toUser) {
            // Appending awarded EXP
            const awardedEXP = 10 + target.exp
            response += `${capsPlayer} earned ${awardedEXP} EXP`

            // Appending awarded gold
            const randGold = Math.ceil(Math.random() * 19) * 5
            player.gold += randGold
            if (target.gold > 0) {
                player.gold += target.gold
                target.gold = 0
                response += `, got ${target.displayName}'s gold, and found ${randGold} G.`
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
            player.exp += awardedEXP
            player.next -= awardedEXP
            if (player.next <= 0) {
                response += ` ${capsPlayer}'s LOVE increased.`
                response += calculateUserLV(user)
            }
        } else {
            if (player.gold > 0) {
                player.gold = 0
                response += ` ${capsPlayer} lost all their gold!`
            }
        }

        // Resetting target user's stats
        target.timesKilled++
        target.dead = true
        target.hp = 0
        target.lv = 1
        target.exp = 0
        target.next = 10
        target.at = 0
        target.df = 0

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
            if (toUser === `undertalebot`) { return bot.say(channel, `You can't FIGHT me, but you can try FIGHTing the Dummy!`) }
            if (!target) { return bot.say(channel, `${toUser} is not a known player!`) }
            if (target.dead) { return bot.say(channel, `${target.displayName} is already dead!`) }
        }
        else { return bot.say(channel, `* ${capsPlayer} tried to fight themself. But nothing happened.`) }

        handleFight(bot, channel, user, toUser, player, capsPlayer, target, capsTarget)
    }
}
