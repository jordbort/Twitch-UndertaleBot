const { players, highestLevels, baseAT, baseDF } = require(`../data`)
const { settings, resetTxt, boldTxt, cyanBg } = require(`../config`)
const { getUserMaxHP } = require(`./utils`)
const { showStats } = require(`./stats`)

function calculateUserATK(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateUserATK(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let attack = baseAT + (2 * userLV)
    if (userLV >= 20) { attack = 38 }
    return attack
}

function calculateUserDEF(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateUserDEF(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let defense = Math.floor((userLV - 1) * baseDF)
    if (userLV >= 20) { defense = 4 }
    return defense
}

function calculateUserNextLV(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateUserNextLV(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv

    let userNext = 0
    if (userLV === 1) { userNext = 10 }
    if (userLV === 2) { userNext = 20 }
    if (userLV === 3) { userNext = 40 }
    if (userLV === 4) { userNext = 50 }
    if (userLV === 5) { userNext = 80 }
    if (userLV === 6) { userNext = 100 }
    if (userLV === 7) { userNext = 200 }
    if (userLV === 8) { userNext = 300 }
    if (userLV === 9) { userNext = 400 }
    if (userLV === 10) { userNext = 500 }
    if (userLV === 11) { userNext = 800 }
    if (userLV === 12) { userNext = 1000 }
    if (userLV === 13) { userNext = 1500 }
    if (userLV === 14) { userNext = 2000 }
    if (userLV === 15) { userNext = 3000 }
    if (userLV === 16) { userNext = 5000 }
    if (userLV === 17) { userNext = 10000 }
    if (userLV === 18) { userNext = 25000 }
    if (userLV === 19) { userNext = 49999 }
    if (userLV >= 20) { userNext = 999999 }
    return userNext
}

module.exports = {
    calculateUserLV(user) {
        if (settings.debug) { console.log(`${boldTxt}> calculateUserLV(user: ${user}) Current level: ${players[user].lv}, Highest level: ${highestLevels[user]}${resetTxt}`) }
        const player = players[user]

        const collectedItems = []
        while (player.next <= 0) {
            player.lv += 1
            if (player.lv === 2 && highestLevels[user] < 2) { collectedItems.push(`Snowman Piece`, `Toy Knife`, `Faded Ribbon`) }
            if (player.lv === 3 && highestLevels[user] < 3) { collectedItems.push(`Astronaut Food`, `Ballet Shoes`, `Old Tutu`) }
            if (player.lv === 4 && highestLevels[user] < 4) { collectedItems.push(`Abandoned Quiche`, `Burnt Pan`, `Stained Apron`) }
            if (player.lv === 5 && highestLevels[user] < 5) { collectedItems.push(`Instant Noodles`) }
            if (player.lv === 6 && highestLevels[user] < 6) { collectedItems.push(`Hush Puppy`) }
            if (player.lv === 7 && highestLevels[user] < 7) { collectedItems.push(`Worn Dagger`, `Heart Locket`) }
            if (player.lv === 8 && highestLevels[user] < 8) { collectedItems.push(`Bad Memory`) }
            if (player.lv === 9 && highestLevels[user] < 9) { collectedItems.push(`Last Dream`) }
            if (player.lv === 10 && highestLevels[user] < 10) { collectedItems.push(`Real Knife`, `The Locket`) }
            if (player.lv === 11 && highestLevels[user] < 11) { collectedItems.push(`Puppydough Icecream`) }
            if (player.lv === 12 && highestLevels[user] < 12) { collectedItems.push(`Pumpkin Rings`) }
            if (player.lv === 13 && highestLevels[user] < 13) { collectedItems.push(`Croquet Roll`) }
            if (player.lv === 14 && highestLevels[user] < 14) { collectedItems.push(`Ghost Fruit`) }
            if (player.lv === 15 && highestLevels[user] < 15) { collectedItems.push(`Stoic Onion`) }
            if (player.lv === 16 && highestLevels[user] < 16) { collectedItems.push(`Rock Candy`) }

            if (player.lv > highestLevels[user]) { highestLevels[user] = player.lv }
            player.next += calculateUserNextLV(user)
            player.at = calculateUserATK(user)
            player.df = calculateUserDEF(user)
            player.hp += 4
            console.log(`${cyanBg} ${player.displayName} reached LV ${player.lv}, next: ${player.next}, ATK: ${player.at}, DEF: ${player.df}, HP: ${player.hp} / ${getUserMaxHP(user)} ${resetTxt}`)
        }

        let foundItemsAppend = ``
        if (collectedItems.length) {
            for (const item of collectedItems) { player.inventory.push(item) }
            foundItemsAppend = ` ${player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)} found: ` + collectedItems.join(`, `)
        }
        showStats(user)
        return foundItemsAppend
    },
    calculateBisiclePrice(user) {
        if (settings.debug) { console.log(`${boldTxt}> calculateBisiclePrice(user: ${user})${resetTxt}`) }

        const lv = players[user].lv
        return lv < 3
            ? 15
            : lv < 4
                ? 30
                : lv < 5
                    ? 45
                    : 75
    },
    calculateNiceCreamPrice(user) {
        if (settings.debug) { console.log(`${boldTxt}> calculateNiceCreamPrice(user: ${user})${resetTxt}`) }

        const lv = players[user].lv
        if (lv < 3) { return 15 }
        else if (lv < 4) { return 25 }
        else { return 12 }
    },
    calculateTemmieArmorPrice(user) {
        if (settings.debug) { console.log(`${boldTxt}> calculateTemmieArmorPrice(user: ${user})${resetTxt}`) }

        const deaths = players[user].timesKilled
        const priceTable = {
            0: 9999,
            1: 9000,
            2: 8000,
            3: 7000,
            4: 6000,
            5: 5000,
            6: 4500,
            7: 4000,
            8: 3500,
            9: 3000,
            10: 2800,
            11: 2600,
            12: 2400,
            13: 2200,
            14: 2000,
            15: 1800,
            16: 1600,
            17: 1400,
            18: 1250,
            19: 1100
        }
        if (deaths >= 30) { return 500 }
        else if (deaths >= 25) { return 750 }
        else if (deaths >= 20) { return 1000 }
        else { return priceTable[deaths] }
    }
}
