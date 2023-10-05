require(`dotenv`).config()
const tmi = require('tmi.js')
const BOT_USERNAME = process.env.BOT_USERNAME
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const CHANNEL_1 = process.env.CHANNEL_1
const CHANNEL_2 = process.env.CHANNEL_2
const CHANNEL_3 = process.env.CHANNEL_3
const CHANNEL_4 = process.env.CHANNEL_4
const CHANNEL_5 = process.env.CHANNEL_5
const CHANNEL_6 = process.env.CHANNEL_6
const CHANNEL_7 = process.env.CHANNEL_7
const CHANNEL_8 = process.env.CHANNEL_8
const squad = [
    CHANNEL_2,
    CHANNEL_3,
    CHANNEL_4,
    CHANNEL_5,
    CHANNEL_6,
    CHANNEL_7,
    CHANNEL_8
]

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
    // options: {
    //     debug: true
    // },
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [
        `#${BOT_USERNAME}`
    ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
let firstConnection = true
client.connect()

// All active users (to avoid duplicate clients):
const globalUsers = [BOT_USERNAME]

const baseHP = 16
const baseAT = -2
const baseDF = 0.25

// Initializing players
let players = {
    dummy: {
        displayName: `the Dummy`,
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
    if (self || tags[`display-name`] === `UndertaleBot`) { return } // Ignore messages from the bot

    // Message context
    const user = tags.username
    const displayName = tags[`display-name`]
    const senderIsSubbed = tags.subscriber
    const senderIsAMod = tags.mod
    const senderIsVIP = tags.vip

    // Command and arguments parser
    const args = msg.split(' ')
    const command = args.shift().toLowerCase()
    const toUser = args[0] ? getToUser(args[0]) : ``

    // Add/manage players
    if (!(user in players)) {
        players[user] = {
            displayName: displayName,
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
        playerSave[user] = {
            displayName: displayName,
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
    const sendingPlayer = players[user]
    const targetPlayer = toUser.toLowerCase() !== user && toUser.toLowerCase() in players ? players[toUser.toLowerCase()] : null
    console.log(`<${sendingPlayer.displayName}> targetPlayer =`, targetPlayer?.displayName || targetPlayer)

    // *****************
    // ** REPLY CASES **
    // *****************

    // JOIN
    if (command === `!join`
        && channel === `#${BOT_USERNAME}`) {
        return handleJoin(channel, user)
    }

    // RECRUIT
    if (command === `!recruit`
        && channel === `#${BOT_USERNAME}`
        && user === CHANNEL_2) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (!args.length) {
            talk(channel, `All users: ${globalUsers.join(', ')}`)
            return
        }

        for (const str of args) {
            const newUser = str.toLowerCase()
            if (globalUsers.includes(newUser)) {
                talk(channel, `${newUser} is already recruited!`)
            } else {
                globalUsers.push(newUser)
                const client = new tmi.client({
                    identity: {
                        username: BOT_USERNAME,
                        password: OAUTH_TOKEN
                    },
                    channels: [newUser]
                })
                client.on('message', onMessageHandler)
                client.connect()
                talk(channel, `${newUser} has been recruited!`)
            }
        }
        return
    }

    // ALL
    if (command === `!all`
        && channel === `#${BOT_USERNAME}`
        && user === CHANNEL_2) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response

        const invalid = globalUsers.some((user) => squad.includes(user))
        if (invalid) {
            response = `Someone is already recruited :( ${globalUsers.join(', ')}`
        } else {
            response = `Squad up! :)`
            squad.forEach((user) => globalUsers.push(user))
            const client = new tmi.client({
                identity: {
                    username: BOT_USERNAME,
                    password: OAUTH_TOKEN
                },
                channels: [
                    CHANNEL_2,
                    CHANNEL_3,
                    CHANNEL_4,
                    CHANNEL_5,
                    CHANNEL_6,
                    CHANNEL_7,
                    CHANNEL_8
                ]
            })
            client.on('message', onMessageHandler)
            client.connect()
        }
        talk(channel, response)
        return
    }

    // MEMORY
    if (command === `!memory`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const allPlayers = Object.keys(players)
        const response = `Players: ${allPlayers.join(`, `)}`
        for (const player in players) {
            const logColor = players[player].dead ? redBg : greenBg
            console.log(`${logColor} ${players[player].displayName} LV: ${players[player].lv}, HP: ${players[player].hp}/${getUserMaxHP(player)}, AT: ${players[player].at}, DF: ${players[player].df}, EXP: ${players[player].exp}, NEXT: ${players[player].next}, Weapon: ${players[player].weapon}, Armor: ${players[player].armor}, Gold: ${players[player].gold} ${resetTxt}`)
        }
        talk(channel, response)
        return
    }

    // REVIVE (for testing, mods can also use)
    if (command === `!revive`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (user === CHANNEL_2 || senderIsAMod) {
            players.dummy.hp = getUserMaxHP(`dummy`)
            players.dummy.dead = false
            response = `Dummy is alive :)`
            talk(channel, response)
        } else {
            response = `You can't use this command, ${sendingPlayer.displayName} ;)`
            talk(channel, response)
        }
        return
    }

    // SAVE
    if (command === `!save`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
            return
        }

        playerSave[user] = { ...players[user] }

        let response = `* `
        const saveText = [
            `The shadow of the ruins looms above, filling ${sendingPlayer.displayName} with determination.`,
            `Playfully crinkling through the leaves fills ${sendingPlayer.displayName} with determination.`,
            `Knowing the mouse might one day leave its hole and get the cheese... It fills ${sendingPlayer.displayName} with determination.`,
            `Seeing such a cute, tidy house in the RUINS gives ${sendingPlayer.displayName} determination.`,
            `The cold atmosphere of a new land... it fills ${sendingPlayer.displayName} with determination.`,
            `The convenience of that lamp still fills ${sendingPlayer.displayName} with determination.`,
            `Knowing the mouse might one day find a way to heat up the spaghetti... It fills ${sendingPlayer.displayName} with determination.`,
            `Snow can always be broken down and rebuilt into something more useful. This simple fact fills ${sendingPlayer.displayName} with determination.`,
            `Knowing that dog will never give up trying to make the perfect snowdog... It fills ${sendingPlayer.displayName} with determination.`,
            `The sight of such a friendly town fills ${sendingPlayer.displayName} with determination.`,
            `The sound of rushing water fills ${sendingPlayer.displayName} with determination.`,
            `A feeling of dread hangs over ${sendingPlayer.displayName}... But ${sendingPlayer.displayName} stays determined.`,
            `Knowing the mouse might one day extract the cheese from the mystical crystal... It fills ${sendingPlayer.displayName} with determination.`,
            `The serene sound of a distant music box... It fills ${sendingPlayer.displayName} with determination.`,
            `The sound of muffled rain on the cavetop... It fills ${sendingPlayer.displayName} with determination.`,
            `The waterfall here seems to flow from the ceiling of the cavern... Occasionally, a piece of trash will flow through... and fall into the bottomless abyss below. Viewing this endless cycle of worthless garbage... It fills ${sendingPlayer.displayName} with determination.`,
            `Partaking in useless garbage fills ${sendingPlayer.displayName} with determination.`,
            `${sendingPlayer.displayName} feels a calming tranquility. ${sendingPlayer.displayName} is filled with determination.`,
            `${sendingPlayer.displayName} feels... something. ${sendingPlayer.displayName} is filled with detemmienation.`,
            `The wind is howling. ${sendingPlayer.displayName} is filled with determination.`,
            `The wind has stopped. ${sendingPlayer.displayName} is filled with determination.`,
            `The howling wind is now a breeze. This gives ${sendingPlayer.displayName} determination.`,
            `Seeing such a strange laboratory in a place like this... ${sendingPlayer.displayName} is filled with determination.`,
            `The wooshing sound of steam and cogs... it fills ${sendingPlayer.displayName} with determination.`,
            `An ominous structure looms in the distance... ${sendingPlayer.displayName} is filled with determination.`,
            `Knowing the mouse might one day hack into the computerized safe and get the cheese... It fills ${sendingPlayer.displayName} with determination.`,
            `The smell of cobwebs fills the air... ${sendingPlayer.displayName} is filled with determination.`,
            `The relaxing atmosphere of this hotel... it fills ${sendingPlayer.displayName} with determination.`,
            `The air is filled with the smell of ozone... it fills ${sendingPlayer.displayName} with determination.`,
            `Behind this door must be the elevator to the King's castle. ${sendingPlayer.displayName} is filled with determination.`
        ]
        const randSaveText = Math.floor(Math.random() * saveText.length)
        response += saveText[randSaveText]
        talk(channel, response)
        return
    }

    // LOAD
    if (command === `!load`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        players[user] = { ...playerSave[user] }
        players[user].inventory = playerSave[user].inventory

        let response = `"${sendingPlayer.displayName}" `
        let attackBoost = 0
        if (players[user].armor === `Cowboy Hat`) { attackBoost = 5 }
        if (players[user].armor === `Temmie Armor`) { attackBoost = 10 }
        response += `LV: ${players[user].lv}, HP: ${players[user].hp}/${getUserMaxHP(user)}, AT: ${players[user].at}(${weaponsATK[players[user].weapon] + attackBoost}), DF: ${players[user].df}(${armorDEF[players[user].armor]}), EXP: ${players[user].exp}, NEXT: ${players[user].next}, WEAPON: ${players[user].weapon}, ARMOR: ${players[user].armor}, GOLD: ${players[user].gold}`
        talk(channel, response)
        console.log(`Inventory:`, players[user].inventory)
        return
    }

    // INTRO
    if (command === `!intro`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
            return
        }

        let response = `* `
        const introText = [
            `${sendingPlayer.displayName} and co. decided to pick on you!`,
            `${sendingPlayer.displayName} appeared.`,
            `${sendingPlayer.displayName} appeared.`,
            `${sendingPlayer.displayName} appeared.`,
            `${sendingPlayer.displayName} appears.`,
            `${sendingPlayer.displayName} appears.`,
            `${sendingPlayer.displayName} appears. Jerry came, too.`,
            `${sendingPlayer.displayName} approached meekly!`,
            `${sendingPlayer.displayName} assaults you!`,
            `${sendingPlayer.displayName} attacked!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} attacks!`,
            `${sendingPlayer.displayName} blocked the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way!`,
            `${sendingPlayer.displayName} blocks the way.`,
            `${sendingPlayer.displayName} bounds towards you!`,
            `${sendingPlayer.displayName} came out of the earth!`,
            `${sendingPlayer.displayName} clings to you!`,
            `${sendingPlayer.displayName} confronts you, sighing. Jerry.`,
            `${sendingPlayer.displayName} confronts you!`,
            `${sendingPlayer.displayName} crawled up close!`,
            `${sendingPlayer.displayName} crawled up close!`,
            `${sendingPlayer.displayName} decided to pick on you!`,
            `${sendingPlayer.displayName} drew near!`,
            `${sendingPlayer.displayName} drew near!`,
            `${sendingPlayer.displayName} drew near!`,
            `${sendingPlayer.displayName} drew near!`,
            `${sendingPlayer.displayName} drew near.`,
            `${sendingPlayer.displayName} emerges from the shadows.`,
            `${sendingPlayer.displayName} emerges from the shadows.`,
            `${sendingPlayer.displayName} flexes in!`,
            `${sendingPlayer.displayName} flutters forth!`,
            `${sendingPlayer.displayName} flutters forth!`,
            `${sendingPlayer.displayName} flutters in.`,
            `${sendingPlayer.displayName} gets in the way! Not on purpose or anything.`,
            `${sendingPlayer.displayName} hides in the corner but somehow encounters you anyway.`,
            `${sendingPlayer.displayName} hissed out of the earth!`,
            `${sendingPlayer.displayName} hopped close!`,
            `${sendingPlayer.displayName} hopped in...?`,
            `${sendingPlayer.displayName} hopped towards you.`,
            `${sendingPlayer.displayName} pops out of their hat!`,
            `${sendingPlayer.displayName} rushed in!`,
            `${sendingPlayer.displayName} saunters up!`,
            `${sendingPlayer.displayName} shuffles up.`,
            `${sendingPlayer.displayName} slithered out of the earth!`,
            `${sendingPlayer.displayName} strolls in.`,
            `${sendingPlayer.displayName} struts into view.`,
            `${sendingPlayer.displayName} swooped in!`,
            `${sendingPlayer.displayName} traps you!`,
            `${sendingPlayer.displayName} was already there, waiting for you.`,
            `Here comes ${sendingPlayer.displayName}.`,
            `Here comes ${sendingPlayer.displayName}. Same as usual.`,
            `It's ${sendingPlayer.displayName}.`,
            `It's ${sendingPlayer.displayName}.`,
            `Special enemy ${sendingPlayer.displayName} appears here to defeat you!!`,
            `You encountered ${sendingPlayer.displayName}.`,
            `You tripped over ${sendingPlayer.displayName}.`
        ]
        const randIntroText = Math.floor(Math.random() * introText.length)
        response += introText[randIntroText]
        talk(channel, response)
        return
    }

    // STAT(S)
    if ([
        `!stats`,
        `!stat`,
        `!status`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        let attackBoost = 0
        if (toUser && toUser.toLowerCase() in players) {
            const target = players[toUser.toLowerCase()]
            if (target.armor === `Cowboy Hat`) { attackBoost = 5 }
            if (target.armor === `Temmie Armor`) { attackBoost = 10 }
            response = `"${target.displayName}" LV: ${target.lv}, HP: ${target.hp}/${getUserMaxHP(toUser.toLowerCase())}, AT: ${target.at}(${weaponsATK[target.weapon] + attackBoost}), DF: ${target.df}(${armorDEF[target.armor]}), EXP: ${target.exp}, NEXT: ${target.next}, WEAPON: ${target.weapon}, ARMOR: ${target.armor}, GOLD: ${target.gold}`
        } else if (toUser) {
            response = `${toUser} isn't registered :(`
        } else {
            if (sendingPlayer.armor === `Cowboy Hat`) { attackBoost = 5 }
            if (sendingPlayer.armor === `Temmie Armor`) { attackBoost = 10 }
            response = `"${sendingPlayer.displayName}" LV: ${sendingPlayer.lv}, HP: ${sendingPlayer.hp}/${getUserMaxHP(user)}, AT: ${sendingPlayer.at}(${weaponsATK[sendingPlayer.weapon] + attackBoost}), DF: ${sendingPlayer.df}(${armorDEF[sendingPlayer.armor]}), EXP: ${sendingPlayer.exp}, NEXT: ${sendingPlayer.next}, WEAPON: ${sendingPlayer.weapon}, ARMOR: ${sendingPlayer.armor}, GOLD: ${sendingPlayer.gold}`
        }
        talk(channel, response)
        return
    }

    // SPAMTON QUOTE
    if (command === `!spamton`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = getSpamtonQuote(args[0])
        talk(channel, response)
        return
    }

    // FIGHT or ATTACK
    if ([
        `!fight`,
        `!attack`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
            return
        }

        // Stop if target is the bot, dead, or not known
        if (toUser) {
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()].dead) {
                    talk(channel, `${toUser} is already dead! :(`)
                    return
                }
            } else if (toUser.toLowerCase() === `undertalebot`) {
                talk(channel, `You can't fight me, but you can try fighting the dummy!`)
                return
            } else {
                talk(channel, `${toUser} isn't a known player!`)
                return
            }
        }

        let response = `* ${capsSender} attacks `
        targetPlayer ? response += `${targetPlayer.displayName}, ` : response += `themself, `

        const smallDamage = Math.ceil(Math.random() * 5)
        const mediumDamage = Math.ceil(Math.random() * 10)
        const bigDamage = Math.ceil(Math.random() * 15)
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
        if (sendingPlayer.armor === `Stained Apron`) {
            stainedApronHealCheck = stainedApronHealToggle(user)
            if (stainedApronHealCheck) { response += ` ${capsSender} recovered 1 HP!` }
        }

        talk(channel, response)

        if (targetPlayer) {
            if (randNum === 0) {
                targetPlayer.hp -= smallDamageDealt
                console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
            } else if (randNum === 1) {
                targetPlayer.hp -= mediumDamageDealt
                console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
            } else if (randNum === 2) {
                targetPlayer.hp -= bigDamageDealt
                console.log(`${grayBg} bigDamage: ${bigDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${bigDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${bigDamageDealt} ${resetTxt}`)
            }
            if (stainedApronHealCheck) {
                sendingPlayer.hp += 1
                if (sendingPlayer.hp > getUserMaxHP(user)) { sendingPlayer.hp = getUserMaxHP(user) }
            }
            deathCheck(channel, user, toUser)
        } else {
            if (randNum === 0) {
                sendingPlayer.hp -= smallDamageDealt
                console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
            } else if (randNum === 1) {
                sendingPlayer.hp -= mediumDamageDealt
                console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
            } else if (randNum === 2) {
                sendingPlayer.hp -= bigDamageDealt
                console.log(`${grayBg} bigDamage: ${bigDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${bigDamage + weaponDamage + attackBonus} ${resetTxt} ${magentaBg} DEF: ${defenseBonus} armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${bigDamageDealt} ${resetTxt}`)
            }
            if (stainedApronHealCheck) {
                sendingPlayer.hp += 1
                if (sendingPlayer.hp > getUserMaxHP(user)) { sendingPlayer.hp = getUserMaxHP(user) }
            }
            deathCheck(channel, user, user)
        }
        return
    }

    // ACT
    if (command === `!act`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
            return
        }

        if (toUser) {
            if (toUser.toLowerCase() in players) {
                if (targetPlayer.dead) {
                    talk(channel, `Sorry ${sendingPlayer.displayName}, ${players[toUser.toLowerCase()].displayName} is dead! :(`)
                    return
                }
            } else {
                talk(channel, `${toUser} is not a registered player :(`)
                return
            }
        }

        let response = `* ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)}`
        targetPlayer ? response += getAction(sendingPlayer, targetPlayer) : response += getThirdPersonFlavorText()

        // Stained Apron heal check
        if (sendingPlayer.armor === `Stained Apron`) {
            const stainedApronHealCheck = stainedApronHealToggle(user)
            if (stainedApronHealCheck) {
                response += ` ${sendingPlayer.displayName} recovered 1 HP!`
                sendingPlayer.hp += 1
                if (sendingPlayer.hp > getUserMaxHP(user)) { sendingPlayer.hp = getUserMaxHP(user) }
            }
        }

        talk(channel, response)
        return
    }

    // ITEM or ITEMS or USE
    if ([
        `!item`,
        `!items`,
        `!use`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const inventory = sendingPlayer.inventory
        console.log(`Inventory:`, inventory)

        let usedItem = toUser.toLowerCase() || ``

        if (inventory.length === 0) {
            talk(channel, `${sendingPlayer.displayName} has no items! :(`)
            return
        }

        if (!usedItem) {
            talk(channel, `${sendingPlayer.displayName}'s items: ${inventory.join(', ')}`)
            return
        }

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
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
        for (const item of allItems) {
            if (msg.toLowerCase().includes(item)) {
                isAnItem = true
                usedItem = item
                break
            }
        }
        if (!isAnItem) {
            talk(channel, `${sendingPlayer.displayName}, that isn't an item! :(`)
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
            talk(channel, `${sendingPlayer.displayName}, you don't have that item! :(`)
            return
        }

        const response = useItem(user, usedItem, index)
        talk(channel, response)
        return
    }

    // MERCY or SPARE
    if ([
        `!mercy`,
        `!spare`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
            return
        }

        let randNum = Math.ceil(Math.random() * 10)
        if (targetPlayer) {
            if (targetPlayer.hp <= 10) { randNum = Math.ceil(Math.random() * 4) }
            if (targetPlayer.hp <= 5) { randNum = Math.ceil(Math.random() * 2) }
        }
        const randGoldAmt = Math.floor(Math.random() * 101)
        let response = `* `

        // Check if toUser is the sender
        if (toUser && toUser.toLowerCase() !== user) {
            // If toUser not registered
            if (!(toUser.toLowerCase() in players)) {
                response = `${toUser} is not a registered player :(`
                talk(channel, response)
                return
                // If toUser is dead
            } else if (targetPlayer.dead) {
                response = `Sorry ${sendingPlayer.displayName}, ${players[toUser.toLowerCase()].displayName} is dead! :(`
                talk(channel, response)
                return
            } else if (randNum === 1) {
                const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
                const capsTarget = targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)
                response += `YOU WON! ${capsTarget} was spared. ${capsSender} earned 0 EXP and ${randGoldAmt} gold.`
                sendingPlayer.gold += randGoldAmt
                sendingPlayer.hp = getUserMaxHP(user)
                targetPlayer.hp = getUserMaxHP(toUser.toLowerCase())
                talk(channel, response)
                console.log(`${cyanBg} sender: ${sendingPlayer.displayName} ${sendingPlayer.hp}, target: ${targetPlayer.displayName || `none`} ${targetPlayer ? targetPlayer.hp : ``}, randNum: ${randNum} ${resetTxt}`)
                return
            } else {
                response += `${capsSender} tried to spare ${targetPlayer.displayName}. ${capsTarget}`
                response += getThirdPersonFlavorText()
            }
        } else {
            response += `${capsSender} tried to spare themself. But nothing happened.`
        }

        // Stained Apron heal check
        if (sendingPlayer.armor === `Stained Apron`) {
            const stainedApronHealCheck = stainedApronHealToggle(user)
            if (stainedApronHealCheck) {
                response += ` ${sendingPlayer.displayName} recovered 1 HP!`
                sendingPlayer.hp += 1
                if (sendingPlayer.hp > getUserMaxHP(user)) { sendingPlayer.hp = getUserMaxHP(user) }
            }
        }

        talk(channel, response)
        console.log(`${cyanBg} sender: ${sendingPlayer.displayName} ${sendingPlayer.hp}, toUser: ${toUser || `none`} ${targetPlayer ? targetPlayer.hp : ``}, randNum: ${randNum} ${resetTxt}`)
        return
    }

    // HP
    if (command === `!hp`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer.hp} HP`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sendingPlayer.displayName} has ${sendingPlayer.hp} HP`
        }
        talk(channel, response)
        return
    }

    // GOLD
    if (command === `!gold`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer.gold} G`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sendingPlayer.displayName} has ${sendingPlayer.gold} G`
        }
        talk(channel, response)
        return
    }

    // EXP or EXPERIENCE
    if ([
        `!exp`,
        `!experience`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer.exp} EXP`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sendingPlayer.displayName} has ${sendingPlayer.exp} EXP`
        }
        talk(channel, response)
        return
    }

    // NEXT
    if (command === `!next`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser}'s LV will increase with ${targetPlayer.next} more EXP`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sendingPlayer.displayName}'s LV will increase with ${sendingPlayer.next} more EXP`
        }
        talk(channel, response)
        return
    }

    // WEAPON
    if (command === `!weapon`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has the ${targetPlayer.weapon} equipped (${weaponsATK[targetPlayer.weapon]} ATK)`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sendingPlayer.displayName} has the ${sendingPlayer.weapon} equipped (${weaponsATK[sendingPlayer.weapon]} ATK)`
        }
        talk(channel, response)
        return
    }

    // ARMOR
    if (command === `!armor`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${toUser} has the ${targetPlayer.armor} equipped (${armorDEF[targetPlayer.armor]} DEF)`
        } else if (toUser) {
            response = `${toUser} isn't a known player!`
        } else {
            response = `${sendingPlayer.displayName} has the ${sendingPlayer.armor} equipped (${armorDEF[sendingPlayer.armor]} DEF)`
        }
        talk(channel, response)
        return
    }

    // BUY or SHOP or GET
    if ([
        `!buy`,
        `!get`,
        `!shop`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) {
            talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
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
        for (const item of purchasableItems) {
            if (msg.toLowerCase().includes(item)) {
                isAnItem = true
                queryItem = item
                break
            }
        }
        if (queryItem && !isAnItem) {
            talk(channel, `${sendingPlayer.displayName}, that item doesn't exist! :(`)
            return
        }

        let response = `${sendingPlayer.displayName} can buy: `
        if (sendingPlayer.lv >= 1) { response += `Spider Donut, Spider Cider` }
        if (sendingPlayer.lv >= 2) { response += `, Nice Cream, Bisicle, Cinnamon Bunny, Tough Glove, Manly Bandanna` }
        if (sendingPlayer.lv >= 3) { response += `, Crab Apple, Sea Tea, Temmie Flakes, Torn Notebook, Cloudy Glasses` }
        if (sendingPlayer.lv >= 4) { response += `, Temmie Armor, Hot Dog...?, Hot Cat` }
        if (sendingPlayer.lv >= 5) { response += `, Junk Food, Starfait, Glamburger, Legendary Hero, Steak in the Shape of Mettaton's Face, Empty Gun, Cowboy Hat` }
        if (sendingPlayer.lv >= 6) { response += `, Popato Chisps` }

        if (queryItem) { response = buyItem(user, queryItem, itemPrices[queryItem]) }

        talk(channel, response)
        return
    }

    // COMMANDS
    if (command === `!commands`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = `!fight: @ another chat member to attack them, !act: Do an action by yourself or @ another chat member, !item: Check for (or use) items in your inventory, !mercy: @ another chat member to attempt to spare them, !buy: Spend gold on items, or check what is possible to buy, !save: Use determination to save your current state, !load: Reload your previous save file`
        talk(channel, response)
        return
    }

    // HELP
    if (command === `!help`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = `${sendingPlayer.displayName}: This bot simulates playing Undertale! You can interact with others (try !commands to learn more), and check your stats with !stats, !hp, and !gold. You can view all known players by using !memory. While this bot is online, you can use !join in its channel to make it monitor your channel's chat too!`
        talk(channel, response)
        return
    }

    // UNDERTALE or LOGO
    if ([
        `!undertale`,
        `!logo`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)
        printLogo()
        return
    }

    function talk(chatroom, resp) {
        client.say(chatroom, resp)
        console.log(`${yellowBg}${chatroom} ${resetTxt}`, `${boldTxt}${yellowTxt}UndertaleBot:${resetTxt}`, `${yellowTxt}${resp}${resetTxt}`)
    }
}

