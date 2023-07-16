require(`dotenv`).config()
const tmi = require('tmi.js')
const BOT_USERNAME = process.env.BOT_USERNAME
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const SELECTED_CHANNEL = process.env.CHANNEL_1

// Terminal colors
const resetTxt = `\x1b[0m`
const boldTxt = `\x1b[1m`
const underlined = `\x1b[4m`
const inverted = `\x1b[7m`

const blackTxt = `\x1b[30m`
const redTxt = `\x1b[31m`
const greenTxt = `\x1b[32m`
const yellowTxt = `\x1b[33m`
const blueTxt = `\x1b[34m`
const magentaTxt = `\x1b[35m`
const cyanTxt = `\x1b[36m`
const whiteTxt = `\x1b[37m`
const grayTxt = `\x1b[90m`
const orangeTxt = `\x1b[38;5;208m`

const blackBg = `\x1b[40m`
const redBg = `\x1b[41m`
const greenBg = `\x1b[42m`
const yellowBg = `\x1b[43m`
const blueBg = `\x1b[44m`
const magentaBg = `\x1b[45m`
const cyanBg = `\x1b[46m`
const whiteBg = `\x1b[47m`
const grayBg = `\x1b[100m`
const orangeBg = `\x1b[48;2;255;164;0m`

// Define configuration options
const opts = {
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [
        SELECTED_CHANNEL
    ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// All active users (to avoid duplicate clients):
const globalUsers = [`undertalebot`]

const baseHP = 16
const baseAT = -2
const baseDF = 0.25

// Initializing players
let players = {
    dummy: {
        lv: 1,
        hp: 20,
        dead: false,
        at: 0,
        df: 0,
        exp: 0,
        next: 10,
        weapon: `Stick`,
        armor: `Bandage`,
        gold: 0,
        stainedApronHealTime: false,
        inventory: []
    }
}

// Initializing player SAVE data
let playerSave = {
    dummy: {
        lv: 1,
        hp: 20,
        dead: false,
        at: 0,
        df: 0,
        exp: 0,
        next: 10,
        weapon: `Stick`,
        armor: `Bandage`,
        gold: 0,
        stainedApronHealTime: false,
        inventory: []
    }
}

const weaponsATK = {
    'Stick': 0,
    'Toy Knife': 3,
    'Tough Glove': 5,
    'Ballet Shoes': 7,
    'Torn Notebook': 2,
    'Burnt Pan': 10,
    'Empty Gun': 12,
    'Worn Dagger': 15,
    'Real Knife': 99
}

const armorDEF = {
    'Bandage': 0,
    'Faded Ribbon': 3,
    'Manly Bandanna': 7,
    'Old Tutu': 10,
    'Cloudy Glasses': 5,
    'Temmie Armor': 20,
    'Stained Apron': 11,
    'Cowboy Hat': 12,
    'Heart Locket': 15,
    'The Locket': 99
}

// Called every time a message comes in
function onMessageHandler(channel, tags, msg, self) {
    if (self || tags["display-name"] === `UndertaleBot`) { return } // Ignore messages from the bot

    // Message context
    const sender = tags["display-name"]
    const senderIsSubbed = tags["subscriber"]
    const senderIsAMod = tags["mod"]
    const senderIsVIP = tags["vip"]

    // Command and arguments parser
    const args = msg.split(' ')
    const command = args.shift().toLowerCase()
    const toUser = args[0] ? getToUser(args[0]) : ``

    // Add/manage players
    if (!(sender.toLowerCase() in players)) {
        players[`${sender.toLowerCase()}`] = {
            lv: 1,
            hp: 20,
            dead: false,
            at: 0,
            df: 0,
            exp: 0,
            next: 10,
            weapon: `Stick`,
            armor: `Bandage`,
            gold: 0,
            stainedApronHealTime: false,
            inventory: [`Monster Candy`, `Butterscotch Pie`]
        }
        playerSave[`${sender.toLowerCase()}`] = {
            lv: 1,
            hp: 20,
            dead: false,
            at: 0,
            df: 0,
            exp: 0,
            next: 10,
            weapon: `Stick`,
            armor: `Bandage`,
            gold: 0,
            stainedApronHealTime: false,
            inventory: [`Monster Candy`, `Butterscotch Pie`]
        }
    }
    const sendingPlayer = players[sender.toLowerCase()]
    const targetPlayer = toUser.toLowerCase() !== sender.toLowerCase() && toUser.toLowerCase() in players ? players[toUser.toLowerCase()] : null

    // *****************
    // ** REPLY CASES **
    // *****************

    // JOIN
    if (command === `!join` && channel === `#undertalebot`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const user = sender.toLowerCase()

        let index = -1
        for (const idx in globalUsers) {
            if (globalUsers[idx] === user) {
                index = idx
                break
            }
        }
        if (index >= 0) {
            talk(channel, `${sender}, I should already be active in your channel! Try using a command like !stats in your chat if you're not sure! :O`)
            return
        }

        const client = new tmi.client({
            identity: {
                username: BOT_USERNAME,
                password: OAUTH_TOKEN
            },
            channels: [user]
        })
        client.on('message', onMessageHandler)
        client.connect()

        globalUsers.push(user)
        talk(`#undertalebot`, `${sender}, I am now active in your Twitch channel! This will only last until I am rebooted, which is frequent since I'm under development, so don't expect me to stay for long! While I'm streaming, you can always come back and use !join if I disappear from your chat. ;)`)
    }

    // MEMORY
    if (command === `!memory`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response = `Players: `
        for (const player in players) {
            const logColor = players[player][`dead`] ? redBg : greenBg
            response += `${player} `
            console.log(`${logColor} ${player} LV: ${players[player][`lv`]}, HP: ${players[player][`hp`]}/${getUserMaxHP(player)}, AT: ${players[player][`at`]}, DF: ${players[player][`df`]}, EXP: ${players[player][`exp`]}, NEXT: ${players[player][`next`]}, Weapon: ${players[player][`weapon`]}, Armor: ${players[player][`armor`]}, Gold: ${players[player][`gold`]} ${resetTxt}`)
        }
        talk(channel, response)
    }

    // SAVE
    if (command === `!save`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        if (sendingPlayer[`dead`]) {
            talk(channel, `Sorry ${sender}, you are dead! :(`)
            return
        }

        playerSave[sender.toLowerCase()] = { ...players[sender.toLowerCase()] }

        let response = `* `
        const saveText = [
            `The shadow of the ruins looms above, filling ${sender} with determination.`,
            `Playfully crinkling through the leaves fills ${sender} with determination.`,
            `Knowing the mouse might one day leave its hole and get the cheese... It fills ${sender} with determination.`,
            `Seeing such a cute, tidy house in the RUINS gives ${sender} determination.`,
            `The cold atmosphere of a new land... it fills ${sender} with determination.`,
            `The convenience of that lamp still fills ${sender} with determination.`,
            `Knowing the mouse might one day find a way to heat up the spaghetti... It fills ${sender} with determination.`,
            `Snow can always be broken down and rebuilt into something more useful. This simple fact fills ${sender} with determination.`,
            `Knowing that dog will never give up trying to make the perfect snowdog... It fills ${sender} with determination.`,
            `The sight of such a friendly town fills ${sender} with determination.`,
            `The sound of rushing water fills ${sender} with determination.`,
            `A feeling of dread hangs over ${sender}... But ${sender} stays determined.`,
            `Knowing the mouse might one day extract the cheese from the mystical crystal... It fills ${sender} with determination.`,
            `The serene sound of a distant music box... It fills ${sender} with determination.`,
            `The sound of muffled rain on the cavetop... It fills ${sender} with determination.`,
            `The waterfall here seems to flow from the ceiling of the cavern... Occasionally, a piece of trash will flow through... and fall into the bottomless abyss below. Viewing this endless cycle of worthless garbage... It fills ${sender} with determination.`,
            `Partaking in useless garbage fills ${sender} with determination.`,
            `${sender} feels a calming tranquility. ${sender} is filled with determination.`,
            `${sender} feels... something. ${sender} is filled with detemmienation.`,
            `The wind is howling. ${sender} is filled with determination.`,
            `The wind has stopped. ${sender} is filled with determination.`,
            `The howling wind is now a breeze. This gives ${sender} determination.`,
            `Seeing such a strange laboratory in a place like this... ${sender} is filled with determination.`,
            `The wooshing sound of steam and cogs... it fills ${sender} with determination.`,
            `An ominous structure looms in the distance... ${sender} is filled with determination.`,
            `Knowing the mouse might one day hack into the computerized safe and get the cheese... It fills ${sender} with determination.`,
            `The smell of cobwebs fills the air... ${sender} is filled with determination.`,
            `The relaxing atmosphere of this hotel... it fills ${sender} with determination.`,
            `The air is filled with the smell of ozone... it fills ${sender} with determination.`,
            `Behind this door must be the elevator to the King's castle. ${sender} is filled with determination.`
        ]
        const randSaveText = Math.floor(Math.random() * saveText.length)
        response += saveText[randSaveText]
        talk(channel, response)
    }

    // LOAD
    if (command === `!load`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        players[sender.toLowerCase()] = { ...playerSave[sender.toLowerCase()] }
        players[sender.toLowerCase()][`inventory`] = playerSave[sender.toLowerCase()][`inventory`]

        let response = `"${sender}" `
        let attackBoost = 0
        if (players[sender.toLowerCase()][`armor`] === `Cowboy Hat`) { attackBoost = 5 }
        if (players[sender.toLowerCase()][`armor`] === `Temmie Armor`) { attackBoost = 10 }
        response += `LV: ${players[sender.toLowerCase()][`lv`]}, HP: ${players[sender.toLowerCase()][`hp`]}/${getUserMaxHP(sender)}, AT: ${players[sender.toLowerCase()][`at`]}(${weaponsATK[players[sender.toLowerCase()][`weapon`]] + attackBoost}), DF: ${players[sender.toLowerCase()][`df`]}(${armorDEF[players[sender.toLowerCase()][`armor`]]}), EXP: ${players[sender.toLowerCase()][`exp`]}, NEXT: ${players[sender.toLowerCase()][`next`]}, WEAPON: ${players[sender.toLowerCase()][`weapon`]}, ARMOR: ${players[sender.toLowerCase()][`armor`]}, GOLD: ${players[sender.toLowerCase()][`gold`]}`
        talk(channel, response)
        console.log(`Inventory:`, players[sender.toLowerCase()][`inventory`])
    }

    // STAT(S)
    if (command === `!stats`
        || command === `!stat`
        || command === `!status`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        let attackBoost = 0
        if (targetPlayer) {
            if (targetPlayer[`armor`] === `Cowboy Hat`) { attackBoost = 5 }
            if (targetPlayer[`armor`] === `Temmie Armor`) { attackBoost = 10 }
            response = `"${toUser}" LV: ${targetPlayer[`lv`]}, HP: ${targetPlayer[`hp`]}/${getUserMaxHP(toUser)}, AT: ${targetPlayer[`at`]}(${weaponsATK[targetPlayer[`weapon`]] + attackBoost}), DF: ${targetPlayer[`df`]}(${armorDEF[targetPlayer[`armor`]]}), EXP: ${targetPlayer[`exp`]}, NEXT: ${targetPlayer[`next`]}, WEAPON: ${targetPlayer[`weapon`]}, ARMOR: ${targetPlayer[`armor`]}, GOLD: ${targetPlayer[`gold`]}`
        } else if (toUser) {
            response = `${toUser} isn't registered :(`
        } else {
            if (sendingPlayer[`armor`] === `Cowboy Hat`) { attackBoost = 5 }
            if (sendingPlayer[`armor`] === `Temmie Armor`) { attackBoost = 10 }
            response = `"${sender}" LV: ${sendingPlayer[`lv`]}, HP: ${sendingPlayer[`hp`]}/${getUserMaxHP(sender)}, AT: ${sendingPlayer[`at`]}(${weaponsATK[sendingPlayer[`weapon`]] + attackBoost}), DF: ${sendingPlayer[`df`]}(${armorDEF[sendingPlayer[`armor`]]}), EXP: ${sendingPlayer[`exp`]}, NEXT: ${sendingPlayer[`next`]}, WEAPON: ${sendingPlayer[`weapon`]}, ARMOR: ${sendingPlayer[`armor`]}, GOLD: ${sendingPlayer[`gold`]}`
        }
        talk(channel, response)
    }

    // SPAMTON QUOTE
    if (command === `!spamton`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const response = getSpamtonQuote(args[0])
        talk(channel, response)
    }

    // FIGHT or ATTACK
    if (command === `!fight`
        || command === `!attack`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        if (sendingPlayer[`dead`]) {
            talk(channel, `Sorry ${sender}, you are dead! :(`)
            return
        }

        if (toUser) {
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()][`dead`]) {
                    talk(channel, `${toUser} is already dead! :(`)
                    return
                }
            } else {
                talk(channel, `${toUser} is not a registered player :(`)
                return
            }
        }

        let response = `* ${sender} attacks `
        targetPlayer ? response += `${toUser}, ` : response += `themself, `

        const smallDamage = Math.ceil(Math.random() * 5)
        const mediumDamage = Math.ceil(Math.random() * 10)
        const bigDamage = Math.ceil(Math.random() * 15)
        const weaponDamage = weaponsATK[sendingPlayer[`weapon`]]
        const armorDeduction = targetPlayer ? armorDEF[targetPlayer[`armor`]] : armorDEF[sendingPlayer[`armor`]]
        const defenseBonus = targetPlayer ? targetPlayer[`df`] : sendingPlayer[`df`]
        let attackBonus = sendingPlayer[`at`]

        // Attack bonus for Cowboy Hat and Temmie Armor
        if (sendingPlayer[`armor`] === `Cowboy Hat`) {
            console.log(`${magentaBg} ${sender} is wearing the Cowboy Hat, +5 ATK ${resetTxt}`)
            attackBonus += 5
        } else if (sendingPlayer[`armor`] === `Temmie Armor`) {
            console.log(`${magentaBg} ${sender} is wearing the Temmie Armor, +10 ATK ${resetTxt}`)
            attackBonus += 10
        }

        let smallDamageDealt = (smallDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
        let mediumDamageDealt = (mediumDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
        let bigDamageDealt = (bigDamage + weaponDamage + attackBonus) - armorDeduction - defenseBonus
        if (smallDamageDealt < 0) { smallDamageDealt = 0 }
        if (mediumDamageDealt < 0) { mediumDamageDealt = 0 }
        if (bigDamageDealt < 0) { bigDamageDealt = 0 }

        outcome = [
            `and deals ${smallDamageDealt} damage!`,
            `and deals ${mediumDamageDealt} damage!`,
            `and deals ${bigDamageDealt} damage!`,
            `but misses!`
        ]
        const randNum = Math.floor(Math.random() * outcome.length)
        response += outcome[randNum]

        if (randNum === 1) {
            if (mediumDamage >= 10) { response += ` Critical hit!` }
        } else if (randNum === 2) {
            if (bigDamage >= 10) { response += ` Critical hit!` }
        }

        // Stained Apron heal check
        let stainedApronHealCheck
        if (sendingPlayer[`armor`] === `Stained Apron`) {
            stainedApronHealCheck = stainedApronHealToggle(sender)
            if (stainedApronHealCheck) { response += ` ${sender} recovered 1 HP!` }
        }

        talk(channel, response)

        if (targetPlayer) {
            if (randNum === 0) {
                targetPlayer[`hp`] -= smallDamageDealt
                console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} ${sender} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer[`hp`] <= 0 ? redBg : greenBg} ${toUser} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
            } else if (randNum === 1) {
                targetPlayer[`hp`] -= mediumDamageDealt
                console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} ${sender} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer[`hp`] <= 0 ? redBg : greenBg} ${toUser} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
            } else if (randNum === 2) {
                targetPlayer[`hp`] -= bigDamageDealt
                console.log(`${grayBg} bigDamage: ${bigDamage} ${resetTxt} ${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} ${sender} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${bigDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer[`hp`] <= 0 ? redBg : greenBg} ${toUser} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${bigDamageDealt} ${resetTxt}`)
            }
            if (stainedApronHealCheck) {
                sendingPlayer[`hp`] += 1
                if (sendingPlayer[`hp`] > getUserMaxHP(sender)) { sendingPlayer[`hp`] = getUserMaxHP(sender) }
            }
            deathCheck(channel, sender, toUser)
        } else {
            if (randNum === 0) {
                sendingPlayer[`hp`] -= smallDamageDealt
                console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} ${sender} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
            } else if (randNum === 1) {
                sendingPlayer[`hp`] -= mediumDamageDealt
                console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} ${sender} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
            } else if (randNum === 2) {
                sendingPlayer[`hp`] -= bigDamageDealt
                console.log(`${grayBg} bigDamage: ${bigDamage} ${resetTxt} ${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} ${sender} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${bigDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${bigDamageDealt} ${resetTxt}`)
            }
            if (stainedApronHealCheck) {
                sendingPlayer[`hp`] += 1
                if (sendingPlayer[`hp`] > getUserMaxHP(sender)) { sendingPlayer[`hp`] = getUserMaxHP(sender) }
            }
            deathCheck(channel, sender, sender)
        }
    }

    // ACT
    if (command === `!act`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        if (sendingPlayer[`dead`]) {
            talk(channel, `Sorry ${sender}, you are dead! :(`)
            return
        }

        if (toUser) {
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()][`dead`]) {
                    talk(channel, `Sorry ${sender}, ${toUser} is dead! :(`)
                    return
                }
            } else {
                talk(channel, `${toUser} is not a registered player :(`)
                return
            }
        }

        let response = `* ${sender}`
        targetPlayer ? response += getAction(sender, toUser) : response += getThirdPersonFlavorText()

        // Stained Apron heal check
        if (sendingPlayer[`armor`] === `Stained Apron`) {
            const stainedApronHealCheck = stainedApronHealToggle(sender)
            if (stainedApronHealCheck) {
                response += ` ${sender} recovered 1 HP!`
                sendingPlayer[`hp`] += 1
                if (sendingPlayer[`hp`] > getUserMaxHP(sender)) { sendingPlayer[`hp`] = getUserMaxHP(sender) }
            }
        }

        talk(channel, response)
    }

    // ITEM or ITEMS or USE
    if (command === `!item`
        || command === `!items`
        || command === `!use`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const inventory = sendingPlayer[`inventory`]
        console.log(`Inventory:`, inventory)

        let usedItem = toUser.toLowerCase() || ``

        if (inventory.length === 0) {
            talk(channel, `${sender} has no items! :(`)
            return
        }

        if (!usedItem) {
            talk(channel, `${sender}'s items: ${inventory}`)
            return
        }

        if (sendingPlayer[`dead`]) {
            talk(channel, `Sorry ${sender}, you are dead! :(`)
            return
        }

        const allItems = [
            "bandage",
            "monster candy",
            "spider donut",
            "spider cider",
            "butterscotch pie",
            "snail pie",
            "snowman piece",
            "nice cream",
            "bisicle",
            "unisicle",
            "cinnamon bunny",
            "astronaut food",
            "crab apple",
            "sea tea",
            "abandoned quiche",
            "temmie flakes",
            "dog salad",
            "instant noodles",
            "hot dog",
            "hot cat",
            "junk food",
            "hush puppy",
            "starfait",
            "glamburger",
            "legendary hero",
            "steak in the shape of mettaton's face",
            "popato chisps",
            "bad memory",
            "last dream",

            // Unused items
            "puppydough icecream",
            "pumpkin rings",
            "croquet roll",
            "ghost fruit",
            "stoic onion",
            "rock candy",

            // Weapons
            `stick`,
            `toy knife`,
            `tough glove`,
            `ballet shoes`,
            `torn notebook`,
            `burnt pan`,
            `empty gun`,
            `worn dagger`,
            `real knife`,

            // Armor
            `faded ribbon`,
            `manly bandanna`,
            `old tutu`,
            `cloudy glasses`,
            `temmie armor`,
            `stained apron`,
            `cowboy hat`,
            `heart locket`,
            `the locket`
        ]

        let isAnItem = false
        for (idx in allItems) {
            if (msg.toLowerCase().includes(allItems[idx])) {
                isAnItem = true
                usedItem = allItems[idx]
                break
            }
        }
        if (!isAnItem) {
            talk(channel, `${sender}, that isn't an item! :(`)
            return
        }

        let index = -1
        for (const idx in inventory) {
            if (inventory[idx].toLowerCase() === usedItem) {
                index = idx
                break
            }
        }

        if (index < 0) {
            talk(channel, `${sender}, you don't have that item! :(`)
            return
        }

        const response = useItem(sender, usedItem, index)
        talk(channel, response)
    }

    // MERCY or SPARE
    if (command === `!mercy`
        || command === `!spare`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        if (sendingPlayer[`dead`]) {
            talk(channel, `Sorry ${sender}, you are dead! :(`)
            return
        }

        let randNum = Math.ceil(Math.random() * 10)
        if (targetPlayer) {
            if (targetPlayer[`hp`] <= 10) { randNum = Math.ceil(Math.random() * 4) }
            if (targetPlayer[`hp`] <= 5) { randNum = Math.ceil(Math.random() * 2) }
        }
        const randGoldAmt = Math.floor(Math.random() * 101)
        let response = `* `

        // Check if toUser is the sender
        if (toUser && toUser.toLowerCase() !== sender.toLowerCase()) {
            // If toUser not registered
            if (!(toUser.toLowerCase() in players)) {
                response = `${toUser} is not a registered player :(`
                talk(channel, response)
                return
                // If toUser is dead
            } else if (targetPlayer[`dead`]) {
                response = `Sorry ${sender}, ${toUser} is dead! :(`
                talk(channel, response)
                return
            } else if (randNum === 1) {
                response += `YOU WON! ${toUser} was spared. ${sender} earned 0 EXP and ${randGoldAmt} gold.`
                sendingPlayer[`gold`] += randGoldAmt
                sendingPlayer[`hp`] = getUserMaxHP(sender)
                targetPlayer[`hp`] = getUserMaxHP(toUser)

                talk(channel, response)
                console.log(`${cyanBg} sender: ${sender} ${sendingPlayer[`hp`]}, toUser: ${toUser || `none`} ${targetPlayer ? targetPlayer[`hp`] : ``}, randNum: ${randNum} ${resetTxt}`)
                return
            } else {
                response += `${sender} tried to spare ${toUser}. ${toUser}`
                response += getThirdPersonFlavorText()
            }
        } else {
            response += `${sender} tried to spare themself. But nothing happened.`
        }

        // Stained Apron heal check
        if (sendingPlayer[`armor`] === `Stained Apron`) {
            const stainedApronHealCheck = stainedApronHealToggle(sender)
            if (stainedApronHealCheck) {
                response += ` ${sender} recovered 1 HP!`
                sendingPlayer[`hp`] += 1
                if (sendingPlayer[`hp`] > getUserMaxHP(sender)) { sendingPlayer[`hp`] = getUserMaxHP(sender) }
            }
        }

        talk(channel, response)
        console.log(`${cyanBg} sender: ${sender} ${sendingPlayer[`hp`]}, toUser: ${toUser || `none`} ${targetPlayer ? targetPlayer[`hp`] : ``}, randNum: ${randNum} ${resetTxt}`)
    }

    // HP
    if (command === `!hp`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer[`hp`]} HP`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sender} has ${sendingPlayer[`hp`]} HP`
        }
        talk(channel, response)
    }

    // GOLD
    if (command === `!gold`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer[`gold`]} G`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sender} has ${sendingPlayer[`gold`]} G`
        }
        talk(channel, response)
    }

    // EXP or EXPERIENCE
    if (command === `!exp`
        || command === `!experience`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer[`exp`]} EXP`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sender} has ${sendingPlayer[`exp`]} EXP`
        }
        talk(channel, response)
    }

    // NEXT
    if (command === `!next`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser}'s LV will increase with ${targetPlayer[`next`]} more EXP`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sender}'s LV will increase with ${sendingPlayer[`next`]} more EXP`
        }
        talk(channel, response)
    }

    // WEAPON
    if (command === `!weapon`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has the ${targetPlayer[`weapon`]} equipped (${weaponsATK[targetPlayer[`weapon`]]} ATK)`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sender} has the ${sendingPlayer[`weapon`]} equipped (${weaponsATK[sendingPlayer[`weapon`]]} ATK)`
        }
        talk(channel, response)
    }

    // ARMOR
    if (command === `!armor`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has the ${targetPlayer[`armor`]} equipped (${armorDEF[targetPlayer[`armor`]]} DEF)`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sender} has the ${sendingPlayer[`armor`]} equipped (${armorDEF[sendingPlayer[`armor`]]} DEF)`
        }
        talk(channel, response)
    }

    // BUY or SHOP or GET
    if (command === `!buy`
        || command === `!get`
        || command === `!shop`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        if (sendingPlayer[`dead`]) {
            talk(channel, `Sorry ${sender}, you are dead! :(`)
            return
        }

        // Item prices
        const itemPrices = {
            // Consumable items
            "spider donut": 7,
            "spider cider": 18,
            "nice cream": 15, // 25G later
            "bisicle": 15, // 30, 45, 70G later
            "cinnamon bunny": 25,
            "crab apple": 25,
            "sea tea": 18,
            "temmie flakes": 1, // (ON SALE,) -  3G (Normal) -  20G (expensiv) -  1000G (premiem, Genocide Route exclusive)
            "hot dog": 30,
            "hot cat": 30,
            "junk food": 25,
            "starfait": 60,
            "glamburger": 120,
            "legendary hero": 300,
            "steak in the shape of mettaton's face": 500,
            "popato chisps": 25,

            // Weapons
            "tough glove": 50,
            "torn notebook": 55,
            "empty gun": 350,

            // Armor
            "manly bandanna": 50,
            "cloudy glasses": 35,
            "temmie armor": 750,
            "cowboy hat": 350
        }

        let queryItem = ``

        const purchasableItems = [
            "spider donut",
            "spider cider",
            "nice cream",
            "bisicle",
            "cinnamon bunny",
            "crab apple",
            "sea tea",
            "temmie flakes",
            "hot dog",
            "hot cat",
            "junk food",
            "starfait",
            "glamburger",
            "legendary hero",
            "steak in the shape of mettaton's face",
            "popato chisps",

            // Weapons
            `tough glove`,
            `torn notebook`,
            `empty gun`,

            // Armor
            `manly bandanna`,
            `cloudy glasses`,
            `temmie armor`,
            `cowboy hat`
        ]

        let isAnItem = false
        for (idx in purchasableItems) {
            if (msg.toLowerCase().includes(purchasableItems[idx])) {
                isAnItem = true
                queryItem = purchasableItems[idx]
                break
            }
        }
        if (queryItem && !isAnItem) {
            talk(channel, `${sender}, that item doesn't exist! :(`)
            return
        }

        let response = `${sender} can buy: `
        if (sendingPlayer[`lv`] >= 1) { response += `Spider Donut, Spider Cider` }
        if (sendingPlayer[`lv`] >= 2) { response += `, Nice Cream, Bisicle, Cinnamon Bunny, Tough Glove, Manly Bandanna` }
        if (sendingPlayer[`lv`] >= 3) { response += `, Crab Apple, Sea Tea, Temmie Flakes, Torn Notebook, Cloudy Glasses` }
        if (sendingPlayer[`lv`] >= 4) { response += `, Temmie Armor, Hot Dog...?, Hot Cat` }
        if (sendingPlayer[`lv`] >= 5) { response += `, Junk Food, Starfait, Glamburger, Legendary Hero, Steak in the Shape of Mettaton's Face, Empty Gun, Cowboy Hat` }
        if (sendingPlayer[`lv`] >= 6) { response += `, Popato Chisps` }

        if (queryItem) { response = buyItem(sender, queryItem, itemPrices[queryItem]) }

        talk(channel, response)
    }

    // COMMANDS
    if (command === `!commands`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const response = `!fight: @ another chat member to attack them, !act: Do an action by yourself or @ another chat member, !item: Check for (or use) items in your inventory, !mercy: @ another chat member to attempt to spare them, !buy: Spend gold on items, or check what is possible to buy, !save: Use determination to save your current state, !load: Reload your previous save file`
        talk(channel, response)
    }

    // HELP
    if (command === `!help`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const response = `${sender}: This bot simulates playing Undertale! You can interact with others (try !commands to learn more), and check your stats with !stats, !hp, and !gold. You can view all known players by using !memory. While this bot is online, you can use !join in its channel to make it monitor your channel's chat too!`
        talk(channel, response)
    }

    // UNDERTALE or LOGO
    if (command === `!undertale`
        || command === `!logo`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)
        printLogo()
    }

    // AM I SUBBED
    if (msg.toLowerCase().includes(`am i sub`)
        || msg.toLowerCase().includes(`am i a sub`)
        || msg.toLowerCase().includes(`do i have a sub`)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        senderIsSubbed ? response = `Yes ${sender}, you are subbed :)` : response = `No ${sender}, you aren't subbed :(`
        talk(channel, response)
    }

    // AM I A MOD
    if (msg.toLowerCase().includes(`am i a mod`)
        || msg.toLowerCase().includes(`am i mod`)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        senderIsAMod ? response = `Yes ${sender}, you are a moderator :)` : response = `No ${sender}, you aren't a moderator :(`
        talk(channel, response)
    }

    // AM I VIP
    if (msg.toLowerCase().includes(`am i vip`)
        || msg.toLowerCase().includes(`am i a vip`)
        || msg.toLowerCase().includes(`do i have vip`)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        let response
        senderIsVIP ? response = `Yes ${sender}, you have VIP status :)` : response = `No ${sender}, you don't have VIP status :(`
        talk(channel, response)
    }

    // HELLO BOT
    if (msg.toLowerCase().includes(`hello bot`)
        || msg.toLowerCase().includes(`hey bot`)
        || msg.toLowerCase().includes(`hi bot`)
        || msg.toLowerCase().includes(`up bot`)
        || msg.toLowerCase().includes(`bot hi`)
        || msg.toLowerCase().includes(`bot hey`)
        || msg.toLowerCase().includes(`bot hello`)
        || msg.toLowerCase().includes(`bot sup`)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! :)`
        talk(channel, response)
    }

    // UNDERTALE BOT HI
    if (msg.toLowerCase().includes(`hi undertalebot`)
        || msg.toLowerCase().includes(`hey undertalebot`)
        || msg.toLowerCase().includes(`hello undertalebot`)
        || msg.toLowerCase().includes(`up undertalebot`)
        || msg.toLowerCase().includes(`hi @undertalebot`)
        || msg.toLowerCase().includes(`hey @undertalebot`)
        || msg.toLowerCase().includes(`hello @undertalebot`)
        || msg.toLowerCase().includes(`up @undertalebot`)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! How are you? :)`
        talk(channel, response)
    }

    // GN BOT
    if (msg.toLowerCase().includes(`gn bot`)
        || msg.toLowerCase().includes(`undertalebot gn`)
        || msg.toLowerCase().includes(`undertalebot good night`)
        || msg.toLowerCase().includes(`undertalebot night`)
        || msg.toLowerCase().includes(`gn undertalebot`)
        || msg.toLowerCase().includes(`night undertalebot`)
        || msg.toLowerCase().includes(`gn @undertalebot`)
        || msg.toLowerCase().includes(`night @undertalebot`)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer[`dead`] ? redTxt : greenTxt}${sender}:${resetTxt}`, msg)

        const greetings = [`Good night`, `Sleep well`, `See you later`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! :)`
        talk(channel, response)
    }

    function talk(chatroom, resp) {
        client.say(chatroom, resp)
        console.log(`${yellowBg}${chatroom} ${resetTxt}`, `${boldTxt}${yellowTxt}UndertaleBot:${resetTxt}`, `${yellowTxt}${resp}${resetTxt}`)
    }
}

