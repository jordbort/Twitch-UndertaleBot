require(`dotenv`).config()
const BOT_USERNAME = process.env.BOT_USERNAME

const {
    CHANNEL_1,
    DEV,
    OAUTH_TOKEN,
    squad,
    tmi,
    client,
    talk,
    getSpamtonQuote,
    getSaveText,
    getIntroText,
    getUserMaxHP,
    printLogo
} = require(`./utils`)

const {
    resetTxt,
    boldTxt,
    inverted,
    redTxt,
    greenTxt,
    redBg,
    greenBg,
    settings
} = require(`./config`)

const {
    globalUsers,
    players,
    playerSave,
    highestLevels,
    weaponsATK,
    armorDEF,
    consumableItems
} = require(`./data`)

const { handleFight } = require(`./fight`)

const { handleAct } = require(`./act`)

const { buyItem, itemLookup, useItem } = require(`./item`)

const { handleMercy } = require(`./mercy`)

const { getSansFace } = require(`./sansFaces`)

process.on('uncaughtException', (err) => {
    const errorPosition = err.stack.split(`\n`)[1].split(`/`)[0].substring(4) + err.stack.split(`\n`)[1].split(`/`)[err.stack.split(`\n`)[1].split(`/`).length - 1]
    talk(`#${BOT_USERNAME}`, `*CRASH* >( Uncaught Exception: ${err.message} ${errorPosition}`)
    console.log(err)
    process.exit(1)
})