// Helper functions
function handleJoin(channel, user) {
    // Log message
    console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

    if (globalUsers.includes(user)) {
        talk(channel, `${sendingPlayer.displayName}, I should already be active in your channel! Try using a command like !stats in your chat if you're not sure! :O`)
        return
    }

    const client = new tmi.client({
        identity: {
            username: BOT_USERNAME,
            password: OAUTH_TOKEN
        },
        channels: [`#${user}`]
    })
    client.on('message', onMessageHandler)
    client.connect()

    globalUsers.push(user)
    talk(`#${BOT_USERNAME}`, `${sendingPlayer.displayName}, I am now active in your Twitch channel! This will only last until I am rebooted, which is frequent since I'm under development, so don't expect me to stay for long! While I'm streaming, you can always come back and use !join if I disappear from your chat. ;)`)
}

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

function getAction(sendingPlayer, targetPlayer) {
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    const capsTarget = targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)
    const randGold = Math.ceil(Math.random() * 10) * 5
    const actions = [
        ` and the others celebrate ${targetPlayer.displayName}'s disappearance.`,
        ` and the others ditch ${targetPlayer.displayName} when they look away!`,
        ` asks ${targetPlayer.displayName} about their day.`,
        ` asks ${targetPlayer.displayName} about their day. There's no response.`,
        ` asks ${targetPlayer.displayName} to clean them. ${capsTarget} hops around excitedly.`,
        ` attempts to touch ${targetPlayer.displayName}'s armor. Their hands slip off.`,
        ` boos ${targetPlayer.displayName}.`,
        ` boos loudly. ${capsTarget} leaves to look elsewhere for praise.`,
        ` boos... but haters only make ${targetPlayer.displayName} stronger. ${capsTarget} ATTACK UP+DEFENSE DOWN.`,
        ` calls ${targetPlayer.displayName}. ${capsTarget} bounds toward them, flecking slobber into ${sendingPlayer.displayName}'s face.`,
        ` claps like a gorilla. ${capsTarget} is becoming addicted to their praise.`,
        ` claps really sloppily. ${capsTarget} sucks up their praise like a vacuum cleaner.`,
        ` cleans ${targetPlayer.displayName}'s armor. Its cooling dirt begins to wash away.`,
        ` compliments ${targetPlayer.displayName}. They understood them perfectly. ${capsTarget}'s ATTACK dropped.`,
        ` cranks up the thermostat. ${capsTarget} begins to get excited.`,
        ` cranks up the thermostat. It's super hot! ${targetPlayer.displayName} looks satisfied.`,
        ` did something mysterious. ${capsTarget} recognizes they have more to learn from this world.`,
        ` does nothing. ${capsTarget} leaves to look elsewhere for praise.`,
        ` does nothing. ${capsTarget} looks desperate for attention.`,
        ` does nothing. ${capsTarget} looks disappointed they aren't paying attention.`,
        ` doesn't hug ${targetPlayer.displayName}. They appreciate their respect of their boundaries.`,
        ` doesn't pick on ${targetPlayer.displayName}.`,
        ` flexes. ${capsTarget} flexes twice as hard. ATTACK increases for both of them.`,
        ` flexes. ${capsTarget} flexes very hard... They flex themself out of the room!`,
        ` gave ${targetPlayer.displayName} a patient smile.`,
        ` gets close to ${targetPlayer.displayName}. But not too close.`,
        ` gives ${targetPlayer.displayName} a cruel look.`,
        ` gives ${targetPlayer.displayName} a friendly pat.`,
        ` hugs ${targetPlayer.displayName}. Gross slime covers them. ${capsSender}'s SPEED decreased.`,
        ` ignores ${targetPlayer.displayName} and thinks of pollen and sunshine. ${capsSender}'s DEFENSE increased by 1.`,
        ` informs ${targetPlayer.displayName} that they have a great hat!`,
        ` invites ${targetPlayer.displayName} to hang out.`,
        ` kneels and prays for safety. ${capsTarget} remembers their conscience.`,
        ` laughs at ${targetPlayer.displayName} before they say anything funny.`,
        ` lies down. ${capsTarget} lies down too. ${capsTarget} understands life now.`,
        ` lies immobile with ${targetPlayer.displayName}. They feel like they understand the world a little better.`,
        ` makes fun of ${targetPlayer.displayName}.`,
        ` manages to tear their eyes away from ${targetPlayer.displayName}'s hat. They look annoyed...`,
        ` pats ${targetPlayer.displayName}'s chest like a muscular bongo.`,
        ` pats their stomach. ${capsTarget} offers a healthy meal.`,
        ` pays ${randGold} G. ${capsTarget} reduces their ATTACK for this turn!`,
        ` pets ${targetPlayer.displayName}. Their excitement knows no bounds.`,
        ` pets the ${targetPlayer.displayName}. They start to generate a Stage I Happiness Froth.`,
        ` picks on ${targetPlayer.displayName}.`,
        ` presses the yellow button. The phone is resonating with ${targetPlayer.displayName}'s presence!`,
        ` raises their arms and wiggles their fingers. ${capsTarget} freaks out!`,
        ` reaches out. ${capsTarget} recoils from their touch.`,
        ` says hello to ${targetPlayer.displayName}.`,
        ` sings an old lullaby. ${capsTarget} starts to look sleepy...`,
        ` stands up to ${targetPlayer.displayName}.`,
        ` talks to ${targetPlayer.displayName}. ...They don't seem much for conversation. No one is happy with this.`,
        ` talks to ${targetPlayer.displayName}... They don't seem much for conversation. JPEGSTRIPES seems happy with ${sendingPlayer.displayName}.`,
        ` tells ${targetPlayer.displayName} that no one will ever love them the way they are... They struggle to make a retort, and slink away utterly crushed...`,
        ` tells ${targetPlayer.displayName} that their attacks are NOT helpful.`,
        ` tells ${targetPlayer.displayName} that their rump looks like a sack of trash.`,
        ` tells ${targetPlayer.displayName} that there's a mirror behind them.`,
        ` tells ${targetPlayer.displayName} that they aren't funny.`,
        ` tells ${targetPlayer.displayName} their attacks are too easy. The bullets get faster.`,
        ` tells ${targetPlayer.displayName} their attacks are too easy. The bullets get unfair.`,
        ` tells ${targetPlayer.displayName} their attacks are too easy. They don't care.`,
        ` tells ${targetPlayer.displayName} their favorite secret.`,
        ` tells ${targetPlayer.displayName} they have a powerful rudder.`,
        ` tells ${targetPlayer.displayName} they have an impressive wingspan.`,
        ` tells ${targetPlayer.displayName} they have cute winglets.`,
        ` tells ${targetPlayer.displayName} they have nice turbines.`,
        ` tells ${targetPlayer.displayName} they like their taste in movies and books.`,
        ` tells ${targetPlayer.displayName} they're all wrong.`,
        ` tells ${targetPlayer.displayName} they're doing a great job. Their attacks become extreme...`,
        ` tells ${targetPlayer.displayName} to be honest with their feelings.`,
        ` tells ${targetPlayer.displayName} to go away.`,
        ` threatens ${targetPlayer.displayName}. They understood them perfectly. ${capsTarget}'s DEFENSE dropped.`,
        ` threw the stick and ${targetPlayer.displayName} ran to get it. They played fetch for a while.`,
        ` throws the stick. ${capsTarget} brings it back in their mouth.`,
        ` told ${targetPlayer.displayName} a little joke.`,
        ` told ${targetPlayer.displayName} they didn't want to fight. But nothing happened.`,
        ` told ${targetPlayer.displayName} they just want to be friends. They remember someone... ${capsTarget}'s attacks became a little less extreme.`,
        ` took a bite out of ${targetPlayer.displayName}. They recovered 5 HP!`,
        ` tried to eat ${targetPlayer.displayName}, but they weren't weakened enough.`,
        ` tries to console ${targetPlayer.displayName}...`,
        ` wiggles their hips. ${capsTarget} wiggles back. What a meaningful conversation!`
    ]

    const randAction = Math.floor(Math.random() * actions.length)

    // If user paid the target gold
    if (randAction === 40) {
        const differenceInGold = sendingPlayer.gold - randGold
        console.log(`randGold: ${randGold}, senderGold: ${sendingPlayer.gold}, differenceInGold: ${differenceInGold}`)
        if (sendingPlayer.gold <= 0) {
            return ` is out of money. ${capsTarget} shakes their head.`
        } else if (differenceInGold < 0) {
            targetPlayer.gold += sendingPlayer.gold
            sendingPlayer.gold = 0
            return ` empties their pockets. ${capsTarget} lowers the price.`
        } else {
            sendingPlayer.gold -= randGold
            targetPlayer.gold += randGold
        }
    }

    return actions[randAction]
}