// Helper functions
function getSpamtonQuote(num) {
    const quotes = [
        `$VALUES$`,
        `$$DEALS$`,
        `$"CHEAP"`,
        `$$49.998`,
        `$$REAL$$`,
        `$PRICES$`,
        `BARGAIN$`,
        `HEY      EVERY      !! IT'S ME!!! EV3RY  BUDDY  'S FAVORITE [[Number 1 Rated Salesman1997]] SPAMT`,
        `SPAMTON G. SPAMTON!!`,
        `WOAH!! IF IT ISN"T A... LIGHT nER! HEY-HE Y HEY!!!`,
        `LOOKS LIKE YOU'RE [[All Alone On A Late Night?]]`,
        `ALL YOUR FRIENDS, [[Abandoned you for the slime]] YOU ARE?`,
        `SALES, GONE DOWN THE [[Drain]] [[Drain]]??`,
        `LIVING IN A GODDAMN GARBAGE CAN???`,
        `WELL HAVE I GOT A [[Specil Deal]] FOR LONELY [[Hearts]] LIKE YOU!!`,
        `IF YOU'VE [[Lost Control Of Your Life]] THEN YOU JUST GOTTA GRAB IT BY THE [[Silly Strings]]`,
        `WHY BE THE [[Little Sponge]] WHO HATES ITS [[$4.99]] LIFE WHEN YOU CAN BE A [[BIG SHOT!!!]] [[BIG SHOT!!!!]] [[BIG SHOT!!!!!]]`,
        `THAT'S RIGHT!! NOW'S YOUR CHANCE TO BE A [[BIG SHOT]]!! AND I HAVE JUST.  THE THING. YOU NEED.`,
        `THAT'S [[Hyperlink Blocked]]. YOU WANT IT. YOU WANT [[Hyperlink Blocked]], DON'T YOU. WELL HAVE I GOT A DEAL FOR YOU!!`,
        `ALL YOU HAVE TO DO IS SHOW ME. YOUR [[HeartShapedObject]].`,
        `YOU'RE  LIGHT neR< AREN'T YOU? YOU'VE GOT THE [[LIGHT.]] WHY DON'T YOU [[Show it off?]] HAEAHAEAHAEAHAEAH!!`,
        `ENL4RGE Yourself`,
        `TRANSMIT KROMER`,
        `MEET LOCAL SINGLES STRAIGHT FROM [My]`,
        `Get Big and WIN [W1ld Pr1zes!]`,
        `[Press F1 For] HELP`,
        `HELP`,
        `HEY HEY HEY! I'VE NEVER SEEN A [HeartShapedObject] LIKE THAT BEFORE!! MY EYES ARE [[Burning]] LIKE [[DVDs of ANY movie at Half-pr1ce!]] I HAVE A VERY SPECIL [Deal] FOR YOU KID!`,
        `KID!!! IN BUSINESS YOU NEED TO SAY YOU'RE INTERESTED!!!`,
        `THAT'S THE ATTITUDE YOU LITTLE [Slime]! DEALS LIKE THIS ONLY COME ONCE IN YOUR [[Ant-sized]] [[Rapidly-shrinking]] LIFE!!`,
        `WRONG ANSWER!!! WRONG!!! WRONG!!! WRONG!!! TRY AGAIN!!!`,
        `BELIEVE IT OR          !! I USED TO be A BIG SHOT. THE BIGGEST!!! BUT NOW... I NEED A LITTLE [[Genorisity]]`,
        `YUM YUM I NEED A LITTLE MORE [Genorisity]`,
        `YUM YUM. DELICIS KROMER. DID YOU HAVE AN YMORE?`,
        `THAT'S RIGHT AND I DON'T MEAN [Money]!!! I'M A SALESMAN   , I WAS NEVER IN IT FOR THE MONEY!!!`,
        `I WAS ONLY EVER IN IT FOR THE [Freedom]. TO MAKE YOUR OWN [Deals] TO CALL YOUR OWN [Shots] AND SOMETIMES IN THE MORNING, A LITTLE [Hyperlink Blocked] SOUNDS GOOD. DOESN;T IT?KID? DON'T YOU W4NT TO BE JUST LIKE YOUR OLD PAL SPAMTON???? TAKE THE DE4L.`,
        `TAKE THE DEAL YOU LITTLE [Sponge]`,
        `DEAL OR NO DEAL, THAT'S THE TV SHOW WHERE THE PEOPLE WHO DON'T TAKE THE DEAL GET FILLED WITH BULLETS FIRED FROM THE HOST'S MOUTH!!!`,
        `NOW THAT'S WHAT I'M TALKING AB04T! YOU GOT [Guts] KID!! THAT's [[Discomfort And Abdominal Pain]] IN MY [[Guts]]!!`,
        `DONT WORRY KID I WILL GIVE YOU [Deal Insurance] ONLY FOR THE LOW, LOW PRICE OF 1000 KROMER. AN AWESOME PRICE.! AN ABSOLUTELY [[Terrifying]] PRICE PRICES SO LOW, EVERYONE I KNOW IS [[Dead]]!!!`,
        `YUM YUM DID YOU WANT SOME MORE INSURANCE?`,
        `YUM YUM. DELICIS KROMER. DID YOU HAVE AN YMORE? `,
        `WHAT!? YOU DOn'T HAVE ENOUGH [Wacky Stacks]!? Kid, you're [Killing] me! HAHAHA!! HAHAHA!!! PLEASE STOP [Killing] ME I WILL GIVE Y OU ANOTHER DEAL.`,
        `DON'T WORRY KIDS I'M AN [HonestMan] I JUST NEED YOUR [Account Details] AND THE [Number on theB4ck]! THEN YOU CAN ENJ0Y 1000 Fr3e KROmer`,
        `YUM YUM DID YOU HAVE ANY MORE ACCOUNTS?`,
        `YUM YUM GREAT DEAL KID!! YOUR A BIGSHOT!! SAVING THE WORLD!!`,
        `WHAT!?!? YOU DON"T NEED IT!?!? THAT'S A REAL BIGSHOT MOVE KID!!! YOU'RE LIKE ME... [Desperate] BUT WE KNOW WHAT WE WANT, DON'T WE!? W1LD PR1ZES, HOTSINGLE, 100 CUSTOMER, AND MOST OF ALL... [Hyperlink Blocked]. WILL YOU TAKE THE FINAL DEAL!? REMEMBER... THIS IS UP TO YOU! I WOn'T FORCE YOU.`,
        `WRONG`,
        `THEN A DEAL'S A DEAL!!! PLEASURE DOING BUSINESS WITH YOU KID!!!`,
        `NOW ON TO THE NEXT STEP... I'LL BE WAITING AT MY [[Home-made Storefront Site]] IN THE [[Trash Area Closed For Repairs.]] COME... ALONE.`,
        `AND DON'T... FORGET! TO [[Like And Subscribe]] FOR MORE [[Hyperlink Blocked.]] HAEAHAEAHAEAHAEAH!!`,
        `HEY!!! DIDN'T YOU EVER HEAR THE PHRASE, [Make Money, Not War]!`,
        `HOW'S AN INNOCENT GUY LIKE ME SUPPOSED TO [Rip People Off] WHEN KIDS LIKE YOU ARE [Beating People Up], [Spitting] IN THEIR EYES, THROWING SAND IN THEIR [Face], [Stomping] ON THEIR TOES, YANKING THEIR [Noses], AND NOT EVEN GIVING THEM A SINGLE CENT FOR IT!?`,
        `YOU SHOULD HAVE DONE ALL THAT EARLIER! AND BEEN THE FIRST TO OWN MY [Commemorative Ring] TOO BAD! SEE YOU KID!`,
        `IT DOESN'T MEAN YOU CAN BEAT ME UP, JUST BECAUSE YOU BOUGHT MY [Commemorative Ring]! AT LEAST BUY [2]! TOO BAD! SEE YOU KID!`,
        `/me DON'T YOU WANNA BE A BIG SHOT?`,
        `/me He wants to make a DEAL, but don't give him your MONEY!`,
        `/me THERE'S NOTHING WRONG WITH HAVING A NICE [Splurge] EVERY ONCE IN A WHILE`,
        `/me There's nothing wrong. There's NOTHING WRONG. THERE'S NOTHING WRONG.`,
        `/me Great ENEMY! SUSCRIBE NOW!`,
        `/me Spamton mutters "1997."`,
        `/me Smells like KROMER.`,
        `/me CONGRULATIONS YOU ARE THE 100th VISITOR!!! CLICK HERE TO [Die]`,
        `/me Spamton flashes an award-losing smile.`,
        `HOLY [[Cungadero]] DO I FEEL GOOD ...`,
        `HERE I AM!! KRIS!! BIG`,
        `BIG,[[BIGGER AND BETTER THAN EVER]]`,
        `HA HA HA ... THIS POWER IS FREEDOM.`,
        `I WON'T HAVE TO BE | JUST A PUPPET | ANY MORE!!!! ... OR... so... I... thought.`,
        `WHAT ARE THESE STRINGS!? | WHY AM I NOT [BIG] ENOUGH!? | It's still DARK... SO DARK!`,
        `KRIS.`,
        `KRIS. | KRIS. | KRIS.`,
        `THAT'S RIGHT. | YOU. | I NEED YOU. TO BE BIG. | WITH ME. VERY    VERY     BIG`,
        `SO BIG WE'LL STAND UP TALL AND SEE PAST THE DARK STAND UP WITH OUR HEADS IN THE CLOUDS AND LOOK INTO H E A V E N`,
        `I | JUST NEED | THAT LITTLE, [[SOUL]] | Y O U HAVE`,
        `KRIS!!! YOU HAVE [Friends]!? WHY DON'T YOU TELL THEM ABOUT MY [3 for One Specil]!`,
        `TODAY, THE WHOLE FAMILY CAN TAKE A LITTLE [Ride Around Town]...`,
        `[Attention Customers! Clean up on Aisle 3!]`,
        `SOMEONE LEFT [There] SOULS, [Lyeing Around......]`,
        `Kris!?!? WAS THAT A [BIG SHOT] JUST NOW!?`,
        `WOW!!! | I'M SO [Proud] OF YOU, I COULD [Killed] YOU!`,
        `[Heaven], are you WATCHING?`,
        `IT'S TIME TO MAKE A VERY [Specil] DEAL...`,
        `KRIS! ISN'T THIS [Body] JUST [Heaven]LY!? 3X THE [Fire]POWER. 2X THE [Water]POWER. AND BEST OF ALL, FLYING [Heads]!`,
        `WE'LL TURN THOSE [Schmoes] AND [Daves] INTO [Rosen Graves] THOSE [Cathode Screens] INTO [Cathode Screams]`,
        `KRIS, DON'T YOU WANNA BE [Part] OF MY BEAUTIFUL [Heart]?! OR... DID YOU NEED A LITTLE [Specil Tour]?`,
        `ALL YOU GOTTA DO IS [Big.] THEN WE'LL BE THE ONES MAKING THE [Calls], KRIS!`,
        `WHAT!? WHAT? ARE YOU SERIOUS!? ... IT'S FOR YOU.`,
        `IT'S CALLING, KRIS... MY [Heart]... MY [Hands]...`,
        `KRIS! CAN YOU REALLY LOOK IN MY [Eyes] AND SAY NO!? LOOK IN MY [Eyes] LOOK IN MY [Nose] LOOK IN MY [Mouth]`,
        `I CAN'T STAND IT!!! I THINK I'M GONNA HAVE A [HeartAttack]!`,
        `[Friends]!? KRIS!? WHAT ARE YOU TALKING ABOUT!? YOU DON'T NEED [Friends]!! I CAN MAKE MY HANDS INTO PHONES!!!`,
        `KRIS, I'LL EVEN GIVE YOU A [Free Value] [Die Now] AND I'LL THROW IN [50] [Bullets] FOR FREE!`,
        `DON'T YOU WANNA HELP YOUR OLD PAL SPAMTON? KRIS!! THINK! WHAT ARE MY [Eggs] GOING TO DO!?`,
        `KRIS. IF YOU GIVE ME THAT [Soul] I WILL GIVE YOU EVERYTHING I HAVE. I WILL GIVE YOU [3 Easy Payments of $9.99!]`,
        `BUT KRIS, IF YOU REFUSE. THAT'S YOUR CHOICE. I CAN'T FORCE YOU. I CAN ONLY [Kill] YOU [50-percent faster than similar products] OR [No Money Back!]`,
        `KRIS!!! TAKE THE DEAL!!! TAKE IT!!! DO YOU WANNA BE A [Heart] ON A [Chain] YOUR WHOLE LIFE!?`,
        `OR... DID YOU WANT TO BE... Did you wanna be... WHAT!? IT'S FOR ME!?`,
        `KRIS... I WON'T FORCE YOU. I CAN'T. I CAN'T FORCE YOU. BUT JUST LOOK, KRIS. LOOK AT THE [Power of NEO] AND ASK YOURSELF... WELL, DON'T YOU? DON'T YOU WANNA BE A [Big Shot]!?`,
        `[Clown]!? NO!!! I FEEL SICK!!!`,
        `[The Smooth Taste Of] NEO`,
        `CAN A [Little Sponge] DO THIS? GO [Ga-Ga] AND [Die]`,
        `DON'T YOU WANNA BE A [Big Shot]!?`,
        `[BreaKing] and [CracKing]`,
        `THE [@$@!] TASTE OF SPAMTON`,
        `WAIT!! [$!?!] THE PRESSES! MY... MY [Wires]... THEY'RE ALMOST [Gone]!? KRIS... YOU... YOU'RE [Gifting] ME MY [Freedom]?!`,
        `KRIS... AFTER EVERYTHING I DID TO YOU...!? AFTER ALL THE [Unforgettable D3als] [Free KROMER] I GAVE YOU YOU'RE FINALLY REPAYING MY [Genorisity]!?`,
        `KRIS!!! I UNDERSTAND NOW!! THE GREATEST DEAL OF ALL!!! [Friendship]!!!`,
        `KRIS!!! MY DAYS AS A [Long-Nosed Doll] ARE OVER!!! CUT THAT [Wire] AND MAKE ME A [Real Boy]!!`,
        `ARE YOU WATCHING, [Heaven]!? IT'S TIME FOR SPAMTON'S [Comeback Special]! AND THIS TIME... I LIVE FOR MYSELF!!! NO... MYSELF AND MY [Friend(s)]!!! HERE I GO!!!! WATCH ME FLY, [MAMA]!!!!`,
        `WAIT!! [$!?!] THE PRESSES! HAHAHA... KRIS!!! YOU THINK DEPLETING MY [8000 Life Points] MEANS YOU'VE WON [A Free Meal] TO [Winning]?!`,
        `NO!!! NO!!! NE-O!! KRIS!! YOUR [Deal] HAS FAILED!! [NEO] NEVER LOSES!! THIS IS [Victory Smoke]!! IT MEANS IT'S TIME FOR MY [Second Form]!`,
        `ARE YOU READY KRIS!? FOR MY [Next Trick]! I WILL FILL MY [Body] WITH [Electricaty] AND BECOME SPAMTON [EX]!`,
        `ARE YOU READY [Kids]!? [Turn up the JUICE!] [Turn up the JUICE!] [Make Sure You Don't Get It On Your Shoese!]`,
        `ARE YOU GETTING ALL THIS [Mike]!? I'M FINALLY I'M FINALLY GONNA BE A BIG SHOT!!! HERE I GO!!!! WATCH ME FLY, [MAMA]!!!!`,
        `It seems after all I couldn't be anything more than a simple puppet. But you three... You're strong. With a power like that... Maybe you three can break your own strings. Let me become your strength.`,
        `… Kris…? Kris!? KRIS!?!?!? YOU FILLED YOUR [Inventorium] WITH [Half-Pr1ce Sallamy] JUST TO KEEP ME OUT!? WHAT! THE! [Fifty Percent Off]!?`,
        `YOU CAN CARRY LIKE 48 ITEMS!!! [Why] DID YOU DO THIS!? WHY!? [Y]!? [Yellow]!? [Gamma]!? NOT [Cool] KRIS! I'LL BE IN MY [Trailer]!`,
        `/me (It was as if your very SOUL was glowing...)`,
        `NOT!!! LET ME SAY`,
        `LET ME SAY [Thanks ] THANKS TO YOUR [Total Jackass stunts] I HAVE [Becomed] NEO.`,
        `AND NOW IT'S MY [Mansion]! MY [City] MY [World]!`,
        `SO WHY ARE YOU [Stealing] THE [Fountain]!? TO [$!$!] ME OVER RIGHT AT THE [Good part]!? WHAT ARE YOU, A [Gameshow Host]!?`,
        `AH, KID, FORGET IT. I'M AN [HonestMan].`,
        `I'LL LET YOU [Pay] YOUR WAY OUT OF THIS ONE!!`,
        `[Pay]... WITH YOUR [Rapidly-Shrinking] LIFE!!!`,
        `I REMEMBER WHEN YOU WERE JUST A LOST [Little Sponge]. SLEEPING AT THE BOTTOM OF A DUMPSTER!`,
        `I GAVE YOU EVERYTHING I HAD! MY LIFE ADVICE! I TOLD YOU [4 Left] AND ASKED YOU [Buy] OR [Don't Buy]!`,
        `I GAVE YOU MY [Commemorative Ring] FOR THE PRICE OF [My Favorite Year]!`,
        `AND THIS IS HOW YOU [Repay] ME!? TREATING ME LIKE [DLC]!?`,
        `WHAT!? WHAT? ARE YOU SERIOUS!? ... IT'S FOR YOU.`,
        `NO, I GET IT! IT'S YOU AND THAT [Hochi Mama]! YOU'VE BEEN [Making], HAVEN'T YOU!`,
        `YOU'VE BEEN MAKING [Hyperlink Blocked]! AND NOW THAT YOU HAVE YOUR OWN SUPPLY, YOU DON'T NEED ME!!!`,
        `I WAS TOO [Trusting] TOO [Honest]. I'VE ALWAYS BEEN A MAN OF THE [PIPIS]. A REAL [PIPIS] PERSON!`,
        `I SHOULD HAVE KNOWN YOU WOULD HAVE USED MY [Ring] FOR [Evil]... OH, [Right]. THAT'S WHY I SOLD IT TO YOU`,
        `YOU THINK MAKING [Frozen Chicken] WITH YOUR [Side Chick] IS GONNA LET YOU DRINK UP THAT [Sweet, Sweet] [Freedom Sauce]?`,
        `WELL, YOU'RE [$!$!] RIGHT! BUT DON'T BLAME ME WHEN YOU'RE [Crying] IN A [Broken Home] WISHING YOU LET YOUR OLD PAL SPAMTON [Kill You]`,
        `MY ESTEEM CUSTOMER I SEE YOU ARE ATTEMPTING TO DEPLETE MY HP!`,
        `I'LL ADMIT YOU'VE GOT SOME [Guts] KID! BUT IN A [1 for 1] BATTLE, NEO NEVER LOSES!!!`,
        `IT'S TIME FOR A LITTLE [Bluelight Specil]. DIDN'T YOU KNOW [Neo] IS FAMOUS FOR ITS HIGH DEFENSE!? NOW... ENJ0Y THE FIR3WORKS, KID!!!`,
        `ENJOY THE FIREWORKS, KID!!!!`,
        `WHAT!? YOU'RE CALLING FRIENDS!? YOU THINK YOU CAN BEAT ME WITH YOUR FRIENDS' [Magic]!?`,
        `GO AHEAD, [Kid]... CALL ALL YOU WANT! NO ONE WILL EVER PICK UP`,
        `GO AHEAD AND [Scream] INTO THE [Receiver]. THE [Voice] RUNS OUT EVENTUALLY. YOUR [Voice] THEIR [Voice]. UNTIL YOU REALIZE YOU ARE ALL ALONE`,
        `THERE WILL BE NO MORE [Miracles] NO MORE [Magic]. YOU LOST IT WHEN YOU TRIED TO SEE TOO FAR.... ... YOU LOST IT...`,
        `YOU MAKE ME [Sick]! MUTTERING YOUR [Lost Friends] NAMES AT THE BOTTOM OF A [Dumpster]! NO ONE'S GONNA HELP YOU!!! GET THAT THROUGH YOUR [Beautiful Head], YOU LITTLE [Worm]!`,
        `… HER? YOU'RE STILL TRYING TO [Use] HER!? HA HA HA HA!!! YOU THINK SHE CAN [Hear] YOU NOW, MUTTERING HER NAME!? WHAT'S SHE GONNA DO, MAKE ME AN [Ice Cream]!?`,
        `HEY, IS IT COLD IN HERE OR IS IT JUST ME?`
    ]
    const idx = Number(num) - 1
    if (idx >= 0 && idx < quotes.length && Number.isInteger(idx)) {
        return quotes[idx]
    } else {
        return quotes[Math.floor(Math.random() * quotes.length)]
    }
}

