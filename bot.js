require(`dotenv`).config()
const tmi = require('tmi.js')
const BOT_USERNAME = process.env.BOT_USERNAME
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const CHANNEL_1 = process.env.CHANNEL_1
const CHANNEL_2 = process.env.CHANNEL_2
const CHANNEL_3 = process.env.CHANNEL_3

// Define configuration options
const opts = {
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [
        CHANNEL_1,
        CHANNEL_2,
        CHANNEL_3
    ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

const baseHP = 16
const baseAT = -2
const baseDF = 0.25
let players = {
    dummy: {
        lv: 1,
        hp: 20,
        dead: false,
        at: 0,
        df: 0,
        exp: 100,
        next: 10,
        weapon: `Stick`,
        armor: `Bandage`,
        gold: 0
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
    if (self) { return } // Ignore messages from the bot

    // Message context
    const sender = tags["display-name"]
    const senderIsSubbed = tags["subscriber"]
    const senderIsAMod = tags["mod"]
    const senderIsVIP = tags["vip"]
    const senderHasTurbo = tags["turbo"]
    const bits = tags["bits"]
    const color = tags["color"]
    const msgID = tags["id"]
    const replyMsgSender = tags["reply-parent-display-name"]
    const replyMsgBody = tags["reply-parent-msg-body"]

    // Command and arguments parser
    const args = msg.split(' ')
    const command = args.shift().toLowerCase()
    const toUser = args[0] ? getToUser(args[0]) : ``

    // Log message + optional 
    console.log(`\x1b[36m%s\x1b[0m`, `${channel} ${sender}:`, `${msg}`)
    // console.log(`command:`, command)
    // console.log(`args:`, args)
    // console.log(`toUser:`, toUser)

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
            gold: 0
        }
    }
    const sendingPlayer = players[sender.toLowerCase()]
    const targetPlayer = toUser && toUser.toLowerCase() !== sender.toLowerCase() && toUser.toLowerCase() in players ? players[toUser.toLowerCase()] : null
    // console.log(sendingPlayer, targetPlayer)

    // *****************
    // ** REPLY CASES **
    // *****************

    // MEMORY
    if (command === `!memory`) {
        let response = `Here's everyone I know: `
        for (const player in players) {
            response += `${player} `
            console.log(`\x1b[31m%s\x1b[0m`, `${channel} <${player}> ${players[player][`hp`]} HP${players[player][`gold`] > 0 ? `, ${players[player][`gold`]} gold` : ``} ${players[player][`dead`] ? `(dead)` : `(alive)`}`)
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // STATS
    if (command === `!stats`) {
        let response
        if (targetPlayer) {
            response = `"${toUser}" LV: ${targetPlayer[`lv`]}, HP: ${targetPlayer[`hp`]}/${getUserMaxHP(toUser)}, AT: ${targetPlayer[`at`]}(${weaponsATK[targetPlayer[`weapon`]]}), DF: ${targetPlayer[`df`]}(${armorDEF[targetPlayer[`armor`]]}), EXP: ${targetPlayer[`exp`]}, NEXT: ${targetPlayer[`next`]}, WEAPON: ${targetPlayer[`weapon`]}, ARMOR: ${targetPlayer[`armor`]}, GOLD: ${targetPlayer[`gold`]}`
        } else if (toUser) {
            response = `${toUser} isn't registered :(`
        } else {
            response = `"${sender}" LV: ${sendingPlayer[`lv`]}, HP: ${sendingPlayer[`hp`]}/${getUserMaxHP(sender)}, AT: ${sendingPlayer[`at`]}(${weaponsATK[sendingPlayer[`weapon`]]}), DF: ${sendingPlayer[`df`]}(${armorDEF[sendingPlayer[`armor`]]}), EXP: ${sendingPlayer[`exp`]}, NEXT: ${sendingPlayer[`next`]}, WEAPON: ${sendingPlayer[`weapon`]}, ARMOR: ${sendingPlayer[`armor`]}, GOLD: ${sendingPlayer[`gold`]}`
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // REVIVE (for testing)
    if (command === `!revive`) {
        let response
        if (sender === `JPEGSTRIPES`) {
            // console.log(`\x1b[31m%s\x1b[0m`, players)
            for (const player in players) {
                players[player][`hp`] = getUserMaxHP(player)
                players[player][`dead`] = false
                // console.log(`\x1b[31m%s\x1b[0m`, `${player}: ${players[player][`hp`]}, dead: ${players[player][`dead`]}`)
            }
            response = `Everyone is alive :)`
            client.say(channel, response)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
        } else {
            response = `You can't use this command, ${sender} ;)`
            client.say(channel, response)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
        }
    }

    // SPAMTON QUOTE
    if (command === `!spamton`) {
        const response = getSpamtonQuote(args[0])
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // FIGHT
    if (command === `!fight`) {
        if (sendingPlayer[`dead`]) {
            const reply = `Sorry ${sender}, you are dead! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        if (toUser) {
            let reply
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()][`dead`]) {
                    reply = `${toUser} is already dead! :(`
                    client.say(channel, reply)
                    console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                    return
                }
            } else {
                reply = `${toUser} is not a registered player :(`
                client.say(channel, reply)
                console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
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
        const attackBonus = sendingPlayer[`at`]
        const defenseBonus = targetPlayer ? targetPlayer[`df`] : sendingPlayer[`df`]

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
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)

        if (targetPlayer) {
            if (randNum === 0) {
                targetPlayer[`hp`] -= smallDamageDealt
                console.log(`\x1b[31m%s\x1b[0m`, `weaponDamage: ${weaponDamage}, smallDamage: ${smallDamage}, attackBonus:, ${attackBonus}, armorDeduction: ${armorDeduction}, defenseBonus:, ${defenseBonus}`)
            } else if (randNum === 1) {
                targetPlayer[`hp`] -= mediumDamageDealt
                console.log(`\x1b[31m%s\x1b[0m`, `weaponDamage: ${weaponDamage}, mediumDamage: ${mediumDamage}, attackBonus:, ${attackBonus}, armorDeduction: ${armorDeduction}, defenseBonus:, ${defenseBonus}`)
            } else if (randNum === 2) {
                targetPlayer[`hp`] -= bigDamageDealt
                console.log(`\x1b[31m%s\x1b[0m`, `weaponDamage: ${weaponDamage}, bigDamage: ${bigDamage}, attackBonus:, ${attackBonus}, armorDeduction: ${armorDeduction}, defenseBonus:, ${defenseBonus}`)
            }
            deathCheck(channel, sender, toUser)
        } else if (!toUser) {
            if (randNum === 0) {
                sendingPlayer[`hp`] -= ((smallDamage + weaponDamage) - armorDeduction)
                console.log(`\x1b[31m%s\x1b[0m`, `weaponDamage: ${weaponDamage}, smallDamage: ${smallDamage}, attackBonus:, ${attackBonus}, armorDeduction: ${armorDeduction}, defenseBonus:, ${defenseBonus}`)
            } else if (randNum === 1) {
                sendingPlayer[`hp`] -= ((mediumDamage + weaponDamage) - armorDeduction)
                console.log(`\x1b[31m%s\x1b[0m`, `weaponDamage: ${weaponDamage}, mediumDamage: ${mediumDamage}, attackBonus:, ${attackBonus}, armorDeduction: ${armorDeduction}, defenseBonus:, ${defenseBonus}`)
            } else if (randNum === 2) {
                sendingPlayer[`hp`] -= ((bigDamage + weaponDamage) - armorDeduction)
                console.log(`\x1b[31m%s\x1b[0m`, `weaponDamage: ${weaponDamage}, bigDamage: ${bigDamage}, attackBonus:, ${attackBonus}, armorDeduction: ${armorDeduction}, defenseBonus:, ${defenseBonus}`)
            }
            deathCheck(channel, sender, sender)
        }
    }

    // ACT
    if (command === `!act`) {
        if (sendingPlayer[`dead`]) {
            const reply = `Sorry ${sender}, you are dead! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        if (toUser) {
            let reply
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()][`dead`]) {
                    reply = `Sorry ${sender}, ${toUser} is dead! :(`
                    client.say(channel, reply)
                    console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                    return
                }
            } else {
                reply = `${toUser} is not a registered player :(`
                client.say(channel, reply)
                console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                return
            }
        }

        // Check if toUser is dummy
        if (toUser.toLowerCase() === `dummy`) {
            const flavorText = [
                `* ${sender} encountered the Dummy. Dummy stands around absentmindedly.`,
                `* ${sender} tried to talk to the DUMMY. It doesn't seem much for conversation. TORIEL seems happy with you.`,
                `* ${sender} checked the Dummy: A cotton heart and a button eye, you are the apple of my eye`
            ]
            const reply = flavorText[Math.floor(Math.random() * flavorText.length)]

            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        let response = `* ${sender} `
        targetPlayer ? response += getAction(sender, toUser) : response += getThirdPersonFlavorText()
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // ITEM
    if (command === `!item`) {
        if (sendingPlayer[`dead`]) {
            const reply = `Sorry ${sender}, you are dead! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        if (toUser) {
            let reply
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()][`dead`]) {
                    reply = `Sorry ${sender}, ${toUser} is dead! :(`
                    client.say(channel, reply)
                    console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                    return
                }
            } else {
                reply = `${toUser} is not a registered player :(`
                client.say(channel, reply)
                console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                return
            }
        }

        let response
        targetPlayer ? response = fetchGivenItemText(sender, toUser) : response = fetchItemText(sender)
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // EQUIP
    if (command === `!equip`) {
        if (sendingPlayer[`dead`]) {
            const reply = `Sorry ${sender}, you are dead! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        if (toUser) {
            let reply
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()][`dead`]) {
                    reply = `Sorry ${sender}, ${toUser} is dead! :(`
                    client.say(channel, reply)
                    console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                    return
                }
            } else {
                reply = `${toUser} is not a registered player :(`
                client.say(channel, reply)
                console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
                return
            }
        }

        let response = `* ${sender} `
        if (toUser && toUser.toLowerCase() !== sender.toLowerCase()) {
            response += `gave ${toUser} `
            response += fetchGivenWeaponOrArmor(toUser.toLowerCase())
        } else {
            response += fetchWeaponOrArmor(sender.toLowerCase())
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // MERCY
    if (command === `!mercy`) {
        if (sendingPlayer[`dead`]) {
            const reply = `Sorry ${sender}, you are dead! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
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
                client.say(channel, response)
                console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
                return
                // If toUser is dead
            } else if (targetPlayer[`dead`]) {
                response = `Sorry ${sender}, ${toUser} is dead! :(`
                client.say(channel, response)
                console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
                return
            } else if (randNum === 1) {
                response += `YOU WON! ${toUser} was spared. ${sender} earned 0 EXP and ${randGoldAmt} gold.`
                sendingPlayer[`gold`] += randGoldAmt
                sendingPlayer[`hp`] = getUserMaxHP(sender)
                targetPlayer[`hp`] = getUserMaxHP(toUser)
            } else {
                response += `${sender} tried to spare ${toUser}. ${toUser} `
                response += getThirdPersonFlavorText()
            }
        } else {
            response += `${sender} tried to spare themself. But nothing happened.`
        }

        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
        console.log(`\x1b[31m%s\x1b[0m`, `sender: ${sender} ${sendingPlayer[`hp`]}, toUser: ${toUser || `none`} ${targetPlayer ? targetPlayer[`hp`] : ``}, randNum: ${randNum}`)
    }

    // HP
    if (command === `!hp`) {
        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer[`hp`]} HP :)`
            if (targetPlayer[`dead`]) { response += ` ${toUser} is dead :(` }
        } else if (toUser) {
            response = `${toUser} isn't registered :(`
        } else {
            response = `${sender} has ${sendingPlayer[`hp`]} HP :)`
            if (sendingPlayer[`dead`]) { response += ` You are dead :(` }
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // GOLD
    if (command === `!gold`) {
        let response
        if (targetPlayer) {
            response = `${toUser} has ${targetPlayer[`gold`]} G :)`
        } else if (toUser) {
            response = `${toUser} isn't registered :(`
        } else {
            response = `${sender} has ${sendingPlayer[`gold`]} G :)`
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // SPEND
    if (command === `!spend`) {
        if (sendingPlayer[`dead`]) {
            const reply = `Sorry ${sender}, you are dead! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        // User has no gold
        if (sendingPlayer[`gold`] <= 0) {
            const reply = `You don't have any gold, ${sender}! :(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        // No amount specified
        if (!args.length) {
            const reply = `You must provide an amount, ${sender}! >(`
            client.say(channel, reply)
            console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${reply}`)
            return
        }

        let response
        const spendingAmt = Number(args[0])

        if (!Number.isNaN(spendingAmt)) {
            if (spendingAmt <= 0) {
                response = `You must specify a positive amount of gold, ${sender} ;)`
            } else if (spendingAmt > sendingPlayer[`gold`]) {
                response = `You don't have that much gold, ${sender}! :(`
            } else {
                sendingPlayer[`gold`] -= spendingAmt
                response = `${sender} spent ${spendingAmt} gold :)`
            }
        } else {
            response = `That isn't a number, ${sender}! ;)`
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // AM I SUBBED
    if (msg.toLowerCase().includes(`am i sub`)
        || msg.toLowerCase().includes(`am i a sub`)
        || msg.toLowerCase().includes(`do i have a sub`)) {
        let response
        senderIsSubbed ? response = `Yes ${sender}, you are subbed :)` : response = `No ${sender}, you aren't subbed :(`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // AM I A MOD
    if (msg.toLowerCase().includes(`am i a mod`)
        || msg.toLowerCase().includes(`am i mod`)) {
        let response
        senderIsAMod ? response = `Yes ${sender}, you are a mod :)` : response = `No ${sender}, you aren't a mod :(`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // AM I VIP
    if (msg.toLowerCase().includes(`am i vip`)
        || msg.toLowerCase().includes(`am i a vip`)
        || msg.toLowerCase().includes(`do i have vip`)) {
        let response
        senderIsVIP ? response = `Yes ${sender}, you have VIP status :)` : response = `No ${sender}, you don't have VIP status :(`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // Sender has Turbo?
    if (senderHasTurbo) {
        const response = `Wow, ${sender} is a Twitch Turbo user! :O`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // Contains MY MESSAGE ID
    if (msg.toLowerCase().includes(`my message id`)) {
        const response = `${sender}, your message ID was ${msgID} :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // Contains HEX CODE / HEX COLOR
    if (msg.toLowerCase().includes(`hex code`)
        || msg.toLowerCase().includes(`hex color`)) {
        const response = `${sender}, your name's hex color is ${color} :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // HELLO BOT
    if (msg.toLowerCase().includes(`hello bot`)
        || msg.toLowerCase().includes(`hey bot`)
        || msg.toLowerCase().includes(`hi bot`)) {
        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
    }

    // UNDERTALE BOT HI
    if (msg.toLowerCase().includes(`undertalebot hello`)
        || msg.toLowerCase().includes(`undertalebot hey`)
        || msg.toLowerCase().includes(`undertalebot hi`)) {
        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! How are you? :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `${channel} UndertaleBot: ${response}`)
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
        // console.log(`\x1b[31m%s\x1b[0m`, `Delivering quote ${idx}`)
        return quotes[idx]
    } else {
        // console.log(`\x1b[31m%s\x1b[0m`, `Delivering random quote`)
        return quotes[Math.floor(Math.random() * quotes.length)]
    }
}

function getThirdPersonFlavorText() {
    const actions = [
        `prepares a magical attack.`,
        `takes a deep breath.`,
        `is acting aloof.`,
        `is trying hard to play it cool.`,
        `whispers "Nyeh heh heh!"`,
        `is preparing a bone attack.`,
        `is cackling.`,
        `prepares a non-bone attack then spends a minute fixing their mistake.`,
        `is rattling their bones.`,
        `remembered a bad joke JPEGSTRIPES told and is frowning.`,
        `is considering their options.`,
        `is thinking about what to wear for their date.`,
        `is thinking about what to cook for their date.`,
        `dabs some Bone Cologne behind their ear.`,
        `dabs marinara sauce behind their ear.`,
        `dabs MTT-Brand Bishie Cream behind their ear.`,
        `dabs MTT-Brand Anime Powder behind their ear.`,
        `dabs MTT-Brand Cute Juice behind their ear.`,
        `dabs MTT-Brand Attraction Slime behind their ear.`,
        `dabs MTT-Brand Beauty Yogurt behind their ear.`,
        `flips their spear impatiently.`,
        `points heroically towards the sky.`,
        `flashes a menacing smile.`,
        `draws their finger across their neck.`,
        `bounces impatiently.`,
        `suplexes a large boulder, just because they can.`,
        `thinks of their friends and pounds the ground with their fists.`,
        `holds their fist in front of themself and shakes their head.`,
        `towers threateningly.`,
        `is hyperventilating.`,
        `is smashing spears on the ground.`,
        `'s eye is twitching involuntarily.`,
        `'s eyes dart around to see if this is a prank.`,
        `stands around absentmindedly.`,
        `looks like they're about to fall over.`,
        `hops to and fro.`,
        `doesn't seem to know why they're here.`,
        `avoids eye contact.`,
        `is fluttering.`,
        `gnashes their teeth.`,
        `cackles softly.`,
        `gave a mysterious smile.`,
        `waits pensively.`,
        `burbles quietly.`,
        `is ruminating.`,
        `is wishing they weren't here.`,
        `is staring into the distance.`,
        `is pretending to sleep.`,
        `cocks their head to one side.`,
        `is really not paying attention.`,
        `is chanting an anarchist spell.`,
        `is eating their own homework.`,
        `is on the warpath.`,
        `does fancy flips.`,
        `sees their reflection and gets jealous.`,
        `lets out a yawn.`,
        `tells everyone they have to go to the bathroom.`,
        `sneezes without covering their nose.`,
        `is admiring their own muscles.`,
        `is friends with a little bird.`,
        `wonders if tears are sanitary.`,
        `is rinsing off a pizza.`,
        `is looking for some good clean fun.`,
        `is very normal.`,
        `is having quiet time.`,
        `sits motionless.`,
        `gyrates reservedly.`,
        `mills about in the corner.`,
        `needs some distance.`,
        `thinks about doing karaoke by themself.`,
        `hums very faintly.`,
        `pretends to be a pop idol.`,
        `is looking nervous.`,
        `is doing an armless ska dance.`,
        `is hopping mad.`,
        `stands around absentmindedly.`,
        `forgot their other attack.`,
        `vibrates intensely.`,
        `makes a smoke hoop and jumps through it.`,
        `looks over, then turns up their nose.`,
        `is pretending to pull the fire alarm.`,
        `is chuckling through their teeth.`,
        `is pretending to be a candle.`,
        `is protected by their winsome smile.`,
        `looks nervous.`,
        `looks anxious.`,
        `looks perturbed.`,
        `taps their fingers together like jackhammers.`,
        `uses a hypnotizing 3D-tush-wiggle attack.`,
        `is polishing their face.`,
        `stands guard.`,
        `knows exactly why they're here.`,
        `jumps ominously up and down.`,
        `spins their weapon around.`,
        `shakes their head dismissively.`,
        `flutters silently.`,
        `clicks their teeth.`,
        `has gone bloodshot.`,
        `whispers arcane swear words.`,
        `does a mysterious jig.`,
        `flaunts their orbs in a menacing manner.`,
        `watches quietly.`,
        `'s armor emits a dark sheen.`,
        `smashes their morningstar.`,
        `breathes deeply.`,
        `completely closes their mouth. They look short and weird.`,
        `has a hissy fit.`,
        `makes a balloon animal out of bees. Shape: Pile of bees.`,
        `is juggling balls of ants.`,
        `intentionally pratfalls. Twenty times.`
    ]
    return actions[Math.floor(Math.random() * actions.length)]
}

function getAction(user, target) {
    const randGold = Math.ceil(Math.random() * 10) * 5
    const actions = [
        `and the others celebrate ${target}'s disappearance.`,
        `and the others ditch ${target} when they look away!`,
        `asks ${target} about their day.`,
        `asks ${target} about their day. There's no response.`,
        `asks ${target} to clean them. ${target} hops around excitedly.`,
        `attempts to touch ${target}'s armor. Their hands slip off.`,
        `boos ${target}.`,
        `boos loudly. ${target} leaves to look elsewhere for praise.`,
        `boos... but haters only make ${target} stronger. ${target} ATTACK UP+DEFENSE DOWN.`,
        `calls ${target}. ${target} bounds toward them, flecking slobber into ${user}'s face.`,
        `claps like a gorilla. ${target} is becoming addicted to their praise.`,
        `claps really sloppily. ${target} sucks up their praise like a vacuum cleaner.`,
        `cleans ${target}'s armor. Its cooling dirt begins to wash away.`,
        `compliments ${target}. They understood them perfectly. ${target}'s ATTACK dropped.`,
        `cranks up the thermostat. ${target} begins to get excited.`,
        `cranks up the thermostat. It's super hot! ${target} looks satisfied.`,
        `did something mysterious. ${target} recognizes they have more to learn from this world.`,
        `does nothing. ${target} leaves to look elsewhere for praise.`,
        `does nothing. ${target} looks desperate for attention.`,
        `does nothing. ${target} looks disappointed they aren't paying attention.`,
        `doesn't hug ${target}. They appreciate their respect of their boundaries.`,
        `doesn't pick on ${target}.`,
        `flexes. ${target} flexes twice as hard. ATTACK increases for both of them.`,
        `flexes. ${target} flexes very hard... They flex themself out of the room!`,
        `gave ${target} a patient smile.`,
        `gets close to ${target}. But not too close.`,
        `gives ${target} a cruel look.`,
        `gives ${target} a friendly pat.`,
        `hugs ${target}. Gross slime covers them. ${user}'s SPEED decreased.`,
        `ignores ${target} and thinks of pollen and sunshine. ${user}'s DEFENSE increased by 1.`,
        `informs ${target} that they have a great hat!`,
        `invites ${target} to hang out.`,
        `kneels and prays for safety. ${target} remembers their conscience.`,
        `laughs at ${target} before they say anything funny.`,
        `lies down. ${target} lies down too. ${target} understands life now.`,
        `lies immobile with ${target}. They feel like they understand the world a little better.`,
        `makes fun of ${target}.`,
        `manages to tear their eyes away from ${target}'s hat. They look annoyed...`,
        `pats ${target}'s chest like a muscular bongo.`,
        `pats their stomach. ${target} offers a healthy meal.`,
        `pays ${randGold} G. ${target} reduces their ATTACK for this turn!`,
        `pets ${target}. Their excitement knows no bounds.`,
        `pets the ${target}. They start to generate a Stage I Happiness Froth.`,
        `picks on ${target}.`,
        `presses the yellow button. The phone is resonating with ${target}'s presence!`,
        `raises their arms and wiggles their fingers. ${target} freaks out!`,
        `reaches out. ${target} recoils from their touch.`,
        `says hello to ${target}.`,
        `sings an old lullaby. ${target} starts to look sleepy...`,
        `stands up to ${target}.`,
        `talks to ${target}. ...They don't seem much for conversation. No one is happy with this.`,
        `talks to ${target}... They don't seem much for conversation. JPEGSTRIPES seems happy with ${user}.`,
        `tells ${target} that no one will ever love them the way they are... They struggle to make a retort, and slink away utterly crushed...`,
        `tells ${target} that their attacks are NOT helpful.`,
        `tells ${target} that their rump looks like a sack of trash.`,
        `tells ${target} that there's a mirror behind them.`,
        `tells ${target} that they aren't funny.`,
        `tells ${target} their attacks are too easy. The bullets get faster.`,
        `tells ${target} their attacks are too easy. The bullets get unfair.`,
        `tells ${target} their attacks are too easy. They don't care.`,
        `tells ${target} their favorite secret.`,
        `tells ${target} they have a powerful rudder.`,
        `tells ${target} they have an impressive wingspan.`,
        `tells ${target} they have cute winglets.`,
        `tells ${target} they have nice turbines.`,
        `tells ${target} they like their taste in movies and books.`,
        `tells ${target} they're all wrong.`,
        `tells ${target} they're doing a great job. Their attacks become extreme...`,
        `tells ${target} to be honest with their feelings.`,
        `tells ${target} to go away.`,
        `threatens ${target}. They understood them perfectly. ${target}'s DEFENSE dropped.`,
        `threw the stick and ${target} ran to get it. They played fetch for a while.`,
        `throws the stick. ${target} brings it back in their mouth.`,
        `told ${target} a little joke.`,
        `told ${target} they didn't want to fight. But nothing happened.`,
        `told ${target} they just want to be friends. They remember someone... ${target}'s attacks became a little less extreme.`,
        `took a bite out of ${target}. They recovered 5 HP!`,
        `tried to eat ${target}, but they weren't weakened enough.`,
        `tries to console ${target}...`,
        `wiggles their hips. ${target} wiggles back. What a meaningful conversation!`
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

function fetchItemText(user) {
    const itemText = [
        `* ${user} re-applied a used Bandage. Still kind of gooey. ${user} recovered 10 HP!`,
        `* ${user} re-applied a gross Bandage. Still kind of gooey. ${user} recovered 10 HP!`,
        `* ${user} re-applied their old, used Bandage. Still kind of gooey. ${user} recovered 10 HP!`,
        `* ${user} re-applied a dirty Bandage. Still kind of gooey. ${user} recovered 10 HP!`,
        `* ${user} re-applied a well-used Bandage. Still kind of gooey. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. Very un-licorice-like. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. Very un-licorice-like. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. Very un-licorice-like. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. Very un-licorice-like. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. ...tastes like licorice. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. ...tastes like licorice. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. ...tastes like licorice. ${user} recovered 10 HP!`,
        `* ${user} ate a Monster Candy. ...tastes like licorice. ${user} recovered 10 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. ${user} recovered 12 HP!`,
        `* ${user} ate a Spider Donut. Made with Spider Cider in the batter. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. ${user} recovered 24 HP!`,
        `* ${user} drank a Spider Cider. Made with whole spiders, not just the juice. ${user} recovered 24 HP!`,
        `* ${user} ate the Butterscotch-Cinnamon Pie. ${user}'s HP was maxed out.`,
        `* ${user} ate the Snail Pie. ${user}'s HP was maxed out.`,
        `* ${user} ate the Snail Pie. It's an acquired taste. ${user}'s HP was maxed out.`,
        `* ${user} ate a Snowman Piece. ${user} recovered 45 HP!`,
        `* ${user} ate a Snowman Piece. ${user} recovered 45 HP!`,
        `* ${user} ate a Snowman Piece. ${user} recovered 45 HP!`,
        `* ${user} ate a Snowman Piece. ${user} recovered 45 HP!`,
        `* ${user} ate a Snowman Piece in front of the Snowman it came from. ${user} recovered 45 HP!`,
        `* ${user} ate a Nice Cream. You're super spiffy! ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. Are those claws natural? ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. Love yourself! I love you! ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. You look nice today! ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. (An illustration of a hug) ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. Have a wonderful day! ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. Is this as sweet as you? ${user} recovered 15 HP!`,
        `* ${user} ate a Nice Cream. You're just great! ${user} recovered 15 HP!`,
        `* ${user} ate a Bisicle. ${user} recovered 11 HP!`,
        `* ${user} ate a Bisicle. ${user} recovered 11 HP!`,
        `* ${user} ate a Bisicle. It's a two-pronged popsicle, so you can eat it twice. ${user} recovered 11 HP!`,
        `* ${user} ate both halves of a Bisicle. ${user} recovered 22 HP!`,
        `* ${user} ate one half of a Bisicle. ${user} recovered 11 HP!`,
        `* ${user} ate a Unisicle. ${user} recovered 11 HP!`,
        `* ${user} ate a Unisicle. ${user} recovered 11 HP!`,
        `* ${user} ate a Unisicle. It's a SINGLE-pronged popsicle. Wait, that's just normal... ${user} recovered 11 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. ${user} recovered 22 HP!`,
        `* ${user} ate a Cinnamon Bunny. A cinnamon roll in a shape of a bunny. ${user} recovered 22 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. ${user} recovered 21 HP!`,
        `* ${user} ate some Astronaut Food. It's for a pet astronaut? ${user} recovered 21 HP!`,
        `* ${user} ate a Crab Apple. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. An aquatic fruit that resembles a crustacean. ${user} recovered 18 HP!`,
        `* ${user} ate a Crab Apple. An aquatic fruit that resembles a crustacean. ${user} recovered 18 HP!`,
        `* ${user} drank a Sea Tea. Their SPEED boosts! ${user} recovered 10 HP!`,
        `* ${user} drank a Sea Tea. Their SPEED boosts! ${user} recovered 10 HP!`,
        `* ${user} drank a Sea Tea. Their SPEED boosts! ${user} recovered 10 HP!`,
        `* ${user} drank a Sea Tea. Their SPEED boosts! ${user} recovered 10 HP!`,
        `* ${user} drank a Sea Tea. Their SPEED boosts! ${user} recovered 10 HP!`,
        `* ${user} drank a Sea Tea. Made from glowing marsh water. Increases SPEED for one battle. ${user} recovered 10 HP!`,
        `* ${user} drank a Sea Tea. Made from glowing marsh water. Increases SPEED for one battle. ${user} recovered 10 HP!`,
        `* ${user} ate the Abandoned Quiche. ${user} recovered 34 HP!`,
        `* ${user} ate the Abandoned Quiche. ${user} recovered 34 HP!`,
        `* ${user} ate the Abandoned Quiche. ${user} recovered 34 HP!`,
        `* ${user} ate the quiche they found under a bench. ${user} recovered 34 HP!`,
        `* ${user} ate a psychologically-damaged spinach egg pie. ${user} recovered 34 HP!`,
        `* ${user} ate some Temmie Flakes (cheap). hOI! ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (cheap). It's just torn up pieces of colored construction paper. ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (normal). hOI!!! i'm tEMMIE!! ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (normal). It's just torn up pieces of colored construction paper. ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (expensiv). WOA!! u gota... tem flakes!!! ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (expensiv). It's just torn up pieces of colored construction paper. ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (premiem). FOOB!!! ${user} recovered 2 HP!`,
        `* ${user} ate some Temmie Flakes (premiem). It's just torn up pieces of colored construction paper. ${user} recovered 2 HP!`,
        `* ${user} ate Dog Salad. Oh. There are bones... ${user} recovered 2 HP!`,
        `* ${user} ate Dog Salad. Oh. There are bones... ${user} recovered 2 HP!`,
        `* ${user} ate Dog Salad. Oh. Fried tennis ball... ${user} recovered 10 HP!`,
        `* ${user} ate Dog Salad. Oh. Fried tennis ball... ${user} recovered 10 HP!`,
        `* ${user} ate Dog Salad. Oh. Tastes yappy... ${user} recovered 30 HP!`,
        `* ${user} ate Dog Salad. Oh. Tastes yappy... ${user} recovered 30 HP!`,
        `* ${user} ate Dog Salad. It's literally garbage??? ${user}'s HP was maxed out.`,
        `* ${user} ate Dog Salad. It's literally garbage??? ${user}'s HP was maxed out.`,
        `* ${user} ate Instant Noodles. They're better dry. ${user} recovered 90 HP!`,
        `* ${user} ate Instant Noodles. They're better dry. ${user} recovered 90 HP!`,
        `* ${user} cooked the Instant Noodles. Comes with everything you need for a quick meal! ${user} recovered 15 HP!`,
        `* ${user} cooked the Instant Noodles. Comes with everything you need for a quick meal! ${user} recovered 15 HP!`,
        `* ${user} spends four minutes cooking Instant Noodles before eating them. ... they don't taste very good. They add the flavor packet. That's better. Not great, but better. ${user} recovered 4 HP!`,
        `* ${user} spends four minutes cooking Instant Noodles before eating them. ... they don't taste very good. They add the flavor packet. That's better. Not great, but better. ${user} recovered 4 HP!`,
        `* ${user} ate a Hot Dog...? (Bark!) ${user} recovered 20 HP!`,
        `* ${user} ate a Hot Dog...? (Bark!) ${user} recovered 20 HP!`,
        `* ${user} ate a Hot Dog...? The "meat" is made of something called a "water sausage." ${user} recovered 20 HP!`,
        `* ${user} ate a Hot Cat. (Meow!) ${user} recovered 21 HP!`,
        `* ${user} ate a Hot Cat. (Meow!) ${user} recovered 21 HP!`,
        `* ${user} ate a Hot Cat. Like a hot dog, but with little cat ears on the end. ${user} recovered 21 HP!`,
        `* ${user} used Junk Food. ${user} recovered 17 HP!`,
        `* ${user} used Junk Food. ${user} recovered 17 HP!`,
        `* ${user} used Junk Food. ${user} recovered 17 HP!`,
        `* ${user} used Junk Food. Food that was probably once thrown away. ${user} recovered 17 HP!`,
        `* ${user} used Junk Food. (Eating garbage?!) ${user} recovered 17 HP!`,
        `* ${user} used Junk Food. (Eating garbage?!) ${user} recovered 17 HP!`,
        `* ${user} used Junk Food. (Eating garbage?!) ${user} recovered 17 HP!`,
        `* ${user} ate a Hush Puppy. Dog-magic is neutralized. ${user} recovered 65 HP!`,
        `* ${user} ate a Hush Puppy. Dog-magic is neutralized. ${user} recovered 65 HP!`,
        `* ${user} ate a Hush Puppy. Dog-magic is neutralized. ${user} recovered 65 HP!`,
        `* ${user} ate a Starfait. ${user} recovered 14 HP!`,
        `* ${user} ate a Starfait. ${user} recovered 14 HP!`,
        `* ${user} ate a Starfait. ${user} recovered 14 HP!`,
        `* ${user} ate a Starfait. ${user} recovered 14 HP!`,
        `* ${user} ate a Starfait. A sweet treat made of sparkling stars. ${user} recovered 14 HP!`,
        `* ${user} ate a Starfait. Viewer ratings go up by 200 points! ${user} recovered 14 HP!`,
        `* ${user} ate a Starfait. Viewer ratings go up by 200 points! ${user} recovered 14 HP!`,
        `* ${user} ate a Glamburger. ${user} recovered 27 HP!`,
        `* ${user} ate a Glamburger. ${user} recovered 27 HP!`,
        `* ${user} ate a Glamburger. ${user} recovered 27 HP!`,
        `* ${user} ate the Glamburger. Made of edible glitter and sequins. ${user} recovered 27 HP!`,
        `* ${user} ate the Glamburger. Made of edible glitter and sequins. ${user} recovered 27 HP!`,
        `* ${user} ate a Glamburger. The audience loves the brand. Viewer ratings go up by 300 points! ${user} recovered 27 HP!`,
        `* ${user} ate a Glamburger. The audience loves the brand. Viewer ratings go up by 300 points! ${user} recovered 27 HP!`,
        `* ${user} ate a Legendary Hero. ${user} recovered 40 HP!`,
        `* ${user} ate a Legendary Hero. ${user} recovered 40 HP!`,
        `* ${user} ate a Legendary Hero. ${user} recovered 40 HP!`,
        `* ${user} ate the Legendary Hero. Sandwich shaped like a sword. Increases ATTACK when eaten. ${user} recovered 40 HP!`,
        `* ${user} ate the Legendary Hero. Sandwich shaped like a sword. Increases ATTACK when eaten. ${user} recovered 40 HP!`,
        `* ${user} ate a Legendary Hero. Viewer ratings go up by 500 points! ${user} recovered 40 HP!`,
        `* ${user} ate a Legendary Hero. Viewer ratings go up by 500 points! ${user} recovered 40 HP!`,
        `* ${user} ate the Steak in the Shape of Mettaton's Face. They feel like it's not made of real meat... ${user} recovered 60 HP!`,
        `* ${user} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts. ${user} recovered 60 HP!`,
        `* ${user} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts. Viewer ratings go up by 700 points! ${user} recovered 60 HP!`,
        `* ${user} ate some Popato Chisps. ${user} recovered 13 HP!`,
        `* ${user} ate some Popato Chisps. ${user} recovered 13 HP!`,
        `* ${user} ate some Popato Chisps. ${user} recovered 13 HP!`,
        `* ${user} ate some Popato Chisps. ${user} recovered 13 HP!`,
        `* ${user} ate some Popato Chisps. Regular old popato chisps. ${user} recovered 13 HP!`,
        `* ${user} used Last Dream. Through DETERMINATION, the dream became true. ${user}'s HP was maxed out.`,
        `* ${user} hit a Croquet Roll into their mouth. Fried dough traditionally served with a mallet. ${user} recovered 15 HP!`,
        `* ${user} ate Rock Candy. It's a rock. ${user} recovered 1 HP!`,
        `* ${user} ate Pumpkin Rings. A small pumpkin cooked like onion rings. ${user} recovered 8 HP!`,
        `* ${user} ate a Stoic Onion. They didn't cry... ${user} recovered 5 HP!`,
        `* ${user} ate a Ghost Fruit. It will never pass to the other side. ${user} recovered 16 HP!`,
        `* ${user} ate Puppydough Icecream. Mmm! Tastes like puppies. ${user} recovered 28 HP!`,
        `* Papyrus gives ${user} some of his oak-aged spaghetti. ${user} takes a small bite. Their face reflexively scrunches up. The taste is indescribable... Papyrus is flattered!`
    ]

    const randItem = Math.floor(Math.random() * itemText.length)
    let userHealAmt = 0

    if (randItem >= 0 && randItem <= 12) { userHealAmt = 10 }
    if (randItem >= 13 && randItem <= 20) { userHealAmt = 12 }
    if (randItem >= 21 && randItem <= 28) { userHealAmt = 24 }
    if (randItem >= 29 && randItem <= 31) { userHealAmt = getUserMaxHP(user) }
    if (randItem >= 32 && randItem <= 36) { userHealAmt = 45 }
    if (randItem >= 37 && randItem <= 44) { userHealAmt = 15 }
    if (randItem >= 45 && randItem <= 48) { userHealAmt = 22 }
    if (randItem >= 49 && randItem <= 52) { userHealAmt = 11 }
    if (randItem >= 53 && randItem <= 60) { userHealAmt = 22 }
    if (randItem >= 61 && randItem <= 68) { userHealAmt = 21 }
    if (randItem >= 69 && randItem <= 76) { userHealAmt = 18 }
    if (randItem >= 77 && randItem <= 83) { userHealAmt = 10 }
    if (randItem >= 84 && randItem <= 88) { userHealAmt = 34 }
    if (randItem >= 89 && randItem <= 98) { userHealAmt = 2 }
    if (randItem >= 99 && randItem <= 100) { userHealAmt = 10 }
    if (randItem >= 101 && randItem <= 102) { userHealAmt = 30 }
    if (randItem >= 103 && randItem <= 104) { userHealAmt = getUserMaxHP(user) }
    if (randItem >= 105 && randItem <= 106) { userHealAmt = 90 }
    if (randItem >= 107 && randItem <= 108) { userHealAmt = 15 }
    if (randItem >= 109 && randItem <= 110) { userHealAmt = 4 }
    if (randItem >= 111 && randItem <= 113) { userHealAmt = 20 }
    if (randItem >= 114 && randItem <= 116) { userHealAmt = 21 }
    if (randItem >= 117 && randItem <= 123) { userHealAmt = 17 }
    if (randItem >= 124 && randItem <= 126) { userHealAmt = 65 }
    if (randItem >= 127 && randItem <= 133) { userHealAmt = 14 }
    if (randItem >= 134 && randItem <= 140) { userHealAmt = 27 }
    if (randItem >= 141 && randItem <= 147) { userHealAmt = 40 }
    if (randItem >= 148 && randItem <= 150) { userHealAmt = 60 }
    if (randItem >= 151 && randItem <= 155) { userHealAmt = 13 }
    if (randItem === 156) { userHealAmt = getUserMaxHP(user) }
    if (randItem === 157) { userHealAmt = 15 }
    if (randItem === 158) { userHealAmt = 1 }
    if (randItem === 159) { userHealAmt = 8 }
    if (randItem === 160) { userHealAmt = 5 }
    if (randItem === 161) { userHealAmt = 16 }
    if (randItem === 162) { userHealAmt = 28 }
    // if (randItem === 163) { userHealAmt = 0 }

    const chosenUser = players[user.toLowerCase()]
    console.log(`\x1b[31m%s\x1b[0m`, `${user} HP: ${chosenUser[`hp`]}, randItem: ${randItem}, userHealAmt: ${userHealAmt}`)

    chosenUser[`hp`] += userHealAmt
    if (chosenUser[`hp`] > getUserMaxHP(user)) { chosenUser[`hp`] = getUserMaxHP(user) }

    return itemText[randItem]
}

function fetchGivenItemText(user, target) {
    const givenItemText = [
        `* ${user} re-applies an old Bandage onto ${target}. Still kind of gooey. ${target} recovered 10 HP!`,
        `* ${user} re-applies a used Bandage onto ${target}. Still kind of gooey. ${target} recovered 10 HP!`,
        `* ${user} re-applies an old, used Bandage onto ${target}. Still kind of gooey. ${target} recovered 10 HP!`,
        `* ${user} re-applies a gross Bandage onto ${target}. Still kind of gooey. ${target} recovered 10 HP!`,
        `* ${user} rips off their old Bandage and sticks it onto ${target}. Still kind of gooey. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Monster Candy, and they eat it. Very un-licorice-like. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Monster Candy, and they eat it. Very un-licorice-like. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} some Monster Candy, and they eat it. Very un-licorice-like. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} some Monster Candy, and they eat it. Very un-licorice-like. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Monster Candy, and they eat it. ...tastes like licorice. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Monster Candy, and they eat it. ...tastes like licorice. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} some Monster Candy, and they eat it. ...tastes like licorice. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} some Monster Candy, and they eat it. ...tastes like licorice. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Spider Donut, and they eat it. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut, and they eat it. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut, and they eat it. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut, and they eat it in one bite. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut. They eat it. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut. They eat it. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut. They eat it with trepidation. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Donut. They eat it apprehensively. ${target} recovered 12 HP!`,
        `* ${user} gives ${target} a Spider Cider, and they drink it. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider, and they drink it. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider, and they drink it. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider, and they drink it. Tastes like spiders. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider. They drink it. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider. They drink it. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider. They smell it before drinking it. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} a Spider Cider. They drink it hesitantly. ${target} recovered 24 HP!`,
        `* ${user} gives ${target} the Butterscotch-Cinnamon Pie. They eat it. ${target}'s HP was maxed out.`,
        `* ${user} gives ${target} the Snail Pie. They eat it. ${target}'s HP was maxed out.`,
        `* ${user} gives ${target} the Snail Pie, and they eat it. It's an acquired taste. ${target}'s HP was maxed out.`,
        `* ${user} gives ${target} a Snowman Piece, and they eat it. ${target} recovered 45 HP!`,
        `* ${user} gives ${target} a Snowman Piece, and they eat it. ${target} recovered 45 HP!`,
        `* ${user} gives ${target} a Snowman Piece, and they eat it. ${target} recovered 45 HP!`,
        `* ${user} gives ${target} a Snowman Piece, and they eat it. ${target} recovered 45 HP!`,
        `* ${user} gives ${target} a Snowman Piece, and they eat it in front of the Snowman it came from. ${target} recovered 45 HP!`,
        `* ${user} gives ${target} a Nice Cream. You're super spiffy! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. Are those claws natural? ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. Love yourself! I love you! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. You look nice today! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. (An illustration of a hug) ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. Have a wonderful day! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. Is this as sweet as you? ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Nice Cream. You're just great! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} a Bisicle, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Bisicle, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Bisicle. They eat half of it. ${target} recovered 11 HP!`,
        `* ${user} gives ${target} a Bisicle, and they eat half of it. ${target} recovered 11 HP!`,
        `* ${user} splits their Bisicle in half with ${target}. They both recovered 11 HP!`,
        `* ${user} and ${target} each eat one half of a Bisicle. They both recovered 11 HP!`,
        `* ${user} gives ${target} a Unisicle, and they eat it. ${target} recovered 11 HP!`,
        `* ${user} gives ${target} a Unisicle, and they eat it. ${target} recovered 11 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a Cinnamon Bunny, and they eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} a cinnamon roll in a shape of a bunny. They eat it. ${target} recovered 22 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} gives ${target} some Astronaut Food, and they eat it. ${target} recovered 21 HP!`,
        `* ${user} feeds ${target} the Astronaut Food. It's for a pet astronaut? ${target} recovered 21 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. It resembled a crustacean. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Crab Apple, and they eat it. It resembled a crustacean. ${target} recovered 18 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. Their SPEED boosts! ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. Their SPEED boosts! ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. Their SPEED boosts! ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. Their SPEED boosts! ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. ${target}'s SPEED increases. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. It's made from glowing marsh water. ${target} recovered 10 HP!`,
        `* ${user} gives ${target} a Sea Tea, and they drink it. It's made from glowing marsh water. ${target}'s SPEED increases, and they recovered 10 HP!`,
        `* ${user} gives ${target} a Previously-Abandoned Quiche, and they eat it. ${target} recovered 34 HP!`,
        `* ${user} gives ${target} a quiche they found abandoned underneath a bench. ${target} ate it and recovered 34 HP!`,
        `* ${user} gives ${target} a quiche they found. ${target} doesn't ask where it came from, but eats it anyway. ${target} recovered 34 HP!`,
        `* ${user} finds an Abandoned Quiche under a bench, and gives it to ${target}. They eat the psychologically-damaged spinach egg pie. ${target} recovered 34 HP!`,
        `* ${user} gives ${target} the Abandoned Quiche, and they eat it. ${target} recovered 34 HP!`,
        `* ${user} gives ${target} some cheap Temmie Flakes. hOI! ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some cheap Temmie Flakes. It's just torn up pieces of colored construction paper. ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some Temmie Flakes (normal). hOI!!! i'm tEMMIE!! ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some Temmie Flakes (normal). It's just torn up pieces of colored construction paper. ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some Temmie Flakes (expensiv). WOA!! u gota... tem flakes!!! ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some Temmie Flakes (expensiv). It's just torn up pieces of colored construction paper. ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some Temmie Flakes (premiem). FOOB!!! ${target} recovered 2 HP!`,
        `* ${user} gives ${target} some Temmie Flakes (premiem). It's just torn up pieces of colored construction paper. ${target} recovered 2 HP!`,
        `* ${user} gives ${target} Dog Salad. Oh. There are bones... ${target} recovered 2 HP!`,
        `* ${user} gives ${target} Dog Salad. Oh. There are bones... ${target} recovered 2 HP!`,
        `* ${user} gives ${target} Dog Salad. Oh. Fried tennis ball... ${target} recovered 10 HP!`,
        `* ${user} gives ${target} Dog Salad. Oh. Fried tennis ball... ${target} recovered 10 HP!`,
        `* ${user} gives ${target} Dog Salad. Oh. Tastes yappy... ${target} recovered 30 HP!`,
        `* ${user} gives ${target} Dog Salad. Oh. Tastes yappy... ${target} recovered 30 HP!`,
        `* ${user} gives ${target} Dog Salad. It's literally garbage??? ${target}'s HP was maxed out.`,
        `* ${user} gives ${target} Dog Salad. It's literally garbage??? ${target}'s HP was maxed out.`,
        `* ${user} gives ${target} some Instant Noodles. They're better dry. ${target} recovered 90 HP!`,
        `* ${user} gives ${target} some Instant Noodles. They're better dry. ${target} recovered 90 HP!`,
        `* ${user} gives ${target} the Instant Noodles. Comes with everything you need for a quick meal! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} the Instant Noodles. Comes with everything you need for a quick meal! ${target} recovered 15 HP!`,
        `* ${user} gives ${target} some Instant Noodles, which they spend four minutes cooking. ... they don't taste very good. ${target} adds the flavor packet. That's better. Not great, but better. ${target} recovered 4 HP!`,
        `* ${user} gives ${target} some Instant Noodles, which they spend four minutes cooking. ... they don't taste very good. ${target} adds the flavor packet. That's better. Not great, but better. ${target} recovered 4 HP!`,
        `* ${user} gives ${target} a Hot Dog...? (Bark!) ${target} recovered 20 HP!`,
        `* ${user} gives ${target} a Hot Dog...? (Bark!) ${target} recovered 20 HP!`,
        `* ${user} gives ${target} a Hot Dog...? The "meat" is made of something called a "water sausage." ${target} recovered 20 HP!`,
        `* ${user} gives ${target} a Hot Cat. (Meow!) ${target} recovered 20 HP!`,
        `* ${user} gives ${target} a Hot Cat. (Meow!) ${target} recovered 20 HP!`,
        `* ${user} gives ${target} a Hot Cat. Like a hot dog, but with little cat ears on the end. ${target} recovered 20 HP!`,
        `* ${user} gives ${target} some Junk Food. ${target} recovered 17 HP!`,
        `* ${user} gives ${target} Junk Food. Food that was probably once thrown away. ${target} recovered 17 HP!`,
        `* ${user} gives ${target} Junk Food. They eat it. ${target} recovered 17 HP!`,
        `* ${user} gives ${target} some Junk Food, and they eat it. ${target} recovered 17 HP!`,
        `* ${user} gives ${target} some Junk Food. (Eating garbage?!) ${target} recovered 17 HP!`,
        `* ${user} gives ${target} some Junk Food. (Eating garbage?!) ${target} recovered 17 HP!`,
        `* ${user} gives ${target} some Junk Food. (Eating garbage?!) ${target} recovered 17 HP!`,
        `* ${user} gives ${target} a Hush Puppy. Dog-magic is neutralized. ${target} recovered 65 HP!`,
        `* ${user} gives ${target} a Hush Puppy. They eat it. Dog-magic is neutralized. ${target} recovered 65 HP!`,
        `* ${user} gives ${target} a Hush Puppy, and they eat it. Dog-magic is neutralized. ${target} recovered 65 HP!`,
        `* ${user} gives ${target} a Starfait, and they eat it. ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Starfait, and they eat it. ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Starfait, and they eat it. ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Starfait, and they eat it. ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Starfait. A sweet treat made of sparkling stars. ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Starfait. Viewer ratings go up by 200 points! ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Starfait, and they eat it. Viewer ratings go up by 200 points! ${target} recovered 14 HP!`,
        `* ${user} gives ${target} a Glamburger, and they eat it. ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Glamburger, and they eat it. ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Glamburger, and they eat it. ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Glamburger. It's made of edible glitter and sequins. ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Glamburger. It's made of edible glitter and sequins. ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Glamburger. It's made of edible glitter and sequins. ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Glamburger. The audience loves the brand. Viewer ratings go up by 300 points! ${target} recovered 27 HP!`,
        `* ${user} gives ${target} a Legendary Hero, and they eat it. ${target} recovered 40 HP!`,
        `* ${user} gives ${target} a Legendary Hero, and they eat it. ${target} recovered 40 HP!`,
        `* ${user} gives ${target} a Legendary Hero, and they eat it. ${target} recovered 40 HP!`,
        `* ${user} gives ${target} the Legendary Hero, and they eat it. Sandwich shaped like a sword. ${target}'s ATTACK increased. ${target} recovered 40 HP!`,
        `* ${user} gives ${target} the Legendary Hero, and they eat it. Sandwich shaped like a sword. ${target}'s ATTACK increased. ${target} recovered 40 HP!`,
        `* ${user} gives ${target} a Legendary Hero, and they eat it. Viewer ratings go up by 500 points! ${target} recovered 40 HP!`,
        `* ${user} gives ${target} a Legendary Hero, and they eat it. Viewer ratings go up by 500 points! ${target} recovered 40 HP!`,
        `* ${user} gives ${target} the Steak in the Shape of Mettaton's Face. ${target} doesn't feel like it's made of real meat... ${target} recovered 60 HP!`,
        `* ${user} gives ${target} the Steak in the Shape of Mettaton's Face. The audience goes nuts. ${target} recovered 60 HP!`,
        `* ${user} gives ${target} the Steak in the Shape of Mettaton's Face. Viewer ratings go up by 700 points! ${target} recovered 60 HP!`,
        `* ${user} gives ${target} some Popato Chisps. ${target} recovered 13 HP!`,
        `* ${user} gives ${target} some Popato Chisps. ${target} recovered 13 HP!`,
        `* ${user} gives ${target} some Popato Chisps. ${target} recovered 13 HP!`,
        `* ${user} gives ${target} some Popato Chisps. ${target} recovered 13 HP!`,
        `* ${user} gives ${target} some Popato Chisps. Regular old popato chisps. ${target} recovered 13 HP!`,
        `* ${user} gives ${target} Last Dream. Through DETERMINATION, the dream became true. ${target}'s HP was maxed out.`,
        `* ${user} hits a Croquet Roll into ${target}'s mouth. It's traditionally served with a mallet. ${target} recovered 15 HP!`,
        `* ${user} gives ${target} Rock Candy. It's a rock. ${target} recovered 1 HP!`,
        `* ${user} gives ${target} some Pumpkin Rings. A small pumpkin cooked like onion rings. ${target} recovered 8 HP!`,
        `* ${user} watches ${target} eat the Stoic Onion. They didn't cry... ${target} recovered 5 HP!`,
        `* ${user} gives ${target} a Ghost Fruit. ${target} eats it, and ${user} wonders if it will ever pass to the other side. ${target} recovered 16 HP!`,
        `* ${user} gives ${target} Puppydough Icecream. Mmm! Tastes like puppies. ${target} recovered 28 HP!`,
        `* ${user} gives ${target} some of Papyrus's oak-aged spaghetti. ${target} takes a small bite. Their face reflexively scrunches up. The taste is indescribable... Papyrus is flattered!`
    ]

    const randGivenItem = Math.floor(Math.random() * givenItemText.length)
    let userHealAmt = 0
    let targetHealAmt = 0

    if (randGivenItem >= 0 && randGivenItem <= 12) { targetHealAmt = 10 }
    if (randGivenItem >= 13 && randGivenItem <= 20) { targetHealAmt = 12 }
    if (randGivenItem >= 21 && randGivenItem <= 28) { targetHealAmt = 24 }
    if (randGivenItem >= 29 && randGivenItem <= 31) { targetHealAmt = getUserMaxHP(target) }
    if (randGivenItem >= 32 && randGivenItem <= 36) { targetHealAmt = 45 }
    if (randGivenItem >= 37 && randGivenItem <= 44) { targetHealAmt = 15 }
    if (randGivenItem >= 45 && randGivenItem <= 46) { targetHealAmt = 22 }
    if (randGivenItem >= 47 && randGivenItem <= 48) { targetHealAmt = 11 }
    if (randGivenItem >= 49 && randGivenItem <= 50) { userHealAmt = 11; targetHealAmt = 11 }
    if (randGivenItem >= 51 && randGivenItem <= 52) { targetHealAmt = 11 }
    if (randGivenItem >= 53 && randGivenItem <= 60) { targetHealAmt = 22 }
    if (randGivenItem >= 61 && randGivenItem <= 68) { targetHealAmt = 21 }
    if (randGivenItem >= 69 && randGivenItem <= 76) { targetHealAmt = 18 }
    if (randGivenItem >= 77 && randGivenItem <= 83) { targetHealAmt = 10 }
    if (randGivenItem >= 84 && randGivenItem <= 88) { targetHealAmt = 34 }
    if (randGivenItem >= 89 && randGivenItem <= 98) { targetHealAmt = 2 }
    if (randGivenItem >= 99 && randGivenItem <= 100) { targetHealAmt = 10 }
    if (randGivenItem >= 101 && randGivenItem <= 102) { targetHealAmt = 30 }
    if (randGivenItem >= 103 && randGivenItem <= 104) { targetHealAmt = getUserMaxHP(target) }
    if (randGivenItem >= 105 && randGivenItem <= 106) { targetHealAmt = 90 }
    if (randGivenItem >= 107 && randGivenItem <= 108) { targetHealAmt = 15 }
    if (randGivenItem >= 109 && randGivenItem <= 110) { targetHealAmt = 4 }
    if (randGivenItem >= 111 && randGivenItem <= 113) { targetHealAmt = 20 }
    if (randGivenItem >= 114 && randGivenItem <= 116) { targetHealAmt = 21 }
    if (randGivenItem >= 117 && randGivenItem <= 123) { targetHealAmt = 17 }
    if (randGivenItem >= 124 && randGivenItem <= 126) { targetHealAmt = 65 }
    if (randGivenItem >= 127 && randGivenItem <= 133) { targetHealAmt = 14 }
    if (randGivenItem >= 134 && randGivenItem <= 140) { targetHealAmt = 27 }
    if (randGivenItem >= 141 && randGivenItem <= 147) { targetHealAmt = 40 }
    if (randGivenItem >= 148 && randGivenItem <= 150) { targetHealAmt = 60 }
    if (randGivenItem >= 151 && randGivenItem <= 155) { targetHealAmt = 13 }
    if (randGivenItem === 156) { targetHealAmt = getUserMaxHP(target) }
    if (randGivenItem === 157) { targetHealAmt = 15 }
    if (randGivenItem === 158) { targetHealAmt = 1 }
    if (randGivenItem === 159) { targetHealAmt = 8 }
    if (randGivenItem === 160) { targetHealAmt = 5 }
    if (randGivenItem === 161) { targetHealAmt = 16 }
    if (randGivenItem === 162) { targetHealAmt = 28 }
    // if (randGivenItem === 163) { targetHealAmt = 0 }

    const sendingPlayer = players[user.toLowerCase()]
    const targetPlayer = players[target.toLowerCase()]
    console.log(`\x1b[31m%s\x1b[0m`, `${user} HP: ${sendingPlayer[`hp`]}, randGivenItem: ${randGivenItem}, userHealAmt: ${userHealAmt}`)
    console.log(`\x1b[31m%s\x1b[0m`, `${target} HP: ${targetPlayer[`hp`]}, randGivenItem: ${randGivenItem}, targetHealAmt: ${targetHealAmt}`)

    sendingPlayer[`hp`] += userHealAmt
    if (sendingPlayer[`hp`] > getUserMaxHP(user)) { sendingPlayer[`hp`] = getUserMaxHP(user) }

    targetPlayer[`hp`] += targetHealAmt
    if (targetPlayer[`hp`] > getUserMaxHP(target)) { targetPlayer[`hp`] = getUserMaxHP(target) }

    return givenItemText[randGivenItem]
}

function fetchWeaponOrArmor(user) {
    const equipText = [
        `threw the Stick away. Then picked it back up.`,
        `threw the Stick away. Then picked it back up.`,
        `threw the Stick away. Then picked it back up.`,
        `threw the Stick away. Then picked it back up.`,
        `equipped the Stick. Its bark is worse than its bite.`,
        `equipped the Stick. Its bark is worse than its bite.`,
        `equipped the Stick. Its bark is worse than its bite.`,
        `equipped the Stick. Its bark is worse than its bite.`,
        `equipped the Toy Knife. +3 ATTACK`,
        `equipped the Toy Knife. +3 ATTACK`,
        `equipped the Toy Knife. +3 ATTACK`,
        `equipped the Toy Knife. +3 ATTACK`,
        `equipped the Toy Knife. Made of plastic. A rarity nowadays.`,
        `equipped the Toy Knife. Made of plastic. A rarity nowadays.`,
        `equipped the Toy Knife. Made of plastic. A rarity nowadays.`,
        `equipped the Toy Knife. Made of plastic. A rarity nowadays.`,
        `equipped the Tough Glove. +5 ATTACK`,
        `equipped the Tough Glove. +5 ATTACK`,
        `equipped the Tough Glove. +5 ATTACK`,
        `equipped the Tough Glove. +5 ATTACK`,
        `equipped the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `equipped the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `equipped the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `equipped the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `equipped the Ballet Shoes. +7 ATTACK`,
        `equipped the Ballet Shoes. +7 ATTACK`,
        `equipped the Ballet Shoes. +7 ATTACK`,
        `equipped the Ballet Shoes. +7 ATTACK`,
        `equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous.`,
        `equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous.`,
        `equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous.`,
        `equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous.`,
        `equipped the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `equipped the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `equipped the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `equipped the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `equipped the Torn Notebook. Increases INVULNERABILITY by 6.`,
        `equipped the Torn Notebook. Increases INVULNERABILITY by 6.`,
        `equipped the Torn Notebook. Increases INVULNERABILITY by 6.`,
        `equipped the Torn Notebook. Increases INVULNERABILITY by 6.`,
        `equipped the Burnt Pan. +10 ATTACK`,
        `equipped the Burnt Pan. +10 ATTACK`,
        `equipped the Burnt Pan. +10 ATTACK`,
        `equipped the Burnt Pan. +10 ATTACK`,
        `equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `equipped the Empty Gun. +12 ATTACK`,
        `equipped the Empty Gun. +12 ATTACK`,
        `equipped the Empty Gun. +12 ATTACK`,
        `equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low.`,
        `equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low.`,
        `equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low.`,
        `equipped the Worn Dagger. +15 ATTACK`,
        `equipped the Worn Dagger. +15 ATTACK`,
        `equipped the Worn Dagger. Perfect for cutting plants and vines.`,
        `equipped the Worn Dagger. Perfect for cutting plants and vines.`,
        `equipped the Real Knife. About time. +99 ATTACK`,
        `re-applied the used Bandage. They recovered 10 HP!`,
        `re-applied the used Bandage. They recovered 10 HP!`,
        `re-applied the used Bandage. They recovered 10 HP!`,
        `re-applied the used Bandage. They recovered 10 HP!`,
        `equipped the Faded Ribbon. +5 DEFENSE`,
        `equipped the Faded Ribbon. +5 DEFENSE`,
        `equipped the Faded Ribbon. +5 DEFENSE`,
        `equipped the Faded Ribbon. +5 DEFENSE`,
        `equipped the Faded Ribbon. If you're cuter, they won't hit you as hard.`,
        `equipped the Faded Ribbon. If you're cuter, they won't hit you as hard.`,
        `equipped the Faded Ribbon. If you're cuter, they won't hit you as hard.`,
        `equipped the Faded Ribbon. If you're cuter, they won't hit you as hard.`,
        `equipped the Manly Bandanna. +7 DEFENSE`,
        `equipped the Manly Bandanna. +7 DEFENSE`,
        `equipped the Manly Bandanna. +7 DEFENSE`,
        `equipped the Manly Bandanna. +7 DEFENSE`,
        `equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `equipped the Old Tutu. +10 DEFENSE`,
        `equipped the Old Tutu. +10 DEFENSE`,
        `equipped the Old Tutu. +10 DEFENSE`,
        `equipped the Old Tutu. +10 DEFENSE`,
        `equipped the Old Tutu. Finally, a protective piece of armor.`,
        `equipped the Old Tutu. Finally, a protective piece of armor.`,
        `equipped the Old Tutu. Finally, a protective piece of armor.`,
        `equipped the Old Tutu. Finally, a protective piece of armor.`,
        `equipped the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `equipped the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `equipped the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `equipped the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `equipped the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `equipped the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `equipped the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `equipped the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `donned the Temmie Armor. The things you can do with a college education!`,
        `donned the Temmie Armor. tem armor so GOOds! any battle becom! a EASY victories!!!`,
        `equipped the Stained Apron. +11 DEFENSE`,
        `equipped the Stained Apron. +11 DEFENSE`,
        `equipped the Stained Apron. +11 DEFENSE`,
        `equipped the Stained Apron. +11 DEFENSE`,
        `equipped the Stained Apron. Heals 1 HP every other turn.`,
        `equipped the Stained Apron. Heals 1 HP every other turn.`,
        `equipped the Stained Apron. Heals 1 HP every other turn.`,
        `equipped the Stained Apron. Heals 1 HP every other turn.`,
        `equipped the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
        `equipped the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
        `equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard.`,
        `equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard.`,
        `equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard. It also raises ATTACK by 5.`,
        `equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard. It also raises ATTACK by 5.`,
        `equipped the Heart Locket. +15 DEFENSE`,
        `equipped the Heart Locket. It says "Best Friends Forever."`,
        `equipped the Locket. Right where it belongs.`,
        `used Dog Residue. The rest of their inventory filled up with Dog Residue.`,
        `used Dog Residue. ... They finished using it. An uneasy atmosphere fills the room.`,
        `used a Punch Card. Punching attacks became stronger.`,
        `got a Punch Card.`,
        `deployed the Annoying Dog. The dog absorbs an artifact and leaves.`,
        `got the Mystery Key. It is too bent to fit on their keychain.`,
        `used 0. If you are reading this, I messed up somehow.`
    ]

    const randEquipment = Math.floor(Math.random() * equipText.length)
    const chosenUser = players[user]

    if (randEquipment >= 0 && randEquipment <= 7) { chosenUser[`weapon`] = `Stick` }
    if (randEquipment >= 8 && randEquipment <= 15) { chosenUser[`weapon`] = `Toy Knife` }
    if (randEquipment >= 16 && randEquipment <= 23) { chosenUser[`weapon`] = `Tough Glove` }
    if (randEquipment >= 24 && randEquipment <= 31) { chosenUser[`weapon`] = `Ballet Shoes` }
    if (randEquipment >= 32 && randEquipment <= 39) { chosenUser[`weapon`] = `Torn Notebook` }
    if (randEquipment >= 40 && randEquipment <= 47) { chosenUser[`weapon`] = `Burnt Pan` }
    if (randEquipment >= 48 && randEquipment <= 53) { chosenUser[`weapon`] = `Empty Gun` }
    if (randEquipment >= 54 && randEquipment <= 57) { chosenUser[`weapon`] = `Worn Dagger` }
    if (randEquipment === 58) { chosenUser[`weapon`] = `Real Knife` }
    if (randEquipment >= 59 && randEquipment <= 62) {
        chosenUser[`hp`] += 10 // Bandage
        if (chosenUser[`hp`] > getUserMaxHP(user)) { chosenUser[`hp`] = getUserMaxHP(user) }
    }
    if (randEquipment >= 63 && randEquipment <= 70) { chosenUser[`armor`] = `Faded Ribbon` }
    if (randEquipment >= 71 && randEquipment <= 78) { chosenUser[`armor`] = `Manly Bandanna` }
    if (randEquipment >= 79 && randEquipment <= 86) { chosenUser[`armor`] = `Old Tutu` }
    if (randEquipment >= 87 && randEquipment <= 94) { chosenUser[`armor`] = `Cloudy Glasses` }
    if (randEquipment >= 95 && randEquipment <= 96) { chosenUser[`armor`] = `Temmie Armor` }
    if (randEquipment >= 97 && randEquipment <= 104) { chosenUser[`armor`] = `Stained Apron` }
    if (randEquipment >= 105 && randEquipment <= 110) { chosenUser[`armor`] = `Cowboy Hat` }
    if (randEquipment >= 111 && randEquipment <= 112) { chosenUser[`armor`] = `Heart Locket` }
    if (randEquipment === 113) { chosenUser[`armor`] = `Locket` }
    if (randEquipment >= 114 && randEquipment <= 115) { console.log(`\x1b[31m%s\x1b[0m`, `(Dog Residue doesn't do anything)`) }
    if (randEquipment >= 116 && randEquipment <= 117) { console.log(`\x1b[31m%s\x1b[0m`, `(Punch Card doesn't do anything)`) }
    if (randEquipment === 118) { console.log(`\x1b[31m%s\x1b[0m`, `(Annoying Dog doesn't do anything)`) }
    if (randEquipment === 119) { console.log(`\x1b[31m%s\x1b[0m`, `(Mystery Key doesn't do anything)`) }
    if (randEquipment === 120) { console.log(`\x1b[31m%s\x1b[0m`, `(0 doesn't do anything)`) }

    return equipText[randEquipment]
}

function fetchGivenWeaponOrArmor(target) {
    const givenEquipText = [
        `the Stick. They ran and picked it up.`,
        `the Stick. They ran and picked it up.`,
        `the Stick. They ran and picked it up.`,
        `the Stick. They ran and picked it up.`,
        `the Stick. Its bark is worse than its bite.`,
        `the Stick. Its bark is worse than its bite.`,
        `the Stick. Its bark is worse than its bite.`,
        `the Stick. Its bark is worse than its bite.`,
        `the Toy Knife. +3 ATTACK`,
        `the Toy Knife. +3 ATTACK`,
        `the Toy Knife. +3 ATTACK`,
        `the Toy Knife. +3 ATTACK`,
        `the Toy Knife. Made of plastic. A rarity nowadays.`,
        `the Toy Knife. Made of plastic. A rarity nowadays.`,
        `the Toy Knife. Made of plastic. A rarity nowadays.`,
        `the Toy Knife. Made of plastic. A rarity nowadays.`,
        `the Tough Glove. +5 ATTACK`,
        `the Tough Glove. +5 ATTACK`,
        `the Tough Glove. +5 ATTACK`,
        `the Tough Glove. +5 ATTACK`,
        `the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `the Tough Glove. A worn pink leather glove. For five-fingered folk.`,
        `the Ballet Shoes. +7 ATTACK`,
        `the Ballet Shoes. +7 ATTACK`,
        `the Ballet Shoes. +7 ATTACK`,
        `the Ballet Shoes. +7 ATTACK`,
        `the Ballet Shoes. These used shoes make them feel incredibly dangerous.`,
        `the Ballet Shoes. These used shoes make them feel incredibly dangerous.`,
        `the Ballet Shoes. These used shoes make them feel incredibly dangerous.`,
        `the Ballet Shoes. These used shoes make them feel incredibly dangerous.`,
        `the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `the Torn Notebook. +2 ATTACK +6 INVULNERABILITY`,
        `the Torn Notebook. Contains illegible scrawls. Increases INVULNERABILITY by 6.`,
        `the Torn Notebook. Contains illegible scrawls. Increases INVULNERABILITY by 6.`,
        `the Torn Notebook. Contains illegible scrawls. Increases INVULNERABILITY by 6.`,
        `the Torn Notebook. Contains illegible scrawls. Increases INVULNERABILITY by 6.`,
        `the Burnt Pan. +10 ATTACK`,
        `the Burnt Pan. +10 ATTACK`,
        `the Burnt Pan. +10 ATTACK`,
        `the Burnt Pan. +10 ATTACK`,
        `the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP.`,
        `the Empty Gun. +12 ATTACK`,
        `the Empty Gun. +12 ATTACK`,
        `the Empty Gun. +12 ATTACK`,
        `the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low.`,
        `the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low.`,
        `the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low.`,
        `the Worn Dagger. +15 ATTACK`,
        `the Worn Dagger. +15 ATTACK`,
        `the Worn Dagger. Perfect for cutting plants and vines.`,
        `the Worn Dagger. Perfect for cutting plants and vines.`,
        `the Real Knife. About time.`,
        `a used Bandage. They re-applied the bandage. Still kind of gooey. They recovered 10 HP!`,
        `a used Bandage. They re-applied the bandage. Still kind of gooey. They recovered 10 HP!`,
        `a used Bandage. They re-applied the bandage. Still kind of gooey. They recovered 10 HP!`,
        `a used Bandage. They re-applied the bandage. Still kind of gooey. They recovered 10 HP!`,
        `the Faded Ribbon. +5 DEFENSE`,
        `the Faded Ribbon. +5 DEFENSE`,
        `the Faded Ribbon. +5 DEFENSE`,
        `the Faded Ribbon. +5 DEFENSE`,
        `the Faded Ribbon. If they're cuter, they won't get hit as hard.`,
        `the Faded Ribbon. If they're cuter, they won't get hit as hard.`,
        `the Faded Ribbon. If they're cuter, they won't get hit as hard.`,
        `the Faded Ribbon. If they're cuter, they won't get hit as hard.`,
        `the Manly Bandanna. +7 DEFENSE`,
        `the Manly Bandanna. +7 DEFENSE`,
        `the Manly Bandanna. +7 DEFENSE`,
        `the Manly Bandanna. +7 DEFENSE`,
        `the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `the Manly Bandanna. It has seen some wear. It has abs drawn on it.`,
        `the Old Tutu. +10 DEFENSE`,
        `the Old Tutu. +10 DEFENSE`,
        `the Old Tutu. +10 DEFENSE`,
        `the Old Tutu. +10 DEFENSE`,
        `the Old Tutu. Finally, a protective piece of armor.`,
        `the Old Tutu. Finally, a protective piece of armor.`,
        `the Old Tutu. Finally, a protective piece of armor.`,
        `the Old Tutu. Finally, a protective piece of armor.`,
        `the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `the Cloudy Glasses. +5 DEFENSE +9 INVULNERABILITY`,
        `the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `the Cloudy Glasses. Glasses marred with wear. Increases INVULNERABILITY by 9.`,
        `the Temmie Armor. The things you can do with a college education!`,
        `the Temmie Armor. tem armor so GOOds! any battle becom! a EASY victories!!!`,
        `the Stained Apron. +11 DEFENSE`,
        `the Stained Apron. +11 DEFENSE`,
        `the Stained Apron. +11 DEFENSE`,
        `the Stained Apron. +11 DEFENSE`,
        `the Stained Apron. Heals 1 HP every other turn.`,
        `the Stained Apron. Heals 1 HP every other turn.`,
        `the Stained Apron. Heals 1 HP every other turn.`,
        `the Stained Apron. Heals 1 HP every other turn.`,
        `the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
        `the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
        `the Cowboy Hat. This battle-worn hat makes them want to grow a beard.`,
        `the Cowboy Hat. This battle-worn hat makes them want to grow a beard.`,
        `the Cowboy Hat. This battle-worn hat makes them want to grow a beard. It also raises ATTACK by 5.`,
        `the Cowboy Hat. This battle-worn hat makes them want to grow a beard. It also raises ATTACK by 5.`,
        `the Heart Locket. +15 DEFENSE`,
        `the Heart Locket. It says "Best Friends Forever."`,
        `the Locket. They can feel it beating.`,
        `Dog Residue. The rest of their inventory filled up with Dog Residue.`,
        `Dog Residue. ... They finished using it. An uneasy atmosphere fills the room.`,
        `a Punch Card. Punching attacks became stronger.`,
        `a Punch Card. One step closer to a free Nice Cream...`,
        `the Annoying Dog. A little white dog. It's fast asleep...`,
        `the Mystery Key. ????? Probably to someone's house LOL.`,
        `0. If you are reading this, I messed up somehow.`
    ]

    const randEquipment = Math.floor(Math.random() * givenEquipText.length)
    const chosenUser = players[target]

    if (randEquipment >= 0 && randEquipment <= 7) { chosenUser[`weapon`] = `Stick` }
    if (randEquipment >= 8 && randEquipment <= 15) { chosenUser[`weapon`] = `Toy Knife` }
    if (randEquipment >= 16 && randEquipment <= 23) { chosenUser[`weapon`] = `Tough Glove` }
    if (randEquipment >= 24 && randEquipment <= 31) { chosenUser[`weapon`] = `Ballet Shoes` }
    if (randEquipment >= 32 && randEquipment <= 39) { chosenUser[`weapon`] = `Torn Notebook` }
    if (randEquipment >= 40 && randEquipment <= 47) { chosenUser[`weapon`] = `Burnt Pan` }
    if (randEquipment >= 48 && randEquipment <= 53) { chosenUser[`weapon`] = `Empty Gun` }
    if (randEquipment >= 54 && randEquipment <= 57) { chosenUser[`weapon`] = `Worn Dagger` }
    if (randEquipment === 58) { chosenUser[`weapon`] = `Real Knife` }
    if (randEquipment >= 59 && randEquipment <= 62) {
        chosenUser[`hp`] += 10 // Bandage
        if (chosenUser[`hp`] > getUserMaxHP(target)) { chosenUser[`hp`] = getUserMaxHP(target) }
    }
    if (randEquipment >= 63 && randEquipment <= 70) { chosenUser[`armor`] = `Faded Ribbon` }
    if (randEquipment >= 71 && randEquipment <= 78) { chosenUser[`armor`] = `Manly Bandanna` }
    if (randEquipment >= 79 && randEquipment <= 86) { chosenUser[`armor`] = `Old Tutu` }
    if (randEquipment >= 87 && randEquipment <= 94) { chosenUser[`armor`] = `Cloudy Glasses` }
    if (randEquipment >= 95 && randEquipment <= 96) { chosenUser[`armor`] = `Temmie Armor` }
    if (randEquipment >= 97 && randEquipment <= 104) { chosenUser[`armor`] = `Stained Apron` }
    if (randEquipment >= 105 && randEquipment <= 110) { chosenUser[`armor`] = `Cowboy Hat` }
    if (randEquipment >= 111 && randEquipment <= 112) { chosenUser[`armor`] = `Heart Locket` }
    if (randEquipment === 113) { chosenUser[`armor`] = `Locket` }
    if (randEquipment >= 114 && randEquipment <= 115) { console.log(`\x1b[31m%s\x1b[0m`, `(Dog Residue doesn't do anything)`) }
    if (randEquipment >= 116 && randEquipment <= 117) { console.log(`\x1b[31m%s\x1b[0m`, `(Punch Card doesn't do anything)`) }
    if (randEquipment === 118) { console.log(`\x1b[31m%s\x1b[0m`, `(Annoying Dog doesn't do anything)`) }
    if (randEquipment === 119) { console.log(`\x1b[31m%s\x1b[0m`, `(Mystery Key doesn't do anything)`) }
    if (randEquipment === 120) { console.log(`\x1b[31m%s\x1b[0m`, `(0 doesn't do anything)`) }

    return givenEquipText[randEquipment]
}

function deathCheck(chatroom, user, target) {
    console.log(`\x1b[31m%s\x1b[0m`, `${chatroom}, user: ${user}, target: ${target}, hp: ${players[target.toLowerCase()][`hp`]}`)
    const sendingPlayer = players[user.toLowerCase()]
    const targetPlayer = players[target.toLowerCase()]

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

            // Checking for LV threshold
            sendingPlayer[`exp`] += awardedEXP
            sendingPlayer[`next`] -= awardedEXP
            if (sendingPlayer[`next`] <= 0) {
                response += ` ${user}'s LOVE increased.`
                calculateUserLV(user)
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

        setTimeout(function () {
            client.say(chatroom, response)
            console.log(`\x1b[33m%s\x1b[0m`, `${chatroom} UndertaleBot: ${response}`)
        }, 2000)
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
    // console.log(`\x1b[31m%s\x1b[0m`, `${user}'s max HP is ${baseHP + (4 * userLV)}`)
    let maxHP = baseHP + (4 * userLV)
    if (userLV >= 20) { maxHP = 99 }
    return maxHP
}

function calculateUserATK(user) {
    const userLV = players[user.toLowerCase()][`lv`]
    // console.log(`\x1b[31m%s\x1b[0m`, `${user}'s ATK is ${Math.floor((userLV - 1) * baseDF)}`)
    let attack = baseAT + (2 * userLV)
    if (userLV >= 20) { attack = 38 }
    return attack
}

function calculateUserDEF(user) {
    const userLV = players[user.toLowerCase()][`lv`]
    // console.log(`\x1b[31m%s\x1b[0m`, `${user}'s DEF is ${Math.floor((userLV - 1) * baseDF)}`)
    let defense = Math.floor((userLV - 1) * baseDF)
    if (userLV >= 20) { defense = 4 }
    return defense
}

function calculateUserNextLV(user) {
    const userLV = players[user.toLowerCase()][`lv`]
    // console.log(`\x1b[31m%s\x1b[0m`, `${user}'s LV is ${userLV}`)

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
    while (player[`next`] <= 0) {
        console.log(`\x1b[31m%s\x1b[0m`, `user: ${user}, LV: ${player[`lv`]}, next: ${player[`next`]}, hp: ${player[`hp`]}`)
        player[`lv`] += 1
        player[`next`] += calculateUserNextLV(user)
        player[`at`] = calculateUserATK(user)
        player[`df`] = calculateUserDEF(user)
        player[`hp`] += 4
    }
    console.log(`\x1b[31m%s\x1b[0m`, `${user} reached LV ${player[`lv`]}, next: ${player[`next`]}, ATK: ${player[`at`]}, DEF: ${player[`df`]}, HP: ${player[`hp`]}`)
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
    client.say(CHANNEL_1, `I have been rebooted :)`)
}