function stainedApronHealToggle(user) {
    const sendingPlayer = players[user]

    // If it's time to heal, toggle and return original state
    sendingPlayer.stainedApronHealTime = !sendingPlayer.stainedApronHealTime
    return !sendingPlayer.stainedApronHealTime
}

function deathCheck(chatroom, user, target) {
    const sendingPlayer = players[user]
    const targetPlayer = players[target.toLowerCase()]
    const targetSaveData = playerSave[target.toLowerCase()]
    console.log(`${sendingPlayer.hp <= 0 ? redBg : greenBg} user: ${sendingPlayer.displayName} ${sendingPlayer.hp}/${getUserMaxHP(user)} HP ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} target: ${targetPlayer.displayName} ${targetPlayer.hp}/${getUserMaxHP(target.toLowerCase())} HP ${resetTxt}`)

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
        response += ` ${target}! Stay determined... `

        // Checking if user killed a different user
        if (user !== target) {
            // Appending awarded EXP
            const awardedEXP = 10 + targetPlayer.exp
            response += `${sendingPlayer.displayName} earned ${awardedEXP} EXP`

            // Appending awarded gold
            const randGold = Math.ceil(Math.random() * 100)
            sendingPlayer.gold += randGold
            if (targetPlayer.gold > 0) {
                sendingPlayer.gold += targetPlayer.gold
                targetPlayer.gold = 0
                response += `, got ${target}'s gold, and found ${randGold} G.`
            } else {
                response += ` and ${randGold} gold.`
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
                response += ` ${sendingPlayer.displayName}'s LOVE increased.`
                response += calculateUserLV(user)
            }
        } else {
            if (sendingPlayer.gold > 0) {
                sendingPlayer.gold = 0
                response += ` ${sendingPlayer.displayName} lost all their gold!`
            }
        }

        // Resetting target user's stats
        targetPlayer.dead = true
        targetPlayer.hp = 0
        targetPlayer.lv = 1
        targetPlayer.exp = 0
        targetPlayer.next = 10
        targetPlayer.at = 0
        targetPlayer.df = 0

        const msgDelay = chatroom === `#${BOT_USERNAME}` ? 1000 : 2000
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
    const userLV = players[user].lv
    let maxHP = baseHP + (4 * userLV)
    if (userLV >= 20) { maxHP = 99 }
    return maxHP
}