function getThirdPersonFlavorText() {
    const actions = [
        ` prepares a magical attack.`,
        ` takes a deep breath.`,
        ` is acting aloof.`,
        ` is trying hard to play it cool.`,
        ` whispers "Nyeh heh heh!"`,
        ` is preparing a bone attack.`,
        ` is cackling.`,
        ` prepares a non-bone attack then spends a minute fixing their mistake.`,
        ` is rattling their bones.`,
        ` remembered a bad joke JPEGSTRIPES told and is frowning.`,
        ` is considering their options.`,
        ` is thinking about what to wear for their date.`,
        ` is thinking about what to cook for their date.`,
        ` dabs some Bone Cologne behind their ear.`,
        ` dabs marinara sauce behind their ear.`,
        ` dabs MTT-Brand Bishie Cream behind their ear.`,
        ` dabs MTT-Brand Anime Powder behind their ear.`,
        ` dabs MTT-Brand Cute Juice behind their ear.`,
        ` dabs MTT-Brand Attraction Slime behind their ear.`,
        ` dabs MTT-Brand Beauty Yogurt behind their ear.`,
        ` flips their spear impatiently.`,
        ` points heroically towards the sky.`,
        ` flashes a menacing smile.`,
        ` draws their finger across their neck.`,
        ` bounces impatiently.`,
        ` suplexes a large boulder, just because they can.`,
        ` thinks of their friends and pounds the ground with their fists.`,
        ` holds their fist in front of themself and shakes their head.`,
        ` towers threateningly.`,
        ` is hyperventilating.`,
        ` is smashing spears on the ground.`,
        `'s eye is twitching involuntarily.`,
        `'s eyes dart around to see if this is a prank.`,
        ` stands around absentmindedly.`,
        ` looks like they're about to fall over.`,
        ` hops to and fro.`,
        ` doesn't seem to know why they're here.`,
        ` avoids eye contact.`,
        ` is fluttering.`,
        ` gnashes their teeth.`,
        ` cackles softly.`,
        ` gave a mysterious smile.`,
        ` waits pensively.`,
        ` burbles quietly.`,
        ` is ruminating.`,
        ` is wishing they weren't here.`,
        ` is staring into the distance.`,
        ` is pretending to sleep.`,
        ` cocks their head to one side.`,
        ` is really not paying attention.`,
        ` is chanting an anarchist spell.`,
        ` is eating their own homework.`,
        ` is on the warpath.`,
        ` does fancy flips.`,
        ` sees their reflection and gets jealous.`,
        ` lets out a yawn.`,
        ` tells everyone they have to go to the bathroom.`,
        ` sneezes without covering their nose.`,
        ` is admiring their own muscles.`,
        ` is friends with a little bird.`,
        ` wonders if tears are sanitary.`,
        ` is rinsing off a pizza.`,
        ` is looking for some good clean fun.`,
        ` is very normal.`,
        ` is having quiet time.`,
        ` sits motionless.`,
        ` gyrates reservedly.`,
        ` mills about in the corner.`,
        ` needs some distance.`,
        ` thinks about doing karaoke by themself.`,
        ` hums very faintly.`,
        ` pretends to be a pop idol.`,
        ` is looking nervous.`,
        ` is doing an armless ska dance.`,
        ` is hopping mad.`,
        ` stands around absentmindedly.`,
        ` forgot their other attack.`,
        ` vibrates intensely.`,
        ` makes a smoke hoop and jumps through it.`,
        ` looks over, then turns up their nose.`,
        ` is pretending to pull the fire alarm.`,
        ` is chuckling through their teeth.`,
        ` is pretending to be a candle.`,
        ` is protected by their winsome smile.`,
        ` looks nervous.`,
        ` looks anxious.`,
        ` looks perturbed.`,
        ` taps their fingers together like jackhammers.`,
        ` uses a hypnotizing 3D-tush-wiggle attack.`,
        ` is polishing their face.`,
        ` stands guard.`,
        ` knows exactly why they're here.`,
        ` jumps ominously up and down.`,
        ` spins their weapon around.`,
        ` shakes their head dismissively.`,
        ` flutters silently.`,
        ` clicks their teeth.`,
        ` has gone bloodshot.`,
        ` whispers arcane swear words.`,
        ` does a mysterious jig.`,
        ` flaunts their orbs in a menacing manner.`,
        ` watches quietly.`,
        `'s armor emits a dark sheen.`,
        ` smashes their morningstar.`,
        ` breathes deeply.`,
        ` completely closes their mouth. They look short and weird.`,
        ` has a hissy fit.`,
        ` makes a balloon animal out of bees. Shape: Pile of bees.`,
        ` is juggling balls of ants.`,
        ` intentionally pratfalls. Twenty times.`
    ]
    return actions[Math.floor(Math.random() * actions.length)]
}

