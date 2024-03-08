require(`dotenv`).config()

const { talk, createClient, getSpamtonQuote, getSaveText, getIntroText, getUserMaxHP, getChannels, printLogo, makeLogs, showStats, showPlayers, announceCrash } = require(`./utils`)

const { BOT_USERNAME, BOT_CHANNEL, DEV, ACTIVE_CHANNELS, resetTxt, boldTxt, inverted, redTxt, greenTxt, settings } = require(`./config`)

const { joinedChannels, players, playerSave, highestLevels, weaponsATK, armorDEF, consumableItems, itemPrices } = require(`./data`)

const { handleFight } = require(`./fight`)

const { handleAct } = require(`./act`)

const { buyItem, dropItem, getPrices, itemLookup, sellItem, useItem } = require(`./item`)

const { handleMercy } = require(`./mercy`)

const { getSansFace } = require(`./sansFaces`)

process.on('uncaughtException', async (err) => {
    await announceCrash()
    console.error(err)
    process.exit(1)
})

// Called every time a message comes in
function onMessageHandler(channel, tags, message, self) {
    if (!joinedChannels[channel.substring(1)].active) { return }

    // Message context
    const user = tags.username
    const displayName = tags[`display-name`]
    const firstMsg = tags[`first-msg`]

    // Command and arguments parser
    const msg = message.replace(/ +/g, ` `).toLowerCase()
    const args = msg.split(` `)
    const command = args.shift()
    const toUser = args[0] ? args[0].replace(/^@/, ``) : null

    // First-time message
    if (firstMsg && channel === BOT_CHANNEL) { printLogo() }

    // Add/manage players
    if (!(user in players) && !self) {
        players[user] = {
            displayName: displayName,
            lv: 1,
            hp: 20,
            dead: false,
            timesKilled: 0,
            itemsSold: 0,
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
            timesKilled: 0,
            itemsSold: 0,
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
        talk(BOT_CHANNEL, message)
    }

    makeLogs()
    if (self) { return } // Ignore messages from the bot

    const sendingPlayer = players[user]
    const targetPlayer = toUser !== user && toUser in players ? players[toUser] : null
    const lastStanding = Object.keys(players).filter((player) => { return !players[player].dead }).length === 1

    // ******************
    // ** DEV COMMANDS **
    // ******************

    if (user === DEV && channel === BOT_CHANNEL) {
        // Bring the Dummy back to life
        if (command === `!revive`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            clearTimeout(settings.respawnTimer)
            players.dummy.hp = 20
            players.dummy.dead = false
            return talk(channel, `The Dummy has been revived!`)
        }

        // Connect to all known active channels
        if (command === `!connect`) {
            for (const chat of ACTIVE_CHANNELS) {
                createClient(chat, onMessageHandler)
            }
            return
        }

        // RECRUIT
        if (command === `!recruit`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            // List all active users in joinedChannels
            if (!toUser) { return talk(channel, `All active users: ${getChannels(true)}`) }

            // Confirm valid Twitch username format
            if (!toUser.match(/[a-zA-Z0-9]{4,25}/)) { return talk(channel, `Invalid Twitch username format!`) }

            // Confirm not in joinedChannels
            if (toUser in joinedChannels) {
                if (joinedChannels[toUser].active) {
                    return talk(channel, `Already activated in ${toUser}'s channel.`)
                } else {
                    joinedChannels[toUser].active = true
                    joinedChannels[toUser].timesJoined++
                    return talk(channel, `Reactivated in ${toUser}'s channel.`)
                }
            }

            createClient(toUser, onMessageHandler)
            return talk(BOT_CHANNEL, `${toUser} has been recruited!`)
        }

        // UNRECRUIT
        if (command === `!unrecruit`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            // List all inactive users in joinedChannels
            if (!toUser) { return talk(channel, `All inactive users: ${getChannels(false)}`) }

            // Confirm valid Twitch username format
            if (!toUser.match(/[a-zA-Z0-9]{4,25}/)) { return talk(channel, `Invalid Twitch username format!`) }

            if (toUser in joinedChannels) {
                if (joinedChannels[toUser].active) {
                    joinedChannels[toUser].active = false
                    joinedChannels[toUser].timesParted++
                    return talk(BOT_CHANNEL, `Deactivated in ${toUser}'s channel.`)
                } else {
                    return talk(channel, `Already deactivated in ${toUser}'s channel.`)
                }
            } else {
                return talk(channel, `Have not joined ${toUser}'s channel.`)
            }
        }

        // CHANGE ORIENTATION
        if (command === `!portrait`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            settings.landscapeView = false
            printLogo()
            return talk(channel, `Display is in portrait orientation mode`)
        }
        if (command === `!landscape`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            settings.landscapeView = true
            printLogo()
            return talk(channel, `Display is in landscape orientation mode`)
        }

        // RESET
        if (command === `!reset`) {
            for (const player in players) {
                players[player].lv = 1
                players[player].hp = 20
                players[player].dead = false
                players[player].timesKilled = 0
                players[player].at = 0
                players[player].df = 0
                players[player].exp = 0
                players[player].next = 10
                players[player].weapon = `Stick`
                players[player].armor = `Bandage`
                players[player].gold = 0
                players[player].stainedApronHealTime = false
                highestLevels[player] = 1
                if (player !== `dummy`) {
                    players[player].inventory = [`Monster Candy`, `Butterscotch Pie`]
                }
            }
            talk(channel, `/me When humans fall down here, strangely... I often feel like I already know them. Strange, is it not?`)
        }

        // TRUE RESET
        if (command === `!truereset`) {
            for (const player in players) {
                if (player !== `dummy`) {
                    delete players[player]
                    delete playerSave[player]
                    delete highestLevels[player]
                } else {
                    players[player].lv = 1
                    players[player].hp = 20
                    players[player].dead = false
                    players[player].timesKilled = 0
                    players[player].at = 0
                    players[player].df = 0
                    players[player].exp = 0
                    players[player].next = 10
                    players[player].weapon = `Stick`
                    players[player].armor = `Bandage`
                    players[player].gold = 0
                    players[player].stainedApronHealTime = false
                    players[player].inventory = []
                    highestLevels[player] = 1
                }
            }
            talk(channel, `/me If you DO end up erasing everything... You have to erase my memories, too.`)
        }

        // TOGGLE DEBUG MODE
        if (command === `!debug`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            const initialDebugState = settings.debug
            if (toUser === `on`) { settings.debug = true }
            else if (toUser === `off`) { settings.debug = false }
            else { settings.debug = !settings.debug }
            settings.debug === initialDebugState ? talk(channel, `Debug mode is currently ${settings.debug ? `on` : `off`}!`) : talk(channel, `Debug mode is now ${settings.debug ? `on` : `off`}!`)
        }
    }

    // *****************
    // ** REPLY CASES **
    // *****************

    // CHANNEL-SPECIFIC COMMANDS
    if (channel === BOT_CHANNEL) {
        // JOIN
        if (command === `!join`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            if (user in joinedChannels) {
                if (joinedChannels[user].active) {
                    return talk(channel, `${sendingPlayer.displayName}, I should already be active in your channel! Use !part if you would like me to leave!`)
                } else {
                    joinedChannels[user].active = true
                    joinedChannels[user].timesJoined++
                    talk(channel, `${sendingPlayer.displayName}, I have returned to your channel! Use !part in this channel if you would like me to leave!`)
                    return talk(`#${user}`, `* UndertaleBot blocks the way!`)
                }
            }

            createClient(user, onMessageHandler)
            return talk(BOT_CHANNEL, `${players[user].displayName}, I am now active in your Twitch channel! Use !part in this channel if you would like me to leave!`)
        }

        // PART
        if (command === `!part`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            if (user in joinedChannels) {
                if (joinedChannels[user].active) {
                    joinedChannels[user].active = false
                    joinedChannels[user].timesParted++
                    return talk(BOT_CHANNEL, `${players[user].displayName}, I have left your Twitch channel! Use !join in this channel if you would like me to come back!`)
                } else {
                    return talk(channel, `${sendingPlayer.displayName}, I am not currently active in your Twitch channel! Use !join if you would like me to come back!`)
                }
            } else {
                return talk(channel, `${sendingPlayer.displayName}, I am not active in your Twitch channel! Use !join if you would like to add me to it!`)
            }
        }

        // SANS FACE
        if (command === `!sans`) {
            console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

            return getSansFace()
        }
    }

    // FIGHT or ATTACK
    if ([`!fight`, `!attack`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        // Stop if target is the bot, dead, or not known, or if no target is specified
        if (toUser) {
            if (lastStanding) { return talk(channel, `* But nobody came.`) }
            if (toUser in players) {
                if (players[toUser].dead) { return talk(channel, `${players[toUser].displayName.substring(0, 1).toUpperCase() + players[toUser].displayName.substring(1)} is already dead! :(`) }
            }
            else if (toUser === `undertalebot`) { return talk(channel, `You can't FIGHT me, but you can try FIGHTing the Dummy!`) }
            else { return talk(channel, `${toUser} isn't a known player!`) }
        }
        else { return talk(channel, `* ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} tried to fight themself. But nothing happened.`) }
        return handleFight(channel, user, toUser)
    }

    // ACT
    if (command === `!act`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        if (toUser) {
            if (lastStanding) { return talk(channel, `* But nobody came.`) }
            if (toUser in players) {
                if (players[toUser].dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, ${players[toUser].displayName} is dead! :(`) }
            }
            else if (toUser === `undertalebot`) { return talk(channel, `You can't ACT with me, but you can try ACTing the Dummy!`) }
            else { return talk(channel, `${toUser} is not a registered player :(`) }
        }
        return handleAct(channel, user, toUser)
    }

    // ITEM or ITEMS or USE or EQUIP (for non-consumable items)
    if ([`!item`, `!items`, `!use`, `!equip`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)

        // Show items if none selected
        if (args.length === 0) {
            console.log(`Inventory:`, sendingPlayer.inventory)
            return talk(channel, `${capsName}'s items: ${sendingPlayer.inventory.join(`, `)}`)
        }

        const inventory = sendingPlayer.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) { return talk(channel, `${capsName} has no items! :(`) }

        // Can't use if dead
        if (sendingPlayer.dead) {
            console.log(`Inventory:`, sendingPlayer.inventory)
            return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`)
        }

        // Item validation
        const usedItem = itemLookup(args.join(` `))

        if (!usedItem) {
            console.log(`Inventory:`, sendingPlayer.inventory)
            return talk(channel, `${capsName}, that isn't an item! :(`)
        }

        // Can't use !equip if not a weapon or armor
        if (command === `!equip` && usedItem in consumableItems) { return }

        // Check possession
        const index = inventory.indexOf(usedItem)
        if (index < 0) {
            console.log(`Inventory:`, sendingPlayer.inventory)
            return talk(channel, `${capsName}, you don't have that item! :(`)
        }

        const response = useItem(user, usedItem, index)
        return talk(channel, response)
    }

    // MERCY or SPARE
    if ([`!mercy`, `!spare`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        // Check if toUser is the sender
        if (toUser && toUser !== user) {
            if (lastStanding) { return talk(channel, `* But nobody came.`) }
            if (toUser === `undertalebot`) { return talk(channel, `You can't MERCY me, but you can try MERCYing the Dummy!`) }
            if (!(toUser in players)) { return talk(channel, `${toUser} is not a known player!`) }
            if (targetPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, ${players[toUser].displayName} is dead! :(`) }
        }
        else { return talk(channel, `* ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} tried to spare themself. But nothing happened.`) }

        return handleMercy(channel, user, toUser)
    }

    // BUY or SHOP or GET
    if ([`!buy`, `!get`, `!shop`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        const item = itemLookup(args.join(` `))
        const purchasedItem = [`nice cream`, `bisicle`, `temmie armor`].includes(item) || item in itemPrices ? item : null

        if (purchasedItem) {
            talk(channel, buyItem(user, purchasedItem))
        } else {
            let response = `${sendingPlayer.displayName} can buy: `
            if (sendingPlayer.lv >= 1) { response += `Spider Donut, Spider Cider` }
            if (sendingPlayer.lv >= 2) { response += `, Nice Cream, Bisicle, Cinnamon Bunny, Tough Glove, Manly Bandanna` }
            if (sendingPlayer.lv >= 3) { response += `, Crab Apple, Sea Tea, Temmie Flakes, Torn Notebook, Cloudy Glasses` }
            if (sendingPlayer.lv >= 4) { response += `, Temmie Armor, Hot Dog...?` }
            if (sendingPlayer.lv >= 5) { response += `, Junk Food, Starfait, Glamburger, Legendary Hero, Steak in the Shape of Mettaton's Face, Empty Gun, Cowboy Hat` }
            if (sendingPlayer.lv >= 6) { response += `, Popato Chisps` }
            talk(channel, response)
        }
    }

    // PRICE(S) of items
    if ([`!price`, `!prices`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)
        const response = getPrices(user, args)
        return talk(channel, response)
    }

    // DROP item
    if (command === `!drop` && args.length !== 0) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        // Can't use if dead
        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)

        const inventory = sendingPlayer.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) { return talk(channel, `${capsName} has no items! :(`) }

        // Item validation
        const droppedItem = itemLookup(args.join(` `))

        if (!droppedItem) { return talk(channel, `${capsName}, that isn't an item! :(`) }

        // Check possession
        const index = inventory.indexOf(droppedItem)
        if (index < 0) {
            console.log(`Inventory:`, sendingPlayer.inventory)
            return talk(channel, `${capsName}, you don't have that item! :(`)
        }

        const response = dropItem(user, droppedItem, index)
        console.log(`Inventory:`, sendingPlayer.inventory)
        return talk(channel, response)
    }

    // SELL item (LV 3)
    if (command === `!sell`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        // Can't use if dead
        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        // Can't use if not LV 3
        if (sendingPlayer.lv < 3) { return talk(channel, `* Huh? Sell somethin'? Does this look like a pawn shop? I don't know how it works where you come from... but... If I started spending money on old branches and used bandages, I'd be out of business in a jiffy!`) }

        if (args.length === 0) { return talk(channel, `* hOI! welcom to... da TEM SHOP!!!`) }

        const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
        const inventory = sendingPlayer.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) { return talk(channel, `* no more item...`) }

        // Item validation
        const soldItem = itemLookup(args.join(` `))
        if (!soldItem) { return talk(channel, `${capsName}, that isn't an item! :(`) }

        // Check possession
        const index = inventory.indexOf(soldItem)
        if (index < 0) {
            console.log(`Inventory:`, sendingPlayer.inventory)
            return talk(channel, `${capsName}, you don't have that item! :(`)
        }

        const response = sellItem(user, soldItem, index)
        console.log(`Inventory:`, sendingPlayer.inventory)
        return talk(channel, response)
    }

    // SAVE
    if (command === `!save`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        playerSave[user] = { ...players[user] }
        playerSave[user].inventory = [...players[user].inventory]

        const response = getSaveText(displayName)
        showStats(user)
        return talk(channel, response)
    }

    // LOAD
    if (command === `!load`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        players[user] = { ...playerSave[user] }
        players[user].inventory = [...playerSave[user].inventory]

        let response = `Reloading: "${sendingPlayer.displayName}" `
        const attackBonus = sendingPlayer.armor === `Cowboy Hat` ? 5 : sendingPlayer.armor === `Temmie Armor` ? 10 : 0
        response += `LV: ${players[user].lv}, HP: ${players[user].hp}/${getUserMaxHP(user)}, AT: ${players[user].at}(${weaponsATK[players[user].weapon] + attackBonus}), DF: ${players[user].df}(${armorDEF[players[user].armor]}), EXP: ${players[user].exp}, NEXT: ${players[user].next}, WEAPON: ${players[user].weapon}, ARMOR: ${players[user].armor}, GOLD: ${players[user].gold}`
        showStats(user)
        return talk(channel, response)
    }

    // CHECK or STAT(S)
    if ([`!check`, `!stats`, `!stat`, `!status`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (toUser in players) {
            showStats(toUser)
            const targetPlayer = players[toUser]
            const attackBonus = targetPlayer.armor === `Cowboy Hat` ? 5 : targetPlayer.armor === `Temmie Armor` ? 10 : 0
            return talk(channel, `"${user === `dummy` ? `DUMMY` : targetPlayer.displayName}" LV: ${targetPlayer.lv}, HP: ${targetPlayer.hp}/${getUserMaxHP(toUser)}, AT: ${targetPlayer.at}(${weaponsATK[targetPlayer.weapon] + attackBonus}), DF: ${targetPlayer.df}(${armorDEF[targetPlayer.armor]}), EXP: ${targetPlayer.exp}, NEXT: ${targetPlayer.next}, WEAPON: ${targetPlayer.weapon}, ARMOR: ${targetPlayer.armor}, GOLD: ${targetPlayer.gold}`)
        } else if (toUser) {
            return talk(channel, `${toUser} isn't a known player!`)
        } else {
            showStats(user)
            const attackBonus = sendingPlayer.armor === `Cowboy Hat` ? 5 : sendingPlayer.armor === `Temmie Armor` ? 10 : 0
            return talk(channel, `"${user === `dummy` ? `DUMMY` : sendingPlayer.displayName}" LV: ${sendingPlayer.lv}, HP: ${sendingPlayer.hp}/${getUserMaxHP(user)}, AT: ${sendingPlayer.at}(${weaponsATK[sendingPlayer.weapon] + attackBonus}), DF: ${sendingPlayer.df}(${armorDEF[sendingPlayer.armor]}), EXP: ${sendingPlayer.exp}, NEXT: ${sendingPlayer.next}, WEAPON: ${sendingPlayer.weapon}, ARMOR: ${sendingPlayer.armor}, GOLD: ${sendingPlayer.gold}`)
        }
    }

    // HP
    if (command === `!hp`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.hp} HP`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has ${sendingPlayer.hp} HP`) }
    }

    // GOLD
    if (command === `!gold`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.gold} G`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has ${sendingPlayer.gold} G`) }
    }

    // EXP or EXPERIENCE
    if ([`!exp`, `!experience`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.exp} EXP`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has ${sendingPlayer.exp} EXP`) }
    }

    // NEXT
    if (command === `!next`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)}'s LV will increase with ${targetPlayer.next} more EXP`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName}'s LV will increase with ${sendingPlayer.next} more EXP`) }
    }

    // WEAPON
    if (command === `!weapon`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has the ${targetPlayer.weapon} equipped (${weaponsATK[targetPlayer.weapon]} ATK)`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has the ${sendingPlayer.weapon} equipped (${weaponsATK[sendingPlayer.weapon]} ATK)`) }
    }

    // ARMOR
    if ([`!armor`, `!armour`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (targetPlayer) { return talk(channel, `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has the ${targetPlayer.armor} equipped (${armorDEF[targetPlayer.armor]} DEF)`) }
        else if (toUser) { return talk(channel, `${toUser} isn't a known player!`) }
        else { return talk(channel, `${sendingPlayer.displayName} has the ${sendingPlayer.armor} equipped (${armorDEF[sendingPlayer.armor]} DEF)`) }
    }

    // INTRO
    if (command === `!intro`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (sendingPlayer.dead) { return talk(channel, `Sorry ${sendingPlayer.displayName}, you are dead! :(`) }

        const response = getIntroText(sendingPlayer.displayName)
        return talk(channel, response)
    }

    // SPAMTON QUOTE
    if (command === `!spamton`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = getSpamtonQuote(toUser)
        return talk(channel, response)
    }

    // MEMORY or PLAYERS
    if ([`!memory`, `!players`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        return showPlayers(channel)
    }

    // HELP
    if (command === `!help`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = `${sendingPlayer.displayName}: This bot simulates playing Undertale! You can interact with others (try !commands to learn more), and check the stats of yourself or other users with !stats, !hp, !exp, !gold, etc. You can also view all known players by using !memory.`
        return talk(channel, response)
    }

    // COMMANDS
    if (command === `!commands`) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        const response = `!FIGHT user -> Attack a user, !ACT -> With or without another user, !ITEM -> Check for (or use) items in your inventory, !MERCY user -> Attempt to spare a user. Use !buy and/or !price to spend gold. Manage your SAVE file with !save and !load. Try !docs to read more!`
        return talk(channel, response)
    }

    // UNDERTALE or LOGO
    if ([`!undertale`, `!logo`].includes(command)) {
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)
        return printLogo()
    }

    // DOCS
    if (command === `!docs`) { return talk(channel, `Check out the docs here: https://github.com/jordbort/Twitch-UndertaleBot/blob/main/README.md`) }
}

createClient(BOT_USERNAME, onMessageHandler)