function createClient(arr) {
    if (settings.debug) {
        console.log(`${boldTxt}> createClient(arr: ${arr})${resetTxt}`)
        if (!Array.isArray(arr)) { console.log(`${redBg}${boldTxt}*** WARNING: Arr data type is not an array!${resetTxt}`) }
        arr.map((chatroom) => { if (!chatroom.startsWith(`#`)) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'chatroom' data being sent (doesn't start with '#')!${resetTxt}`) } })
    }

    const client = new tmi.client({
        identity: {
            username: BOT_USERNAME,
            password: OAUTH_TOKEN
        },
        channels: arr
    })
    client.on(`message`, onMessageHandler)
    client.connect()

    arr.map((chatroom) => { talk(chatroom, `* UndertaleBot blocks the way!`) })
}

// Called every time a message comes in
function onMessageHandler(channel, tags, message, self) {
    if (self || tags.username === BOT_USERNAME) { return } // Ignore messages from the bot

    // Message context
    const user = tags.username
    const displayName = tags[`display-name`]
    const senderIsAMod = tags.mod
    const firstMsg = tags[`first-msg`]

    // Command and arguments parser
    const msg = message.toLowerCase()
    const args = msg.split(` `)
    const command = args.shift()
    const toUser = args[0] ? args[0].replace(/^@/, ``) : null

    // First-time message
    if (firstMsg && channel === CHANNEL_1) { printLogo() }

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
        highestLevels[user] = 1
        const message = getIntroText(displayName)
        talk(CHANNEL_1, message)
    }
    const sendingPlayer = players[user]
    const targetPlayer = toUser !== user && toUser in players ? players[toUser] : null

    // *****************
    // ** REPLY CASES **
    // *****************

    // TOGGLE DEBUG MODE
    if (command === `!debug`
        && channel === CHANNEL_1
        && user === DEV) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const initialDebugState = settings.debug
        if (toUser === `on`) { settings.debug = true }
        else if (toUser === `off`) { settings.debug = false }
        else { settings.debug = !settings.debug }
        settings.debug === initialDebugState ? talk(channel, `Debug mode is currently ${settings.debug ? `on` : `off`}!`) : talk(channel, `Debug mode is now ${settings.debug ? `on` : `off`}!`)
    }

    // JOIN
    if (command === `!join`
        && channel === CHANNEL_1) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (globalUsers.includes(user)) { return talk(channel, `${sendingPlayer.displayName}, I should already be active in your channel! Try using a command like !stats in your chat if you're not sure! :O`) }

        globalUsers.push(user)
        createClient([`#${user}`])
        return talk(CHANNEL_1, `${players[user].displayName}, I am now active in your Twitch channel! This will only last until I am rebooted, which is frequent since I'm under development, so don't expect me to stay for long! While I'm streaming, you can always come back and use !join if I disappear from your chat. ;)`)
    }

    // RECRUIT
    if (command === `!recruit`
        && channel === CHANNEL_1
        && user === DEV) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (!args.length) { return talk(channel, `All users: ${globalUsers.join(`, `)}`) }

        const newUsers = []
        for (const str of args) {
            if (!globalUsers.includes(str)) {
                globalUsers.push(str)
                newUsers.push(`#${str}`)
            }
        }
        newUsers.length === 0 ? talk(channel, `Recruited 0 users! :O`) : talk(channel, `Recruited ${newUsers.length}/${args.length} users! :)`)
        return createClient(newUsers)
    }

    // ALL
    if (command === `!all`
        && channel === CHANNEL_1
        && user === DEV) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const newUsers = []
        for (const chatroom of squad) {
            if (!globalUsers.includes(chatroom.substring(1))) {
                globalUsers.push(chatroom.substring(1))
                newUsers.push(chatroom)
            }
        }
        newUsers.length === 0 ? talk(channel, `All channels are already recruited! :O`) : talk(channel, `Recruited ${newUsers.length}/${squad.length} users! :)`)
        return createClient(newUsers)
    }

    // MEMORY
    if ([
        `!memory`,
        `!players`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const allPlayers = []
        for (const player in players) {
            const logColor = players[player].dead ? redBg : greenBg
            console.log(`${logColor} ${players[player].displayName} LV: ${players[player].lv}, HP: ${players[player].hp}/${getUserMaxHP(player)}, AT: ${players[player].at}, DF: ${players[player].df}, EXP: ${players[player].exp}, NEXT: ${players[player].next}, Weapon: ${players[player].weapon}, Armor: ${players[player].armor}, Gold: ${players[player].gold} ${resetTxt}`)
            allPlayers.push(players[player].displayName)
        }
        return talk(channel, `Players: ${allPlayers.join(`, `)}`)
    }

    // REVIVE (for testing, mods can also use)
    if (command === `!revive`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (user === DEV || senderIsAMod) {
            players.dummy.hp = getUserMaxHP(`dummy`)
            players.dummy.dead = false
            return talk(channel, `The Dummy is alive :)`)
        }
        else { return talk(channel, `You can't use this command, ${sendingPlayer.displayName} ;)`) }
    }

    // SAVE
    if (command === `!save`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        playerSave[user] = { ...players[user] }

        const response = getSaveText(displayName)
        return talk(channel, response)
    }

    // LOAD
    if (command === `!load`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        players[user] = { ...playerSave[user] }
        players[user].inventory = playerSave[user].inventory

        let response = `Reloading: "${sendingPlayer.displayName}" `
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

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        const response = getIntroText(sendingPlayer.displayName)
        return talk(channel, response)
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
        let userInventory = null
        if (toUser in players) {
            const target = players[toUser]
            userInventory = target.inventory
            if (target.armor === `Cowboy Hat`) { attackBoost = 5 }
            if (target.armor === `Temmie Armor`) { attackBoost = 10 }
            response = `"${toUser === `dummy` ? `DUMMY` : target.displayName}" LV: ${target.lv}, HP: ${target.hp}/${getUserMaxHP(toUser)}, AT: ${target.at}(${weaponsATK[target.weapon] + attackBoost}), DF: ${target.df}(${armorDEF[target.armor]}), EXP: ${target.exp}, NEXT: ${target.next}, WEAPON: ${target.weapon}, ARMOR: ${target.armor}, GOLD: ${target.gold}`
        }
        else if (toUser) { response = `${toUser} isn't a registered player! :(` }
        else {
            userInventory = sendingPlayer.inventory
            if (sendingPlayer.armor === `Cowboy Hat`) { attackBoost = 5 }
            if (sendingPlayer.armor === `Temmie Armor`) { attackBoost = 10 }
            response = `"${sendingPlayer.displayName}" LV: ${sendingPlayer.lv}, HP: ${sendingPlayer.hp}/${getUserMaxHP(user)}, AT: ${sendingPlayer.at}(${weaponsATK[sendingPlayer.weapon] + attackBoost}), DF: ${sendingPlayer.df}(${armorDEF[sendingPlayer.armor]}), EXP: ${sendingPlayer.exp}, NEXT: ${sendingPlayer.next}, WEAPON: ${sendingPlayer.weapon}, ARMOR: ${sendingPlayer.armor}, GOLD: ${sendingPlayer.gold}`
        }
        talk(channel, response)
        if (userInventory) { console.log(`Inventory:`, userInventory) }
        return
    }

    // SPAMTON QUOTE
    if (command === `!spamton`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = getSpamtonQuote(toUser)
        return talk(channel, response)
    }

    // SANS FACE
    if (command === `!sans`
        && channel === CHANNEL_1) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        return getSansFace()
    }

    // FIGHT or ATTACK
    if ([
        `!fight`,
        `!attack`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        // Stop if target is the bot, dead, or not known, or if no target is specified
        if (toUser) {
            if (toUser in players) {
                if (players[toUser].dead) { return talk(channel, `${players[toUser].displayName.substring(0, 1).toUpperCase() + players[toUser].displayName.substring(1)} is already dead! :(`) }
            }
            else if (toUser === `undertalebot`) { return talk(channel, `You can't fight me, but you can try fighting the Dummy!`) }
            else { return talk(channel, `${toUser} isn't a known player!`) }
        }
        else { return talk(channel, `* ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} tried to fight themself. But nothing happened.`) }
        return handleFight(channel, user, toUser)
    }

    // ACT
    if (command === `!act`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        if (toUser) {
            if (toUser in players) {
                if (players[toUser].dead) {
                    return talk(channel, `Sorry ${sendingPlayer.displayName}, ${players[toUser].displayName} is dead! :(`)
                }
            }
            else { return talk(channel, `${toUser} is not a registered player :(`) }
        }
        return handleAct(channel, user, toUser)
    }

    // ITEM or ITEMS or USE or EQUIP (for non-consumable items)
    if ([
        `!item`,
        `!items`,
        `!use`,
        `!equip`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
        console.log(`Inventory:`, sendingPlayer.inventory)

        // Show items if none mentioned
        if (!toUser) { return talk(channel, `${capsName}'s items: ${sendingPlayer.inventory.join(`, `)}`) }

        const inventory = sendingPlayer.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) { return talk(channel, `${capsName} has no items! :(`) }

        // Can't use if dead
        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        // Item validation
        const usedItem = itemLookup(channel, capsName, args.join(` `))

        if (!usedItem) { return talk(channel, `${capsName}, that isn't an item! :(`) }

        // Can't use !equip if not a weapon or armor
        if (command === `!equip` && usedItem in consumableItems) { return }

        // Check possession
        const index = inventory.indexOf(usedItem)
        if (index < 0) { return talk(channel, `${capsName}, you don't have that item! :(`) }

        const response = useItem(user, usedItem, index)
        return talk(channel, response)
    }

    // MERCY or SPARE
    if ([
        `!mercy`,
        `!spare`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        // Check if toUser is the sender
        if (toUser && toUser !== user) {
            if (toUser === `undertalebot`) { return talk(channel, `You can't spare me, but you can try sparing the Dummy!`) }
            if (!(toUser in players)) { return talk(channel, `${toUser} is not a known player :(`) }
            if (targetPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, ${players[toUser].displayName} is dead! :(`) }
        }
        else { return talk(channel, `* ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} tried to spare themself. But nothing happened.`) }

        return handleMercy(channel, user, toUser)
    }

    // HP
    if (command === `!hp`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.hp} HP`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has ${sendingPlayer.hp} HP`) }
    }

    // GOLD
    if (command === `!gold`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.gold} G`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has ${sendingPlayer.gold} G`) }
    }

    // EXP or EXPERIENCE
    if ([
        `!exp`,
        `!experience`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.exp} EXP`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has ${sendingPlayer.exp} EXP`) }
    }

    // NEXT
    if (command === `!next`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)}'s LV will increase with ${targetPlayer.next} more EXP`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName}'s LV will increase with ${sendingPlayer.next} more EXP`) }
    }

    // WEAPON
    if (command === `!weapon`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has the ${targetPlayer.weapon} equipped (${weaponsATK[targetPlayer.weapon]} ATK)`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has the ${sendingPlayer.weapon} equipped (${weaponsATK[sendingPlayer.weapon]} ATK)`) }
    }

    // ARMOR
    if (command === `!armor`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has the ${targetPlayer.armor} equipped (${armorDEF[targetPlayer.armor]} DEF)`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has the ${sendingPlayer.armor} equipped (${armorDEF[sendingPlayer.armor]} DEF)`) }
    }

    // BUY or SHOP or GET
    if ([
        `!buy`,
        `!get`,
        `!shop`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        if (!toUser) {
            let response = `${sendingPlayer.displayName} can buy: `
            if (sendingPlayer.lv >= 1) { response += `Spider Donut, Spider Cider` }
            if (sendingPlayer.lv >= 2) { response += `, Nice Cream, Bisicle, Cinnamon Bunny, Tough Glove, Manly Bandanna` }
            if (sendingPlayer.lv >= 3) { response += `, Crab Apple, Sea Tea, Temmie Flakes, Torn Notebook, Cloudy Glasses` }
            if (sendingPlayer.lv >= 4) { response += `, Temmie Armor, Hot Dog...?, Hot Cat` }
            if (sendingPlayer.lv >= 5) { response += `, Junk Food, Starfait, Glamburger, Legendary Hero, Steak in the Shape of Mettaton's Face, Empty Gun, Cowboy Hat` }
            if (sendingPlayer.lv >= 6) { response += `, Popato Chisps` }
            return talk(channel, response)
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

        const purchasedItem = args.join(` `) in itemPrices ? args.join(` `) : null

        return purchasedItem
            ? talk(channel, buyItem(user, purchasedItem, itemPrices[purchasedItem]))
            : talk(channel, `Sorry ${sendingPlayer.displayName}, that item doesn't exist! :(`)
    }

    // COMMANDS
    if (command === `!commands`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = `!fight: @ another chat member to attack them, !act: Do an action by yourself or @ another chat member, !item: Check for (or use) items in your inventory, !mercy: @ another chat member to attempt to spare them, !buy: Spend gold on items, or check what is possible to buy, !save: Use determination to save your current state, !load: Reload your previous save file`
        return talk(channel, response)
    }

    // HELP
    if (command === `!help`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = `${sendingPlayer.displayName}: This bot simulates playing Undertale! You can interact with others (try !commands to learn more), and check your stats with !stats, !hp, and !gold. You can view all known players by using !memory. While this bot is online, you can use !join in its channel to make it monitor your channel's chat too!`
        return talk(channel, response)
    }

    // UNDERTALE or LOGO
    if ([
        `!undertale`,
        `!logo`
    ].includes(command)) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)
        return printLogo()
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    if (settings.firstConnection) {
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
    settings.firstConnection = false
}

// Register our event handlers (defined below)
client.on(`message`, onMessageHandler)
client.on(`connected`, onConnectedHandler)

// Connect to Twitch:
client.connect()