function getAction(user, target) {
    const randGold = Math.ceil(Math.random() * 10) * 5
    const actions = [
        ` and the others celebrate ${target}'s disappearance.`,
        ` and the others ditch ${target} when they look away!`,
        ` asks ${target} about their day.`,
        ` asks ${target} about their day. There's no response.`,
        ` asks ${target} to clean them. ${target} hops around excitedly.`,
        ` attempts to touch ${target}'s armor. Their hands slip off.`,
        ` boos ${target}.`,
        ` boos loudly. ${target} leaves to look elsewhere for praise.`,
        ` boos... but haters only make ${target} stronger. ${target} ATTACK UP+DEFENSE DOWN.`,
        ` calls ${target}. ${target} bounds toward them, flecking slobber into ${user}'s face.`,
        ` claps like a gorilla. ${target} is becoming addicted to their praise.`,
        ` claps really sloppily. ${target} sucks up their praise like a vacuum cleaner.`,
        ` cleans ${target}'s armor. Its cooling dirt begins to wash away.`,
        ` compliments ${target}. They understood them perfectly. ${target}'s ATTACK dropped.`,
        ` cranks up the thermostat. ${target} begins to get excited.`,
        ` cranks up the thermostat. It's super hot! ${target} looks satisfied.`,
        ` did something mysterious. ${target} recognizes they have more to learn from this world.`,
        ` does nothing. ${target} leaves to look elsewhere for praise.`,
        ` does nothing. ${target} looks desperate for attention.`,
        ` does nothing. ${target} looks disappointed they aren't paying attention.`,
        ` doesn't hug ${target}. They appreciate their respect of their boundaries.`,
        ` doesn't pick on ${target}.`,
        ` flexes. ${target} flexes twice as hard. ATTACK increases for both of them.`,
        ` flexes. ${target} flexes very hard... They flex themself out of the room!`,
        ` gave ${target} a patient smile.`,
        ` gets close to ${target}. But not too close.`,
        ` gives ${target} a cruel look.`,
        ` gives ${target} a friendly pat.`,
        ` hugs ${target}. Gross slime covers them. ${user}'s SPEED decreased.`,
        ` ignores ${target} and thinks of pollen and sunshine. ${user}'s DEFENSE increased by 1.`,
        ` informs ${target} that they have a great hat!`,
        ` invites ${target} to hang out.`,
        ` kneels and prays for safety. ${target} remembers their conscience.`,
        ` laughs at ${target} before they say anything funny.`,
        ` lies down. ${target} lies down too. ${target} understands life now.`,
        ` lies immobile with ${target}. They feel like they understand the world a little better.`,
        ` makes fun of ${target}.`,
        ` manages to tear their eyes away from ${target}'s hat. They look annoyed...`,
        ` pats ${target}'s chest like a muscular bongo.`,
        ` pats their stomach. ${target} offers a healthy meal.`,
        ` pays ${randGold} G. ${target} reduces their ATTACK for this turn!`,
        ` pets ${target}. Their excitement knows no bounds.`,
        ` pets the ${target}. They start to generate a Stage I Happiness Froth.`,
        ` picks on ${target}.`,
        ` presses the yellow button. The phone is resonating with ${target}'s presence!`,
        ` raises their arms and wiggles their fingers. ${target} freaks out!`,
        ` reaches out. ${target} recoils from their touch.`,
        ` says hello to ${target}.`,
        ` sings an old lullaby. ${target} starts to look sleepy...`,
        ` stands up to ${target}.`,
        ` talks to ${target}. ...They don't seem much for conversation. No one is happy with this.`,
        ` talks to ${target}... They don't seem much for conversation. JPEGSTRIPES seems happy with ${user}.`,
        ` tells ${target} that no one will ever love them the way they are... They struggle to make a retort, and slink away utterly crushed...`,
        ` tells ${target} that their attacks are NOT helpful.`,
        ` tells ${target} that their rump looks like a sack of trash.`,
        ` tells ${target} that there's a mirror behind them.`,
        ` tells ${target} that they aren't funny.`,
        ` tells ${target} their attacks are too easy. The bullets get faster.`,
        ` tells ${target} their attacks are too easy. The bullets get unfair.`,
        ` tells ${target} their attacks are too easy. They don't care.`,
        ` tells ${target} their favorite secret.`,
        ` tells ${target} they have a powerful rudder.`,
        ` tells ${target} they have an impressive wingspan.`,
        ` tells ${target} they have cute winglets.`,
        ` tells ${target} they have nice turbines.`,
        ` tells ${target} they like their taste in movies and books.`,
        ` tells ${target} they're all wrong.`,
        ` tells ${target} they're doing a great job. Their attacks become extreme...`,
        ` tells ${target} to be honest with their feelings.`,
        ` tells ${target} to go away.`,
        ` threatens ${target}. They understood them perfectly. ${target}'s DEFENSE dropped.`,
        ` threw the stick and ${target} ran to get it. They played fetch for a while.`,
        ` throws the stick. ${target} brings it back in their mouth.`,
        ` told ${target} a little joke.`,
        ` told ${target} they didn't want to fight. But nothing happened.`,
        ` told ${target} they just want to be friends. They remember someone... ${target}'s attacks became a little less extreme.`,
        ` took a bite out of ${target}. They recovered 5 HP!`,
        ` tried to eat ${target}, but they weren't weakened enough.`,
        ` tries to console ${target}...`,
        ` wiggles their hips. ${target} wiggles back. What a meaningful conversation!`
    ]

    // If user paid the target gold
    const randAction = Math.floor(Math.random() * actions.length)
    if (randAction === 40) {
        const senderGold = players[user.toLowerCase()][`gold`]
        const differenceInGold = senderGold - randGold
        console.log(`randGold: ${randGold}, senderGold: ${senderGold}, differenceInGold: ${differenceInGold}`)
        if (senderGold <= 0) {
            return `is out of money. ${target} shakes their head.`
        } else if (differenceInGold < 0) {
            players[target.toLowerCase()][`gold`] += senderGold
            players[user.toLowerCase()][`gold`] = 0
            return `empties their pockets. ${target} lowers the price.`
        } else {
            players[user.toLowerCase()][`gold`] -= randGold
            players[target.toLowerCase()][`gold`] += randGold
        }
    }
    return actions[randAction]
}