function calculateUserATK(user) {
    const userLV = players[user].lv
    let attack = baseAT + (2 * userLV)
    if (userLV >= 20) { attack = 38 }
    return attack
}

function calculateUserDEF(user) {
    const userLV = players[user].lv
    let defense = Math.floor((userLV - 1) * baseDF)
    if (userLV >= 20) { defense = 4 }
    return defense
}

function calculateUserNextLV(user) {
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

function calculateUserLV(user) {
    const player = players[user]
    let foundItemsAppend = ``
    let collectedItems = []
    while (player.next <= 0) {
        player.lv += 1
        if (player.lv === 2) { collectedItems.push(`Snowman Piece`, `Toy Knife`, `Faded Ribbon`) }
        if (player.lv === 3) { collectedItems.push(`Astronaut Food`, `Ballet Shoes`, `Old Tutu`) }
        if (player.lv === 4) { collectedItems.push(`Abandoned Quiche`, `Burnt Pan`, `Stained Apron`) }
        if (player.lv === 5) { collectedItems.push(`Instant Noodles`) }
        if (player.lv === 6) { collectedItems.push(`Hush Puppy`) }
        if (player.lv === 7) { collectedItems.push(`Worn Dagger`, `Heart Locket`) }
        if (player.lv === 8) { collectedItems.push(`Bad Memory`) }
        if (player.lv === 9) { collectedItems.push(`Last Dream`) }
        if (player.lv === 10) { collectedItems.push(`Real Knife`, `The Locket`) }
        if (player.lv === 11) { collectedItems.push(`Puppydough Icecream`) }
        if (player.lv === 12) { collectedItems.push(`Pumpkin Rings`) }
        if (player.lv === 13) { collectedItems.push(`Croquet Roll`) }
        if (player.lv === 14) { collectedItems.push(`Ghost Fruit`) }
        if (player.lv === 15) { collectedItems.push(`Stoic Onion`) }
        if (player.lv === 16) { collectedItems.push(`Rock Candy`) }
        player.next += calculateUserNextLV(user)
        player.at = calculateUserATK(user)
        player.df = calculateUserDEF(user)
        player.hp += 4
    }
    if (collectedItems.length) {
        for (const item of collectedItems) { player.inventory.push(item) }
        foundItemsAppend = ` ${player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)} found: ` + collectedItems.join(`, `)
    }
    console.log(`${cyanBg} ${player.displayName} reached LV ${player.lv}, next: ${player.next}, ATK: ${player.at}, DEF: ${player.df}, HP: ${player.hp} / ${getUserMaxHP(user)} ${resetTxt}`)
    console.log(`Inventory:`, player.inventory)
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
    const player = players[user]
    const capsName = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)

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

    if (player.lv < itemLvThreshold[str]) { return `${player.displayName}, that item isn't available to you yet! :(` }

    if (player.gold < price) { return `${player.displayName}, that item costs ${price}G, you have ${player.gold}G! :(` }

    if (str === `spider donut`) {
        player.gold -= price
        player.inventory.push(`Spider Donut`)
        return `* ${capsName} bought the Spider Donut!`
    }
    if (str === `spider cider`) {
        player.gold -= price
        player.inventory.push(`Spider Cider`)
        return `* ${capsName} bought the Spider Cider!`
    }
    if (str === `nice cream`) {
        player.gold -= price
        player.inventory.push(`Nice Cream`)
        return `* ${capsName} bought the Nice Cream!`
    }
    if (str === `bisicle`) {
        player.gold -= price
        player.inventory.push(`Bisicle`)
        return `* ${capsName} bought the Bisicle!`
    }
    if (str === `cinnamon bunny`) {
        player.gold -= price
        player.inventory.push(`Cinnamon Bunny`)
        return `* ${capsName} bought the Cinnamon Bunny!`
    }
    if (str === `tough glove`) {
        player.gold -= price
        player.inventory.push(`Tough Glove`)
        return `* ${capsName} bought the Tough Glove!`
    }
    if (str === `manly bandanna`) {
        player.gold -= price
        player.inventory.push(`Manly Bandanna`)
        return `* ${capsName} bought the Manly Bandanna!`
    }
    if (str === `crab apple`) {
        player.gold -= price
        player.inventory.push(`Crab Apple`)
        return `* ${capsName} bought the Crab Apple!`
    }
    if (str === `sea tea`) {
        player.gold -= price
        player.inventory.push(`Sea Tea`)
        return `* ${capsName} bought the Sea Tea!`
    }
    if (str === `temmie flakes`) {
        player.gold -= price
        player.inventory.push(`Temmie Flakes`)
        return `* ${capsName} bought the Temmie Flakes!`
    }
    if (str === `torn notebook`) {
        player.gold -= price
        player.inventory.push(`Torn Notebook`)
        return `* ${capsName} bought the Torn Notebook!`
    }
    if (str === `cloudy glasses`) {
        player.gold -= price
        player.inventory.push(`Cloudy Glasses`)
        return `* ${capsName} bought the Cloudy Glasses!`
    }
    if (str === `temmie armor`) {
        player.gold -= price
        player.inventory.push(`Temmie Armor`)
        return `* ${capsName} bought the Temmie Armor!`
    }
    if (str === `hot dog`) {
        player.gold -= price
        player.inventory.push(`Hot Dog...?`)
        return `* ${capsName} bought the Hot Dog...?!`
    }
    if (str === `hot cat`) {
        player.gold -= price
        player.inventory.push(`Hot Cat`)
        return `* ${capsName} bought the Hot Cat!`
    }
    if (str === `junk food`) {
        player.gold -= price
        player.inventory.push(`Junk Food`)
        return `* ${capsName} bought the Junk Food!`
    }
    if (str === `starfait`) {
        player.gold -= price
        player.inventory.push(`Starfait`)
        return `* ${capsName} bought the Starfait!`
    }
    if (str === `glamburger`) {
        player.gold -= price
        player.inventory.push(`Glamburger`)
        return `* ${capsName} bought the Glamburger!`
    }
    if (str === `legendary hero`) {
        player.gold -= price
        player.inventory.push(`Legendary Hero`)
        return `* ${capsName} bought the Legendary Hero!`
    }
    if (str === `steak in the shape of mettaton's face`) {
        player.gold -= price
        player.inventory.push(`Steak in the Shape of Mettaton's Face`)
        return `* ${capsName} bought the Steak in the Shape of Mettaton's Face!`
    }
    if (str === `empty gun`) {
        player.gold -= price
        player.inventory.push(`Empty Gun`)
        return `* ${capsName} bought the Empty Gun!`
    }
    if (str === `cowboy hat`) {
        player.gold -= price
        player.inventory.push(`Cowboy Hat`)
        return `* ${capsName} bought the Cowboy Hat!`
    }
    if (str === `popato chisps`) {
        player.gold -= price
        player.inventory.push(`Popato Chisps`)
        return `* ${capsName} bought the Popato Chisps!`
    }
    return `If you are reading this, ${player.displayName}, I messed up somehow.`
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
    const player = players[user]
    const capsName = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)
    let healAmt = consumableItems[str]
    const burntPanBonus = player.weapon === `Burnt Pan` ? 4 : 0
    if (burntPanBonus > 0) { console.log(`${magentaBg} ${player.displayName} is using the Burnt Pan, heal amount +${burntPanBonus} ${resetTxt}`) }

    // Consumable items
    if (str === `bandage`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const bandageText = [
            `* ${capsName} re-applied the used Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied the gross Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied their old, used Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied the dirty Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied the well-used Bandage. Still kind of gooey.`
        ]
        const randIdx = Math.floor(Math.random() * bandageText.length)
        let itemText = bandageText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `monster candy`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const monstercandyText = [
            `* ${capsName} ate a Monster Candy. Very un-licorice-like.`,
            `* ${capsName} ate a Monster Candy. ...tastes like licorice.`
        ]
        const randIdx = Math.floor(Math.random() * monstercandyText.length)
        let itemText = monstercandyText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `spider donut`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const spiderdonutText = [
            `* ${capsName} ate a Spider Donut.`,
            `* ${capsName} ate a Spider Donut. Made with Spider Cider in the batter.`
        ]
        const randIdx = Math.floor(Math.random() * spiderdonutText.length)
        let itemText = spiderdonutText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `spider cider`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const spiderciderText = [
            `* ${capsName} drank a Spider Cider.`,
            `* ${capsName} drank a Spider Cider. Made with whole spiders, not just the juice.`
        ]
        const randIdx = Math.floor(Math.random() * spiderciderText.length)
        let itemText = spiderciderText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `butterscotch pie`) {
        player.inventory.splice(idx, 1)
        player.hp = getUserMaxHP(user)
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ALL ${resetTxt}`)
        return `* ${capsName} ate the Butterscotch-Cinnamon Pie. ${capsName}'s HP was maxed out.`
    }
    if (str === `snail pie`) {
        player.inventory.splice(idx, 1)
        player.hp = getUserMaxHP(user) - 1
        const snailpieText = [
            `* ${capsName} ate the Snail Pie. ${capsName}'s HP was maxed out.`,
            `* ${capsName} ate the Snail Pie. It's an acquired taste. ${capsName}'s HP was maxed out.`
        ]
        const randIdx = Math.floor(Math.random() * snailpieText.length)
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ALL - 1 ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return snailpieText[randIdx]
    }
    if (str === `snowman piece`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const snowmanpieceText = [
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece in front of the Snowman it came from.`
        ]
        const randIdx = Math.floor(Math.random() * snowmanpieceText.length)
        let itemText = snowmanpieceText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `nice cream`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const nicecreamText = [
            `* ${capsName} ate a Nice Cream. You're super spiffy!`,
            `* ${capsName} ate a Nice Cream. Are those claws natural?`,
            `* ${capsName} ate a Nice Cream. Love yourself! I love you!`,
            `* ${capsName} ate a Nice Cream. You look nice today!`,
            `* ${capsName} ate a Nice Cream. (An illustration of a hug)`,
            `* ${capsName} ate a Nice Cream. Have a wonderful day!`,
            `* ${capsName} ate a Nice Cream. Is this as sweet as you?`,
            `* ${capsName} ate a Nice Cream. You're just great!`
        ]
        const randIdx = Math.floor(Math.random() * nicecreamText.length)
        let itemText = nicecreamText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `bisicle`) {
        player.inventory[idx] = `Unisicle`
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const bisicleText = [
            `* ${capsName} eats one half of the Bisicle.`,
            `* ${capsName} eats one half of the Bisicle. It is now a Unisicle.`
        ]
        const randIdx = Math.floor(Math.random() * bisicleText.length)
        let itemText = bisicleText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `unisicle`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const unisicleText = [
            `* ${capsName} ate a Unisicle.`,
            `* ${capsName} ate a Unisicle. It's a SINGLE-pronged popsicle. Wait, that's just normal...`
        ]
        const randIdx = Math.floor(Math.random() * unisicleText.length)
        let itemText = unisicleText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `cinnamon bunny`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const cinnamonbunnyText = [
            `* ${capsName} ate a Cinnamon Bunny.`,
            `* ${capsName} ate a Cinnamon Bunny. A cinnamon roll in a shape of a bunny.`
        ]
        const randIdx = Math.floor(Math.random() * cinnamonbunnyText.length)
        let itemText = cinnamonbunnyText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `astronaut food`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const astronautfoodText = [
            `* ${capsName} ate some Astronaut Food.`,
            `* ${capsName} ate some Astronaut Food. It's for a pet astronaut?`
        ]
        const randIdx = Math.floor(Math.random() * astronautfoodText.length)
        let itemText = astronautfoodText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `crab apple`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const crabappleText = [
            `* ${capsName} ate a Crab Apple.`,
            `* ${capsName} ate a Crab Apple. An aquatic fruit that resembles a crustacean.`
        ]
        const randIdx = Math.floor(Math.random() * crabappleText.length)
        let itemText = crabappleText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `sea tea`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const seateaText = [
            `* ${capsName} drank a Sea Tea.`,
            `* ${capsName} drank a Sea Tea. Made from glowing marsh water.`
        ]
        const randIdx = Math.floor(Math.random() * seateaText.length)
        let itemText = seateaText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `abandoned quiche`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const abandonedquicheText = [
            `* ${capsName} ate the Abandoned Quiche.`,
            `* ${capsName} ate the quiche they found under a bench.`,
            `* ${capsName} ate a psychologically-damaged spinach egg pie.`
        ]
        const randIdx = Math.floor(Math.random() * abandonedquicheText.length)
        let itemText = abandonedquicheText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `temmie flakes`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const temmieflakesText = [
            `* ${capsName} ate some Temmie Flakes (cheap). hOI!`,
            `* ${capsName} ate some Temmie Flakes (cheap). It's just torn up pieces of colored construction paper.`,
            `* ${capsName} ate some Temmie Flakes (normal). hOI!!! i'm tEMMIE!!`,
            `* ${capsName} ate some Temmie Flakes (normal). It's just torn up pieces of colored construction paper.`,
            `* ${capsName} ate some Temmie Flakes (expensiv). WOA!! u gota... tem flakes!!!`,
            `* ${capsName} ate some Temmie Flakes (expensiv). It's just torn up pieces of colored construction paper.`,
            `* ${capsName} ate some Temmie Flakes (premiem). FOOB!!!`,
            `* ${capsName} ate some Temmie Flakes (premiem). It's just torn up pieces of colored construction paper.`
        ]
        const randIdx = Math.floor(Math.random() * temmieflakesText.length)
        let itemText = temmieflakesText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `dog salad`) {
        player.inventory.splice(idx, 1)
        const dogSaladText = [
            `* ${capsName} ate Dog Salad. Oh. There are bones...`,
            `* ${capsName} ate Dog Salad. Oh. Fried tennis ball...`,
            `* ${capsName} ate Dog Salad. Oh. Tastes yappy...`,
            `* ${capsName} ate Dog Salad. It's literally garbage??? ${capsName}'s HP was maxed out.`,
        ]
        const randIdx = Math.floor(Math.random() * dogSaladText.length)
        let dogSaladHealAmt = 99
        if (randIdx === 0) {
            dogSaladHealAmt = 2
            dogSaladHealAmt += burntPanBonus
            player.hp += dogSaladHealAmt
        }
        if (randIdx === 1) {
            dogSaladHealAmt = 10
            dogSaladHealAmt += burntPanBonus
            player.hp += dogSaladHealAmt
        }
        if (randIdx === 2) {
            dogSaladHealAmt = 30
            dogSaladHealAmt += burntPanBonus
            player.hp += dogSaladHealAmt
        }
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        if (randIdx === 3) { player.hp = getUserMaxHP(user) }
        let itemText = dogSaladText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${dogSaladHealAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, dogSaladHealAmt: ${dogSaladHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `instant noodles`) {
        player.inventory.splice(idx, 1)
        const instantnoodlesText = [
            `* ${capsName} ate the Instant Noodles. They're better dry.`,
            `* ${capsName} cooked the Instant Noodles. Comes with everything you need for a quick meal!`,
            `* ${capsName} spends four minutes cooking Instant Noodles before eating them. ... they don't taste very good. They add the flavor packet. That's better. Not great, but better.`
        ]
        const randIdx = Math.floor(Math.random() * instantnoodlesText.length)
        let instantNoodlesHealAmt = 4
        if (randIdx === 0) {
            instantNoodlesHealAmt = 90
            instantNoodlesHealAmt += burntPanBonus
            player.hp += instantNoodlesHealAmt
        }
        if (randIdx === 1) {
            instantNoodlesHealAmt = 15
            instantNoodlesHealAmt += burntPanBonus
            player.hp += instantNoodlesHealAmt
        }
        if (randIdx === 2) {
            instantNoodlesHealAmt = 4
            instantNoodlesHealAmt += burntPanBonus
            player.hp += instantNoodlesHealAmt
        }
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = instantnoodlesText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${instantNoodlesHealAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, instantNoodlesHealAmt: ${instantNoodlesHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hot dog`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const hotdogText = [
            `* ${capsName} ate a Hot Dog...? (Bark!)`,
            `* ${capsName} ate a Hot Dog...? (Bark!)`,
            `* ${capsName} ate a Hot Dog...? The "meat" is made of something called a "water sausage."`
        ]
        const randIdx = Math.floor(Math.random() * hotdogText.length)
        let itemText = hotdogText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hot cat`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const hotcatText = [
            `* ${capsName} ate a Hot Cat. (Meow!)`,
            `* ${capsName} ate a Hot Cat. (Meow!)`,
            `* ${capsName} ate a Hot Cat. Like a hot dog, but with little cat ears on the end.`
        ]
        const randIdx = Math.floor(Math.random() * hotcatText.length)
        let itemText = hotcatText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `junk food`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const junkfoodText = [
            `* ${capsName} used Junk Food.`,
            `* ${capsName} used Junk Food.`,
            `* ${capsName} used Junk Food. Food that was probably once thrown away.`,
            `* ${capsName} used Junk Food. (Eating garbage?!)`
        ]
        const randIdx = Math.floor(Math.random() * junkfoodText.length)
        let itemText = junkfoodText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hush puppy`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} ate a Hush Puppy. Dog-magic is neutralized.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `starfait`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const starfaitText = [
            `* ${capsName} ate a Starfait.`,
            `* ${capsName} ate a Starfait.`,
            `* ${capsName} ate a Starfait.`,
            `* ${capsName} ate a Starfait. A sweet treat made of sparkling stars.`,
            `* ${capsName} ate a Starfait. Viewer ratings go up by 200 points!`,
            `* ${capsName} ate a Starfait. Viewer ratings go up by 200 points!`
        ]
        const randIdx = Math.floor(Math.random() * starfaitText.length)
        let itemText = starfaitText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `glamburger`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const glamburgerText = [
            `* ${capsName} ate a Glamburger.`,
            `* ${capsName} ate the Glamburger. Made of edible glitter and sequins.`
        ]
        const randIdx = Math.floor(Math.random() * glamburgerText.length)
        let itemText = glamburgerText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `legendary hero`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const legendaryheroText = [
            `* ${capsName} ate a Legendary Hero.`,
            `* ${capsName} ate the Legendary Hero. Sandwich shaped like a sword. Increases ATTACK when eaten.`,
            `* ${capsName} ate a Legendary Hero. Viewer ratings go up by 500 points!`
        ]
        const randIdx = Math.floor(Math.random() * legendaryheroText.length)
        let itemText = legendaryheroText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `steak in the shape of mettaton's face`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const steakText = [
            `* ${capsName} ate the Steak in the Shape of Mettaton's Face. They feel like it's not made of real meat...`,
            `* ${capsName} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts.`,
            `* ${capsName} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts. Viewer ratings go up by 700 points!`
        ]
        const randIdx = Math.floor(Math.random() * steakText.length)
        let itemText = steakText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `popato chisps`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        const popatochispsText = [
            `* ${capsName} ate some Popato Chisps.`,
            `* ${capsName} ate some Popato Chisps. Regular old popato chisps.`
        ]
        const randIdx = Math.floor(Math.random() * popatochispsText.length)
        let itemText = popatochispsText[randIdx]
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `bad memory`) {
        player.inventory.splice(idx, 1)
        let itemText = `* ${capsName} consumes the Bad Memory. `
        if (player.hp <= 3) {
            player.hp = getUserMaxHP(user)
            itemText += `${capsName}'s HP was maxed out.`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ALL ${resetTxt}`)
        } else {
            player.hp += healAmt
            itemText += `${player.displayName} lost 1 HP.`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        }
        return itemText
    }
    if (str === `last dream`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} used Last Dream. Through DETERMINATION, the dream became true.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered 12 HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `puppydough icecream`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} ate Puppydough Icecream. Mmm! Tastes like puppies.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `pumpkin rings`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} ate Pumpkin Rings. A small pumpkin cooked like onion rings.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `croquet roll`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} hit a Croquet Roll into their mouth. Fried dough traditionally served with a mallet.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `ghost fruit`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} ate a Ghost Fruit. It will never pass to the other side.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `stoic onion`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} ate a Stoic Onion. They didn't cry...`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `rock candy`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > getUserMaxHP(user)) { player.hp = getUserMaxHP(user) }
        let itemText = `* ${capsName} ate Rock Candy. It's a rock.`
        player.hp === getUserMaxHP(user) ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }

    // Weapons
    if (str === `stick`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Stick`
        const stickText = [
            `* ${capsName} threw the Stick away. Then picked it back up.`,
            `* ${capsName} equipped the Stick. Its bark is worse than its bite.`
        ]
        const randIdx = Math.floor(Math.random() * stickText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Stick, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return stickText[randIdx]
    }
    if (str === `toy knife`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Toy Knife`
        const toyKnifeText = [
            `* ${capsName} equipped the Toy Knife. +3 ATTACK`,
            `* ${capsName} equipped the Toy Knife. Made of plastic. A rarity nowadays. +3 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * toyKnifeText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Toy Knife, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return toyKnifeText[randIdx]
    }
    if (str === `tough glove`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Tough Glove`
        const toughGloveText = [
            `* ${capsName} equipped the Tough Glove. +5 ATTACK`,
            `* ${capsName} equipped the Tough Glove. A worn pink leather glove. For five-fingered folk. +5 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * toughGloveText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Tough Glove, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return toughGloveText[randIdx]
    }
    if (str === `ballet shoes`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Ballet Shoes`
        const balletShoesText = [
            `* ${capsName} equipped the Ballet Shoes. +7 ATTACK`,
            `* ${capsName} equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous. +7 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * balletShoesText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Ballet Shoes, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return balletShoesText[randIdx]
    }
    if (str === `torn notebook`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Torn Notebook`
        console.log(`${cyanBg} ${player.displayName} equipped the Torn Notebook, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return `* ${capsName} equipped the Torn Notebook. +2 ATTACK`
    }
    if (str === `burnt pan`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Burnt Pan`
        const burntPanText = [
            `* ${capsName} equipped the Burnt Pan. +10 ATTACK`,
            `* ${capsName} equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP. +10 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * burntPanText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Burnt Pan, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return burntPanText[randIdx]
    }
    if (str === `empty gun`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Empty Gun`
        const emptyGunText = [
            `* ${capsName} equipped the Empty Gun. +12 ATTACK`,
            `* ${capsName} equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low. +12 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * emptyGunText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Empty Gun, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return emptyGunText[randIdx]
    }
    if (str === `worn dagger`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Worn Dagger`
        const wornDaggerText = [
            `* ${capsName} equipped the Worn Dagger. +15 ATTACK`,
            `* ${capsName} equipped the Worn Dagger. Perfect for cutting plants and vines. +15 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * wornDaggerText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Worn Dagger, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return wornDaggerText[randIdx]
    }
    if (str === `real knife`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Real Knife`
        console.log(`${cyanBg} ${player.displayName} equipped the Real Knife, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return `* ${capsName} equipped the Real Knife. About time. +99 ATTACK`
    }

    // Armor
    if (str === `faded ribbon`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Faded Ribbon`
        const fadedRibbonText = [
            `* ${capsName} equipped the Faded Ribbon. +5 DEFENSE`,
            `* ${capsName} equipped the Faded Ribbon. If you're cuter, they won't hit you as hard. +5 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * fadedRibbonText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Faded Ribbon, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return fadedRibbonText[randIdx]
    }
    if (str === `manly bandanna`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Manly Bandanna`
        const manlyBandannaText = [
            `* ${capsName} equipped the Manly Bandanna. +7 DEFENSE`,
            `* ${capsName} equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it. +7 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * manlyBandannaText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Manly Bandanna, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return manlyBandannaText[randIdx]
    }
    if (str === `old tutu`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Old Tutu`
        const oldTutuText = [
            `* ${capsName} equipped the Old Tutu. +10 DEFENSE`,
            `* ${capsName} equipped the Old Tutu. Finally, a protective piece of armor. +10 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * oldTutuText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Old Tutu, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return oldTutuText[randIdx]
    }
    if (str === `cloudy glasses`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Cloudy Glasses`
        const cloudyGlassesText = [
            `* ${capsName} equipped the Cloudy Glasses. +5 DEFENSE`,
            `* ${capsName} equipped the Cloudy Glasses. Glasses marred with wear. +5 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * cloudyGlassesText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Cloudy Glasses, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return cloudyGlassesText[randIdx]
    }
    if (str === `temmie armor`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Temmie Armor`
        const temmieArmorText = [
            `* ${capsName} donned the Temmie Armor. The things you can do with a college education!`,
            `* ${capsName} donned the Temmie Armor. tem armor so GOOds! any battle becom! a EASY victories!!!`
        ]
        const randIdx = Math.floor(Math.random() * temmieArmorText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Temmie Armor, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return temmieArmorText[randIdx]
    }
    if (str === `stained apron`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Stained Apron`
        const stainedApronText = [
            `* ${capsName} equipped the Stained Apron. +11 DEFENSE`,
            `* ${capsName} equipped the Stained Apron. Heals 1 HP every other turn.`
        ]
        const randIdx = Math.floor(Math.random() * stainedApronText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Stained Apron, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return stainedApronText[randIdx]
    }
    if (str === `cowboy hat`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Cowboy Hat`
        const cowboyHatText = [
            `* ${capsName} equipped the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
            `* ${capsName} equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard. +5 ATTACK +12 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * cowboyHatText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Cowboy Hat, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return cowboyHatText[randIdx]
    }
    if (str === `heart locket`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Heart Locket`
        const heartLocketText = [
            `* ${capsName} equipped the Heart Locket. +15 DEFENSE`,
            `* ${capsName} equipped the Heart Locket. It says "Best Friends Forever." +15 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * heartLocketText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Heart Locket, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return heartLocketText[randIdx]
    }
    if (str === `the locket`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `The Locket`
        console.log(`${cyanBg} ${player.displayName} equipped the Locket, HP: ${player.hp}/${getUserMaxHP(user)} ${resetTxt}`)
        return `* ${capsName} equipped the Locket. Right where it belongs. +99 DEFENSE`
    }
    return `* ${capsName} used 0. If you are reading this, I messed up somehow.`
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    if (firstConnection) {
        printLogo()
        console.log(`* Connected to ${addr}:${port}`)
        setTimeout(() => {
            client.say(CHANNEL_1, `I have been rebooted :)`)
            console.log(`* UndertaleBot blocks the way!`)
        }, 3000)
    } else {
        console.log(`* Reconnected to ${addr}:${port}`)
        client.say(CHANNEL_1, `Reconnecting...`)
        setTimeout(() => client.say(CHANNEL_1, `Reconnected!`), 3000)
    }
    firstConnection = false
}