function stainedApronHealToggle(user) {
    const player = players[user.toLowerCase()]

    // If it's time to heal, toggle and return original state
    player[`stainedApronHealTime`] = !player[`stainedApronHealTime`]
    return !player[`stainedApronHealTime`]
}

function deathCheck(chatroom, user, target) {
    const sendingPlayer = players[user.toLowerCase()]
    const targetPlayer = players[target.toLowerCase()]
    const targetSaveData = playerSave[target.toLowerCase()]
    console.log(`${sendingPlayer[`hp`] <= 0 ? redBg : greenBg} user: ${user} ${sendingPlayer[`hp`]}/${getUserMaxHP(user)} HP ${resetTxt} ${targetPlayer[`hp`] <= 0 ? redBg : greenBg} target: ${target} ${targetPlayer[`hp`]}/${getUserMaxHP(target)} HP ${resetTxt}`)

    const deathText = [
        `The future of monsters depends on you!`,
        `Don't lose hope!`,
        `You cannot give up just yet...`,
        `Our fate rests upon you...`,
        `It cannot end now!`,
        `You're going to be alright!`
    ]

    if (targetPlayer[`hp`] <= 0) {
        // Building death response
        let response = `* `
        response += deathText[Math.floor(Math.random() * deathText.length)]
        response += ` ${target}! Stay determined... `

        // Checking if user killed a different user
        if (user !== target) {
            // Appending awarded EXP
            const awardedEXP = 10 + targetPlayer[`exp`]
            response += `${user} earned ${awardedEXP} EXP`

            // Appending awarded gold
            const randGold = Math.ceil(Math.random() * 100)
            sendingPlayer[`gold`] += randGold
            if (targetPlayer[`gold`] > 0) {
                sendingPlayer[`gold`] += targetPlayer[`gold`]
                targetPlayer[`gold`] = 0
                response += `, got ${target}'s gold, and found ${randGold} G.`
            } else {
                response += ` and ${randGold} gold.`
            }

            // Resetting target's EXP and Gold in SAVE data, because it was taken by another user, and would otherwise be duplicated if/when they LOAD
            targetSaveData[`lv`] = 1
            if (targetSaveData[`hp`] > 20) { targetSaveData[`hp`] = 20 }
            targetSaveData[`at`] = 0
            targetSaveData[`df`] = 0
            targetSaveData[`exp`] = 0
            targetSaveData[`next`] = 10
            targetSaveData[`gold`] = 0

            // Checking for LV threshold
            sendingPlayer[`exp`] += awardedEXP
            sendingPlayer[`next`] -= awardedEXP
            if (sendingPlayer[`next`] <= 0) {
                response += ` ${user}'s LOVE increased.`
                response += calculateUserLV(user)
            }
        } else {
            if (sendingPlayer[`gold`] > 0) {
                sendingPlayer[`gold`] = 0
                response += ` ${user} lost all their gold!`
            }
        }

        // Resetting target user's stats
        targetPlayer[`dead`] = true
        targetPlayer[`hp`] = 0
        targetPlayer[`lv`] = 1
        targetPlayer[`exp`] = 0
        targetPlayer[`next`] = 10
        targetPlayer[`at`] = 0
        targetPlayer[`df`] = 0

        const msgDelay = chatroom === `#undertalebot` ? 1000 : 2000
        setTimeout(function () {
            client.say(chatroom, response)
            console.log(`${yellowBg}${chatroom} ${resetTxt}`, `${yellowTxt}UndertaleBot: ${response}${resetTxt}`)
        }, msgDelay)
    }
}

function getToUser(str) {
    if (str.startsWith(`@`)) {
        return str.substring(1)
    } else {
        return str
    }
}

function getUserMaxHP(user) {
    const userLV = players[user.toLowerCase()][`lv`]
    let maxHP = baseHP + (4 * userLV)
    if (userLV >= 20) { maxHP = 99 }
    return maxHP
}

function calculateUserATK(user) {
    const userLV = players[user.toLowerCase()][`lv`]
    let attack = baseAT + (2 * userLV)
    if (userLV >= 20) { attack = 38 }
    return attack
}

function calculateUserDEF(user) {
    const userLV = players[user.toLowerCase()][`lv`]
    let defense = Math.floor((userLV - 1) * baseDF)
    if (userLV >= 20) { defense = 4 }
    return defense
}

function calculateUserNextLV(user) {
    const userLV = players[user.toLowerCase()][`lv`]

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

function calculateUserLV(user) {
    const player = players[user.toLowerCase()]
    let foundItemsAppend = ``
    let collectedItems = []
    while (player[`next`] <= 0) {
        player[`lv`] += 1
        if (player[`lv`] === 2) { collectedItems.push(`Snowman Piece`, `Toy Knife`, `Faded Ribbon`) }
        if (player[`lv`] === 3) { collectedItems.push(`Astronaut Food`, `Ballet Shoes`, `Old Tutu`) }
        if (player[`lv`] === 4) { collectedItems.push(`Abandoned Quiche`, `Burnt Pan`, `Stained Apron`) }
        if (player[`lv`] === 5) { collectedItems.push(`Instant Noodles`) }
        if (player[`lv`] === 6) { collectedItems.push(`Hush Puppy`) }
        if (player[`lv`] === 7) { collectedItems.push(`Worn Dagger`, `Heart Locket`) }
        if (player[`lv`] === 8) { collectedItems.push(`Bad Memory`) }
        if (player[`lv`] === 9) { collectedItems.push(`Last Dream`) }
        if (player[`lv`] === 10) { collectedItems.push(`Real Knife`, `The Locket`) }
        if (player[`lv`] === 11) { collectedItems.push(`Puppydough Icecream`) }
        if (player[`lv`] === 12) { collectedItems.push(`Pumpkin Rings`) }
        if (player[`lv`] === 13) { collectedItems.push(`Croquet Roll`) }
        if (player[`lv`] === 14) { collectedItems.push(`Ghost Fruit`) }
        if (player[`lv`] === 15) { collectedItems.push(`Stoic Onion`) }
        if (player[`lv`] === 16) { collectedItems.push(`Rock Candy`) }
        player[`next`] += calculateUserNextLV(user)
        player[`at`] = calculateUserATK(user)
        player[`df`] = calculateUserDEF(user)
        player[`hp`] += 4
    }
    if (collectedItems.length) {
        for (const idx in collectedItems) { player[`inventory`].push(collectedItems[idx]) }
        foundItemsAppend = ` ${user} found: ` + collectedItems
    }
    console.log(`${cyanBg} ${user} reached LV ${player[`lv`]}, next: ${player[`next`]}, ATK: ${player[`at`]}, DEF: ${player[`df`]}, HP: ${player[`hp`]} / ${getUserMaxHP(user)} ${resetTxt}`)
    console.log(`Inventory:`, player[`inventory`])
    return foundItemsAppend
}

function printLogo() {
    const whSq = `\x1b[47m  \x1b[0m`
    const gySq = `\x1b[100m  \x1b[0m`
    const rdSq = `\x1b[41m  \x1b[0m`
    const bkSq = `\x1b[40m  \x1b[0m`

    // Colored text
    console.log(`${orangeTxt}Bravery.${resetTxt}`, `${yellowTxt}Justice.${resetTxt}`, `${blueTxt}Integrity.${resetTxt}`, `${greenTxt}Kindness.${resetTxt}`, `${magentaTxt}Perseverance.${resetTxt}`, `${cyanTxt}Patience.${resetTxt}`)

    // UNDERTALE logo
    //          U (10 blocks wide)                                                           N (10 blocks wide)                                                           D (9 blocks wide)                                                     E (8 blocks wide)                                              R (10 blocks wide)                                                           T (10 blocks wide)                                                           A (9 blocks wide)                                                     L (8 blocks wide)                                              E (8 blocks wide)
    console.log(gySq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + gySq + bkSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + gySq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // [ 1 ]
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + gySq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // [ 2 ]
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + gySq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + rdSq + whSq + rdSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // [ 3 ]
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + rdSq + rdSq + rdSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq) // [ 4 ]
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + gySq + bkSq + whSq + whSq + whSq + whSq + whSq + rdSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + gySq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + gySq) // [ 5 ]
    console.log(whSq + whSq + whSq + whSq + bkSq + gySq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + gySq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq) // [ 6 ]
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + gySq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + gySq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // [ 7 ]
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + gySq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // [ 8 ]
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + gySq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // [ 9 ]
    //          [  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][ 10  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][ 10  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][ 10  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][ 10  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][  9  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][  8  ][space][  1  ][  2  ][  3  ][  4  ][  5  ][  6  ][  7  ][ 8 ]

    // List of basic commands
    console.log(`${redBg} !fight ${resetTxt}`, `${redTxt}- Choose another chat member to attack${resetTxt}`)
    console.log(`${orangeBg} !act ${resetTxt}`, `${orangeTxt}  - Do an action by yourself or with another chat member${resetTxt}`)
    console.log(`${yellowBg} !item ${resetTxt}`, `${yellowTxt} - Check for (or use) items in your inventory${resetTxt}`)
    console.log(`${blueBg} !mercy ${resetTxt}`, `${blueTxt}- Choose another chat member to spare${resetTxt}`)
    console.log(`${greenBg} !buy ${resetTxt}`, `${greenTxt}- Spend gold on items, or check what is possible to buy${resetTxt}`)
    console.log(`${magentaBg} !save ${resetTxt}`, `${magentaTxt} - Use determination to save your current state${resetTxt}`)
    console.log(`${cyanBg} !load ${resetTxt}`, `${cyanTxt} - Reload your previous save file${resetTxt}`)
}

function buyItem(user, str, price) {
    const player = players[user.toLowerCase()]

    const itemLvThreshold = {
        // Consumable items
        "spider donut": 1,
        "spider cider": 1,
        "nice cream": 2,
        "bisicle": 2,
        "cinnamon bunny": 2,
        "crab apple": 3,
        "sea tea": 3,
        "temmie flakes": 3,
        "hot dog": 4,
        "hot cat": 4,
        "junk food": 5,
        "starfait": 5,
        "glamburger": 5,
        "legendary hero": 5,
        "steak in the shape of mettaton's face": 5,
        "popato chisps": 6,

        // Weapons
        "tough glove": 2,
        "torn notebook": 3,
        "empty gun": 5,

        // Armor
        "manly bandanna": 2,
        "cloudy glasses": 3,
        "temmie armor": 4,
        "cowboy hat": 5
    }

    if (player[`lv`] < itemLvThreshold[str]) { return `${user}, that item isn't available to you yet! :(` }

    if (player[`gold`] < price) { return `${user}, that item costs ${price}G, you have ${player[`gold`]}G! :(` }

    if (str === `spider donut`) {
        player[`gold`] -= price
        player[`inventory`].push(`Spider Donut`)
        return `* ${user} bought the Spider Donut!`
    }
    if (str === `spider cider`) {
        player[`gold`] -= price
        player[`inventory`].push(`Spider Cider`)
        return `* ${user} bought the Spider Cider!`
    }
    if (str === `nice cream`) {
        player[`gold`] -= price
        player[`inventory`].push(`Nice Cream`)
        return `* ${user} bought the Nice Cream!`
    }
    if (str === `bisicle`) {
        player[`gold`] -= price
        player[`inventory`].push(`Bisicle`)
        return `* ${user} bought the Bisicle!`
    }
    if (str === `cinnamon bunny`) {
        player[`gold`] -= price
        player[`inventory`].push(`Cinnamon Bunny`)
        return `* ${user} bought the Cinnamon Bunny!`
    }
    if (str === `tough glove`) {
        player[`gold`] -= price
        player[`inventory`].push(`Tough Glove`)
        return `* ${user} bought the Tough Glove!`
    }
    if (str === `manly bandanna`) {
        player[`gold`] -= price
        player[`inventory`].push(`Manly Bandanna`)
        return `* ${user} bought the Manly Bandanna!`
    }
    if (str === `crab apple`) {
        player[`gold`] -= price
        player[`inventory`].push(`Crab Apple`)
        return `* ${user} bought the Crab Apple!`
    }
    if (str === `sea tea`) {
        player[`gold`] -= price
        player[`inventory`].push(`Sea Tea`)
        return `* ${user} bought the Sea Tea!`
    }
    if (str === `temmie flakes`) {
        player[`gold`] -= price
        player[`inventory`].push(`Temmie Flakes`)
        return `* ${user} bought the Temmie Flakes!`
    }
    if (str === `torn notebook`) {
        player[`gold`] -= price
        player[`inventory`].push(`Torn Notebook`)
        return `* ${user} bought the Torn Notebook!`
    }
    if (str === `cloudy glasses`) {
        player[`gold`] -= price
        player[`inventory`].push(`Cloudy Glasses`)
        return `* ${user} bought the Cloudy Glasses!`
    }
    if (str === `temmie armor`) {
        player[`gold`] -= price
        player[`inventory`].push(`Temmie Armor`)
        return `* ${user} bought the Temmie Armor!`
    }
    if (str === `hot dog`) {
        player[`gold`] -= price
        player[`inventory`].push(`Hot Dog...?`)
        return `* ${user} bought the Hot Dog...?!`
    }
    if (str === `hot cat`) {
        player[`gold`] -= price
        player[`inventory`].push(`Hot Cat`)
        return `* ${user} bought the Hot Cat!`
    }
    if (str === `junk food`) {
        player[`gold`] -= price
        player[`inventory`].push(`Junk Food`)
        return `* ${user} bought the Junk Food!`
    }
    if (str === `starfait`) {
        player[`gold`] -= price
        player[`inventory`].push(`Starfait`)
        return `* ${user} bought the Starfait!`
    }
    if (str === `glamburger`) {
        player[`gold`] -= price
        player[`inventory`].push(`Glamburger`)
        return `* ${user} bought the Glamburger!`
    }
    if (str === `legendary hero`) {
        player[`gold`] -= price
        player[`inventory`].push(`Legendary Hero`)
        return `* ${user} bought the Legendary Hero!`
    }
    if (str === `steak in the shape of mettaton's face`) {
        player[`gold`] -= price
        player[`inventory`].push(`Steak in the Shape of Mettaton's Face`)
        return `* ${user} bought the Steak in the Shape of Mettaton's Face!`
    }
    if (str === `empty gun`) {
        player[`gold`] -= price
        player[`inventory`].push(`Empty Gun`)
        return `* ${user} bought the Empty Gun!`
    }
    if (str === `cowboy hat`) {
        player[`gold`] -= price
        player[`inventory`].push(`Cowboy Hat`)
        return `* ${user} bought the Cowboy Hat!`
    }
    if (str === `popato chisps`) {
        player[`gold`] -= price
        player[`inventory`].push(`Popato Chisps`)
        return `* ${user} bought the Popato Chisps!`
    }
    return `If you are reading this, I messed up somehow.`
}

function useItem(user, str, idx) {
    const consumableItems = {
        "bandage": 10,
        "monster candy": 10,
        "spider donut": 12,
        "spider cider": 24,
        "butterscotch pie": 99,
        "snail pie": 98,
        "snowman piece": 45,
        "nice cream": 15,
        "bisicle": 11,
        "unisicle": 11,
        "cinnamon bunny": 22,
        "astronaut food": 21,
        "crab apple": 18,
        "sea tea": 10,
        "abandoned quiche": 34,
        "temmie flakes": 2,
        "dog salad": 2,
        "instant noodles": 4,
        "hot dog": 20,
        "hot cat": 21,
        "junk food": 17,
        "hush puppy": 65,
        "starfait": 14,
        "glamburger": 27,
        "legendary hero": 40,
        "steak in the shape of mettaton's face": 60,
        "popato chisps": 13,
        "bad memory": -1,
        "last dream": 17,

        // Unused items
        "puppydough icecream": 28,
        "pumpkin rings": 8,
        "croquet roll": 15,
        "ghost fruit": 16,
        "stoic onion": 5,
        "rock candy": 1
    }
    const player = players[user.toLowerCase()]
    let healAmt = consumableItems[str]
    const burntPanBonus = player[`weapon`] === `Burnt Pan` ? 4 : 0
    if (burntPanBonus > 0) { console.log(`${magentaBg} ${user} is using the Burnt Pan, heal amount +${burntPanBonus} ${resetTxt}`) }

    // Consumable items
    if (str === `bandage`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const bandageText = [
            `* ${user} re-applied the used Bandage. Still kind of gooey.`,
            `* ${user} re-applied the gross Bandage. Still kind of gooey.`,
            `* ${user} re-applied their old, used Bandage. Still kind of gooey.`,
            `* ${user} re-applied the dirty Bandage. Still kind of gooey.`,
            `* ${user} re-applied the well-used Bandage. Still kind of gooey.`
        ]
        const randIdx = Math.floor(Math.random() * bandageText.length)
        let itemText = bandageText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `monster candy`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const monstercandyText = [
            `* ${user} ate a Monster Candy. Very un-licorice-like.`,
            `* ${user} ate a Monster Candy. ...tastes like licorice.`
        ]
        const randIdx = Math.floor(Math.random() * monstercandyText.length)
        let itemText = monstercandyText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `spider donut`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const spiderdonutText = [
            `* ${user} ate a Spider Donut.`,
            `* ${user} ate a Spider Donut. Made with Spider Cider in the batter.`
        ]
        const randIdx = Math.floor(Math.random() * spiderdonutText.length)
        let itemText = spiderdonutText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `spider cider`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const spiderciderText = [
            `* ${user} drank a Spider Cider.`,
            `* ${user} drank a Spider Cider. Made with whole spiders, not just the juice.`
        ]
        const randIdx = Math.floor(Math.random() * spiderciderText.length)
        let itemText = spiderciderText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `butterscotch pie`) {
        player[`inventory`].splice(idx, 1)
        player[`hp`] = getUserMaxHP(user)
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ALL ${resetTxt}`)
        return `* ${user} ate the Butterscotch-Cinnamon Pie. ${user}'s HP was maxed out.`
    }
    if (str === `snail pie`) {
        player[`inventory`].splice(idx, 1)
        player[`hp`] = getUserMaxHP(user) - 1
        const snailpieText = [
            `* ${user} ate the Snail Pie. ${user}'s HP was maxed out.`,
            `* ${user} ate the Snail Pie. It's an acquired taste. ${user}'s HP was maxed out.`
        ]
        const randIdx = Math.floor(Math.random() * snailpieText.length)
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ALL - 1 ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return snailpieText[randIdx]
    }
    if (str === `snowman piece`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const snowmanpieceText = [
            `* ${user} ate a Snowman Piece.`,
            `* ${user} ate a Snowman Piece.`,
            `* ${user} ate a Snowman Piece.`,
            `* ${user} ate a Snowman Piece.`,
            `* ${user} ate a Snowman Piece in front of the Snowman it came from.`
        ]
        const randIdx = Math.floor(Math.random() * snowmanpieceText.length)
        let itemText = snowmanpieceText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `nice cream`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const nicecreamText = [
            `* ${user} ate a Nice Cream. You're super spiffy!`,
            `* ${user} ate a Nice Cream. Are those claws natural?`,
            `* ${user} ate a Nice Cream. Love yourself! I love you!`,
            `* ${user} ate a Nice Cream. You look nice today!`,
            `* ${user} ate a Nice Cream. (An illustration of a hug)`,
            `* ${user} ate a Nice Cream. Have a wonderful day!`,
            `* ${user} ate a Nice Cream. Is this as sweet as you?`,
            `* ${user} ate a Nice Cream. You're just great!`
        ]
        const randIdx = Math.floor(Math.random() * nicecreamText.length)
        let itemText = nicecreamText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `bisicle`) {
        player[`inventory`][idx] = `Unisicle`
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const bisicleText = [
            `* ${user} eats one half of the Bisicle.`,
            `* ${user} eats one half of the Bisicle. It is now a Unisicle.`
        ]
        const randIdx = Math.floor(Math.random() * bisicleText.length)
        let itemText = bisicleText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `unisicle`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const unisicleText = [
            `* ${user} ate a Unisicle.`,
            `* ${user} ate a Unisicle. It's a SINGLE-pronged popsicle. Wait, that's just normal...`
        ]
        const randIdx = Math.floor(Math.random() * unisicleText.length)
        let itemText = unisicleText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `cinnamon bunny`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const cinnamonbunnyText = [
            `* ${user} ate a Cinnamon Bunny.`,
            `* ${user} ate a Cinnamon Bunny. A cinnamon roll in a shape of a bunny.`
        ]
        const randIdx = Math.floor(Math.random() * cinnamonbunnyText.length)
        let itemText = cinnamonbunnyText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `astronaut food`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const astronautfoodText = [
            `* ${user} ate some Astronaut Food.`,
            `* ${user} ate some Astronaut Food. It's for a pet astronaut?`
        ]
        const randIdx = Math.floor(Math.random() * astronautfoodText.length)
        let itemText = astronautfoodText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `crab apple`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const crabappleText = [
            `* ${user} ate a Crab Apple.`,
            `* ${user} ate a Crab Apple. An aquatic fruit that resembles a crustacean.`
        ]
        const randIdx = Math.floor(Math.random() * crabappleText.length)
        let itemText = crabappleText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `sea tea`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const seateaText = [
            `* ${user} drank a Sea Tea.`,
            `* ${user} drank a Sea Tea. Made from glowing marsh water.`
        ]
        const randIdx = Math.floor(Math.random() * seateaText.length)
        let itemText = seateaText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `abandoned quiche`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const abandonedquicheText = [
            `* ${user} ate the Abandoned Quiche.`,
            `* ${user} ate the quiche they found under a bench.`,
            `* ${user} ate a psychologically-damaged spinach egg pie.`
        ]
        const randIdx = Math.floor(Math.random() * abandonedquicheText.length)
        let itemText = abandonedquicheText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `temmie flakes`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const temmieflakesText = [
            `* ${user} ate some Temmie Flakes (cheap). hOI!`,
            `* ${user} ate some Temmie Flakes (cheap). It's just torn up pieces of colored construction paper.`,
            `* ${user} ate some Temmie Flakes (normal). hOI!!! i'm tEMMIE!!`,
            `* ${user} ate some Temmie Flakes (normal). It's just torn up pieces of colored construction paper.`,
            `* ${user} ate some Temmie Flakes (expensiv). WOA!! u gota... tem flakes!!!`,
            `* ${user} ate some Temmie Flakes (expensiv). It's just torn up pieces of colored construction paper.`,
            `* ${user} ate some Temmie Flakes (premiem). FOOB!!!`,
            `* ${user} ate some Temmie Flakes (premiem). It's just torn up pieces of colored construction paper.`
        ]
        const randIdx = Math.floor(Math.random() * temmieflakesText.length)
        let itemText = temmieflakesText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `dog salad`) {
        player[`inventory`].splice(idx, 1)
        const dogSaladText = [
            `* ${user} ate Dog Salad. Oh. There are bones...`,
            `* ${user} ate Dog Salad. Oh. Fried tennis ball...`,
            `* ${user} ate Dog Salad. Oh. Tastes yappy...`,
            `* ${user} ate Dog Salad. It's literally garbage??? ${user}'s HP was maxed out.`,
        ]
        const randIdx = Math.floor(Math.random() * dogSaladText.length)
        let dogSaladHealAmt = 99
        if (randIdx === 0) {
            dogSaladHealAmt = 2
            dogSaladHealAmt += burntPanBonus
            player[`hp`] += dogSaladHealAmt
        }
        if (randIdx === 1) {
            dogSaladHealAmt = 10
            dogSaladHealAmt += burntPanBonus
            player[`hp`] += dogSaladHealAmt
        }
        if (randIdx === 2) {
            dogSaladHealAmt = 30
            dogSaladHealAmt += burntPanBonus
            player[`hp`] += dogSaladHealAmt
        }
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        if (randIdx === 3) { player[`hp`] = getUserMaxHP(user) }
        let itemText = dogSaladText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${dogSaladHealAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, dogSaladHealAmt: ${dogSaladHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `instant noodles`) {
        player[`inventory`].splice(idx, 1)
        const instantnoodlesText = [
            `* ${user} ate the Instant Noodles. They're better dry.`,
            `* ${user} cooked the Instant Noodles. Comes with everything you need for a quick meal!`,
            `* ${user} spends four minutes cooking Instant Noodles before eating them. ... they don't taste very good. They add the flavor packet. That's better. Not great, but better.`
        ]
        const randIdx = Math.floor(Math.random() * instantnoodlesText.length)
        let instantNoodlesHealAmt = 4
        if (randIdx === 0) {
            instantNoodlesHealAmt = 90
            instantNoodlesHealAmt += burntPanBonus
            player[`hp`] += instantNoodlesHealAmt
        }
        if (randIdx === 1) {
            instantNoodlesHealAmt = 15
            instantNoodlesHealAmt += burntPanBonus
            player[`hp`] += instantNoodlesHealAmt
        }
        if (randIdx === 2) {
            instantNoodlesHealAmt = 4
            instantNoodlesHealAmt += burntPanBonus
            player[`hp`] += instantNoodlesHealAmt
        }
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = instantnoodlesText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${instantNoodlesHealAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, instantNoodlesHealAmt: ${instantNoodlesHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hot dog`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const hotdogText = [
            `* ${user} ate a Hot Dog...? (Bark!)`,
            `* ${user} ate a Hot Dog...? (Bark!)`,
            `* ${user} ate a Hot Dog...? The "meat" is made of something called a "water sausage."`
        ]
        const randIdx = Math.floor(Math.random() * hotdogText.length)
        let itemText = hotdogText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hot cat`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const hotcatText = [
            `* ${user} ate a Hot Cat. (Meow!)`,
            `* ${user} ate a Hot Cat. (Meow!)`,
            `* ${user} ate a Hot Cat. Like a hot dog, but with little cat ears on the end.`
        ]
        const randIdx = Math.floor(Math.random() * hotcatText.length)
        let itemText = hotcatText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `junk food`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const junkfoodText = [
            `* ${user} used Junk Food.`,
            `* ${user} used Junk Food.`,
            `* ${user} used Junk Food. Food that was probably once thrown away.`,
            `* ${user} used Junk Food. (Eating garbage?!)`
        ]
        const randIdx = Math.floor(Math.random() * junkfoodText.length)
        let itemText = junkfoodText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hush puppy`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} ate a Hush Puppy. Dog-magic is neutralized.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `starfait`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const starfaitText = [
            `* ${user} ate a Starfait.`,
            `* ${user} ate a Starfait.`,
            `* ${user} ate a Starfait.`,
            `* ${user} ate a Starfait. A sweet treat made of sparkling stars.`,
            `* ${user} ate a Starfait. Viewer ratings go up by 200 points!`,
            `* ${user} ate a Starfait. Viewer ratings go up by 200 points!`
        ]
        const randIdx = Math.floor(Math.random() * starfaitText.length)
        let itemText = starfaitText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `glamburger`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const glamburgerText = [
            `* ${user} ate a Glamburger.`,
            `* ${user} ate the Glamburger. Made of edible glitter and sequins.`
        ]
        const randIdx = Math.floor(Math.random() * glamburgerText.length)
        let itemText = glamburgerText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `legendary hero`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const legendaryheroText = [
            `* ${user} ate a Legendary Hero.`,
            `* ${user} ate the Legendary Hero. Sandwich shaped like a sword. Increases ATTACK when eaten.`,
            `* ${user} ate a Legendary Hero. Viewer ratings go up by 500 points!`
        ]
        const randIdx = Math.floor(Math.random() * legendaryheroText.length)
        let itemText = legendaryheroText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `steak in the shape of mettaton's face`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const steakText = [
            `* ${user} ate the Steak in the Shape of Mettaton's Face. They feel like it's not made of real meat...`,
            `* ${user} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts.`,
            `* ${user} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts. Viewer ratings go up by 700 points!`
        ]
        const randIdx = Math.floor(Math.random() * steakText.length)
        let itemText = steakText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `popato chisps`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        const popatochispsText = [
            `* ${user} ate some Popato Chisps.`,
            `* ${user} ate some Popato Chisps. Regular old popato chisps.`
        ]
        const randIdx = Math.floor(Math.random() * popatochispsText.length)
        let itemText = popatochispsText[randIdx]
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `bad memory`) {
        player[`inventory`].splice(idx, 1)
        let itemText = `* ${user} consumes the Bad Memory. `
        if (player[`hp`] <= 3) {
            player[`hp`] = getUserMaxHP(user)
            itemText += `${user}'s HP was maxed out.`
            console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ALL ${resetTxt}`)
        } else {
            player[`hp`] += healAmt
            itemText += `${user} lost 1 HP.`
            console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        }
        return itemText
    }
    if (str === `last dream`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} used Last Dream. Through DETERMINATION, the dream became true.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered 12 HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `puppydough icecream`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} ate Puppydough Icecream. Mmm! Tastes like puppies.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `pumpkin rings`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} ate Pumpkin Rings. A small pumpkin cooked like onion rings.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `croquet roll`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} hit a Croquet Roll into their mouth. Fried dough traditionally served with a mallet.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `ghost fruit`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} ate a Ghost Fruit. It will never pass to the other side.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `stoic onion`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} ate a Stoic Onion. They didn't cry...`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `rock candy`) {
        player[`inventory`].splice(idx, 1)
        healAmt += burntPanBonus
        player[`hp`] += healAmt
        if (player[`hp`] > getUserMaxHP(user)) { player[`hp`] = getUserMaxHP(user) }
        let itemText = `* ${user} ate Rock Candy. It's a rock.`
        player[`hp`] === getUserMaxHP(user) ? itemText += ` ${user}'s HP was maxed out.` : itemText += ` ${user} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${user} HP: ${player[`hp`]}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }

    // Weapons
    if (str === `stick`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Stick`
        const stickText = [
            `* ${user} threw the Stick away. Then picked it back up.`,
            `* ${user} equipped the Stick. Its bark is worse than its bite.`
        ]
        const randIdx = Math.floor(Math.random() * stickText.length)
        console.log(`${cyanBg} ${user} equipped the Stick, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return stickText[randIdx]
    }
    if (str === `toy knife`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Toy Knife`
        const toyKnifeText = [
            `* ${user} equipped the Toy Knife. +3 ATTACK`,
            `* ${user} equipped the Toy Knife. Made of plastic. A rarity nowadays. +3 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * toyKnifeText.length)
        console.log(`${cyanBg} ${user} equipped the Toy Knife, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return toyKnifeText[randIdx]
    }
    if (str === `tough glove`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Tough Glove`
        const toughGloveText = [
            `* ${user} equipped the Tough Glove. +5 ATTACK`,
            `* ${user} equipped the Tough Glove. A worn pink leather glove. For five-fingered folk. +5 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * toughGloveText.length)
        console.log(`${cyanBg} ${user} equipped the Tough Glove, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return toughGloveText[randIdx]
    }
    if (str === `ballet shoes`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Ballet Shoes`
        const balletShoesText = [
            `* ${user} equipped the Ballet Shoes. +7 ATTACK`,
            `* ${user} equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous. +7 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * balletShoesText.length)
        console.log(`${cyanBg} ${user} equipped the Ballet Shoes, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return balletShoesText[randIdx]
    }
    if (str === `torn notebook`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Torn Notebook`
        console.log(`${cyanBg} ${user} equipped the Torn Notebook, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return `* ${user} equipped the Torn Notebook. +2 ATTACK`
    }
    if (str === `burnt pan`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Burnt Pan`
        const burntPanText = [
            `* ${user} equipped the Burnt Pan. +10 ATTACK`,
            `* ${user} equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP. +10 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * burntPanText.length)
        console.log(`${cyanBg} ${user} equipped the Burnt Pan, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return burntPanText[randIdx]
    }
    if (str === `empty gun`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Empty Gun`
        const emptyGunText = [
            `* ${user} equipped the Empty Gun. +12 ATTACK`,
            `* ${user} equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low. +12 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * emptyGunText.length)
        console.log(`${cyanBg} ${user} equipped the Empty Gun, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return emptyGunText[randIdx]
    }
    if (str === `worn dagger`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Worn Dagger`
        const wornDaggerText = [
            `* ${user} equipped the Worn Dagger. +15 ATTACK`,
            `* ${user} equipped the Worn Dagger. Perfect for cutting plants and vines. +15 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * wornDaggerText.length)
        console.log(`${cyanBg} ${user} equipped the Worn Dagger, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return wornDaggerText[randIdx]
    }
    if (str === `real knife`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`weapon`])
        player[`weapon`] = `Real Knife`
        console.log(`${cyanBg} ${user} equipped the Real Knife, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return `* ${user} equipped the Real Knife. About time. +99 ATTACK`
    }

    // Armor
    if (str === `faded ribbon`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Faded Ribbon`
        const fadedRibbonText = [
            `* ${user} equipped the Faded Ribbon. +5 DEFENSE`,
            `* ${user} equipped the Faded Ribbon. If you're cuter, they won't hit you as hard. +5 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * fadedRibbonText.length)
        console.log(`${cyanBg} ${user} equipped the Faded Ribbon, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return fadedRibbonText[randIdx]
    }
    if (str === `manly bandanna`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Manly Bandanna`
        const manlyBandannaText = [
            `* ${user} equipped the Manly Bandanna. +7 DEFENSE`,
            `* ${user} equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it. +7 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * manlyBandannaText.length)
        console.log(`${cyanBg} ${user} equipped the Manly Bandanna, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return manlyBandannaText[randIdx]
    }
    if (str === `old tutu`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Old Tutu`
        const oldTutuText = [
            `* ${user} equipped the Old Tutu. +10 DEFENSE`,
            `* ${user} equipped the Old Tutu. Finally, a protective piece of armor. +10 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * oldTutuText.length)
        console.log(`${cyanBg} ${user} equipped the Old Tutu, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return oldTutuText[randIdx]
    }
    if (str === `cloudy glasses`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Cloudy Glasses`
        const cloudyGlassesText = [
            `* ${user} equipped the Cloudy Glasses. +5 DEFENSE`,
            `* ${user} equipped the Cloudy Glasses. Glasses marred with wear. +5 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * cloudyGlassesText.length)
        console.log(`${cyanBg} ${user} equipped the Cloudy Glasses, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return cloudyGlassesText[randIdx]
    }
    if (str === `temmie armor`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Temmie Armor`
        const temmieArmorText = [
            `* ${user} donned the Temmie Armor. The things you can do with a college education!`,
            `* ${user} donned the Temmie Armor. tem armor so GOOds! any battle becom! a EASY victories!!!`
        ]
        const randIdx = Math.floor(Math.random() * temmieArmorText.length)
        console.log(`${cyanBg} ${user} equipped the Temmie Armor, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return temmieArmorText[randIdx]
    }
    if (str === `stained apron`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Stained Apron`
        const stainedApronText = [
            `* ${user} equipped the Stained Apron. +11 DEFENSE`,
            `* ${user} equipped the Stained Apron. Heals 1 HP every other turn.`
        ]
        const randIdx = Math.floor(Math.random() * stainedApronText.length)
        console.log(`${cyanBg} ${user} equipped the Stained Apron, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return stainedApronText[randIdx]
    }
    if (str === `cowboy hat`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Cowboy Hat`
        const cowboyHatText = [
            `* ${user} equipped the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
            `* ${user} equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard. +5 ATTACK +12 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * cowboyHatText.length)
        console.log(`${cyanBg} ${user} equipped the Cowboy Hat, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return cowboyHatText[randIdx]
    }
    if (str === `heart locket`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `Heart Locket`
        const heartLocketText = [
            `* ${user} equipped the Heart Locket. +15 DEFENSE`,
            `* ${user} equipped the Heart Locket. It says "Best Friends Forever." +15 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * heartLocketText.length)
        console.log(`${cyanBg} ${user} equipped the Heart Locket, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return heartLocketText[randIdx]
    }
    if (str === `the locket`) {
        player[`inventory`].splice(idx, 1)
        player[`inventory`].push(player[`armor`])
        player[`armor`] = `The Locket`
        console.log(`${cyanBg} ${user} equipped the Locket, HP: ${player[`hp`]}/${getUserMaxHP(user)} ${resetTxt}`)
        return `* ${user} equipped the Locket. Right where it belongs. +99 DEFENSE`
    }
    return `* ${user} used 0. If you are reading this, I messed up somehow.`
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
    printLogo()
    client.say(SELECTED_CHANNEL, `I have been rebooted :)`)
}