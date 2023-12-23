require(`dotenv`).config()

const {
    BOT_USERNAME,
    CHANNEL_1,
    DEV,
    OAUTH_TOKEN,
    squad,
    tmi,
    client,
    talk,
    createClient,
    getSpamtonQuote,
    getIntroText,
    getThirdPersonFlavorText,
    getAction,
    stainedApronHeal,
    deathCheck,
    getUserMaxHP,
    calculateUserATK,
    calculateUserDEF,
    calculateUserNextLV,
    calculateUserLV,
    printLogo,
    printFight,
    printAct,
    printItem,
    printMercy,
    buyItem,
    useItem,
    sansOpenEyes,
    sansClosedEyes,
    sansNoEyes,
    sansWink,
    sansLookAround,
    sansSmall
} = require(`./utils`)

const {
    resetTxt,
    boldTxt,
    inverted,
    redTxt,
    greenTxt,
    yellowTxt,
    blueTxt,
    magentaTxt,
    cyanTxt,
    orangeTxt,
    redBg,
    greenBg,
    yellowBg,
    blueBg,
    magentaBg,
    cyanBg,
    grayBg,
    orangeBg,
    settings
} = require(`./config`)

const {
    globalUsers,
    players,
    playerSave,
    highestLevels,
    weaponsATK,
    armorDEF
} = require(`./data`)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

let lastSansFace = 4

// Called every time a message comes in
function onMessageHandler(channel, tags, msg, self) {
    if (self || tags.username === BOT_USERNAME) { return } // Ignore messages from the bot

    // Message context
    const user = tags.username
    const displayName = tags[`display-name`]
    const senderIsAMod = tags.mod
    const firstMsg = tags['first-msg']

    // Command and arguments parser
    const args = msg.split(' ')
    const command = args.shift().toLowerCase()
    const toUser = args[0] ? args[0].replace(/^@/, ``) : ``

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
    const targetPlayer = toUser.toLowerCase() !== user && toUser.toLowerCase() in players ? players[toUser.toLowerCase()] : null

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
        if (args[0]?.toLowerCase() === `on`) { settings.debug = true }
        else if (args[0]?.toLowerCase() === `off`) { settings.debug = false }
        else { settings.debug = !settings.debug }
        settings.debug === initialDebugState ? talk(channel, `Debug mode is currently ${settings.debug ? `on` : `off`}!`) : talk(channel, `Debug mode is now ${settings.debug ? `on` : `off`}!`)
    }

    // JOIN
    if (command === `!join`
        && channel === CHANNEL_1) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (globalUsers.includes(user)) {
            talk(channel, `${sendingPlayer.displayName}, I should already be active in your channel! Try using a command like !stats in your chat if you're not sure! :O`)
            return
        }

        globalUsers.push(user)
        createClient([`#${user}`])
        talk(CHANNEL_1, `${players[user].displayName}, I am now active in your Twitch channel! This will only last until I am rebooted, which is frequent since I'm under development, so don't expect me to stay for long! While I'm streaming, you can always come back and use !join if I disappear from your chat. ;)`)
        return
    }

    // RECRUIT
    if (command === `!recruit`
        && channel === CHANNEL_1
        && user === DEV) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        if (!args.length) {
            talk(channel, `All users: ${globalUsers.join(', ')}`)
            return
        }

        const newUsers = []
        for (const str of args) {
            if (!globalUsers.includes(str.toLowerCase())) {
                globalUsers.push(str.toLowerCase())
                newUsers.push(`#${str.toLowerCase()}`)
            }
        }
        newUsers.length === 0 ? talk(channel, `Recruited 0 users! :O`) : talk(channel, `Recruited ${newUsers.length}/${args.length} users! :)`)
        createClient(newUsers)
        return
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
        createClient(newUsers)
        return
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
        talk(channel, `Players: ${allPlayers.join(`, `)}`)
        return
    }

    // REVIVE (for testing, mods can also use)
    if (command === `!revive`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (user === DEV || senderIsAMod) {
            players.dummy.hp = getUserMaxHP(`dummy`)
            players.dummy.dead = false
            response = `The Dummy is alive :)`
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

        const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
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
            `${capsName} feels a calming tranquility. ${capsName} is filled with determination.`,
            `${capsName} feels... something. ${capsName} is filled with detemmienation.`,
            `The wind is howling. ${capsName} is filled with determination.`,
            `The wind has stopped. ${capsName} is filled with determination.`,
            `The howling wind is now a breeze. This gives ${sendingPlayer.displayName} determination.`,
            `Seeing such a strange laboratory in a place like this... ${capsName} is filled with determination.`,
            `The wooshing sound of steam and cogs... it fills ${sendingPlayer.displayName} with determination.`,
            `An ominous structure looms in the distance... ${capsName} is filled with determination.`,
            `Knowing the mouse might one day hack into the computerized safe and get the cheese... It fills ${sendingPlayer.displayName} with determination.`,
            `The smell of cobwebs fills the air... ${capsName} is filled with determination.`,
            `The relaxing atmosphere of this hotel... it fills ${sendingPlayer.displayName} with determination.`,
            `The air is filled with the smell of ozone... it fills ${sendingPlayer.displayName} with determination.`,
            `Behind this door must be the elevator to the King's castle. ${capsName} is filled with determination.`
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

        const response = getIntroText(sendingPlayer.displayName)
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
        let userInventory = null
        if (toUser && toUser.toLowerCase() in players) {
            const target = players[toUser.toLowerCase()]
            userInventory = target.inventory
            if (target.armor === `Cowboy Hat`) { attackBoost = 5 }
            if (target.armor === `Temmie Armor`) { attackBoost = 10 }
            response = `"${toUser.toLowerCase() === `dummy` ? `DUMMY` : target.displayName}" LV: ${target.lv}, HP: ${target.hp}/${getUserMaxHP(toUser.toLowerCase())}, AT: ${target.at}(${weaponsATK[target.weapon] + attackBoost}), DF: ${target.df}(${armorDEF[target.armor]}), EXP: ${target.exp}, NEXT: ${target.next}, WEAPON: ${target.weapon}, ARMOR: ${target.armor}, GOLD: ${target.gold}`
        } else if (toUser) {
            response = `${toUser} isn't registered :(`
        } else {
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

        const response = getSpamtonQuote(args[0])
        talk(channel, response)
        return
    }

    // SANS FACE
    if (command === `!sans`
        && channel === CHANNEL_1) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)
        const sansExpressions = [
            sansOpenEyes,
            sansLookAround,
            sansWink,
            sansClosedEyes,
            sansNoEyes,
            sansSmall
        ]
        let expression = Math.floor(Math.random() * sansExpressions.length)
        while (expression === lastSansFace) {
            if (settings.debug) { console.log(`${boldTxt}> Re-rolling facial expression...${resetTxt}`) }
            expression = Math.floor(Math.random() * sansExpressions.length)
        }
        lastSansFace = expression
        return sansExpressions[expression]()
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

        // Stop if target is the bot, dead, or not known, or if no target is specified
        if (toUser) {
            if (toUser.toLowerCase() in players) {
                if (players[toUser.toLowerCase()].dead) {
                    talk(channel, `${players[toUser.toLowerCase()].displayName.substring(0, 1).toUpperCase() + players[toUser.toLowerCase()].displayName.substring(1)} is already dead! :(`)
                    return
                }
            } else if (toUser.toLowerCase() === `undertalebot`) {
                talk(channel, `You can't fight me, but you can try fighting the Dummy!`)
                return
            } else {
                talk(channel, `${toUser} isn't a known player!`)
                return
            }
        } else {
            talk(channel, `* ${capsSender} tried to fight themself. But nothing happened.`)
            return
        }

        printFight()
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

        if (randNum === 1) {
            if (mediumDamage >= 6) { response += ` Critical hit!` }
        } else if (randNum === 2) {
            if (largeDamage >= 6) { response += ` Critical hit!` }
        } else if (randNum === 3) {
            if (extraLargeDamage >= 6) { extraLargeDamage === 10 ? response += ` Ouch!` : response += ` Critical hit!` }
        }

        if (targetPlayer) {
            if (randNum === 0) {
                targetPlayer.hp -= smallDamageDealt
                console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser.toLowerCase() === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
            } else if (randNum === 1) {
                targetPlayer.hp -= mediumDamageDealt
                console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser.toLowerCase() === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
            } else if (randNum === 2) {
                targetPlayer.hp -= largeDamageDealt
                console.log(`${grayBg} largeDamage: ${largeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${largeDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser.toLowerCase() === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${largeDamageDealt} ${resetTxt}`)
            } else if (randNum === 3) {
                targetPlayer.hp -= extraLargeDamageDealt
                console.log(`${grayBg} extraLargeDamage: ${extraLargeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${extraLargeDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser.toLowerCase() === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${extraLargeDamageDealt} ${resetTxt}`)
            }

            if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

            talk(channel, response)
            deathCheck(channel, user, toUser.toLowerCase())
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

            talk(channel, response)
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
                if (players[toUser.toLowerCase()].dead) {
                    talk(channel, `Sorry ${sendingPlayer.displayName}, ${players[toUser.toLowerCase()].displayName} is dead! :(`)
                    return
                }
            } else {
                talk(channel, `${toUser} is not a registered player :(`)
                return
            }
        }

        printAct()
        let response = `* ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)}`
        targetPlayer ? response += getAction(user, toUser.toLowerCase()) : response += getThirdPersonFlavorText()

        if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

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
        const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
        console.log(`Inventory:`, inventory)

        let usedItem = toUser.toLowerCase() || ``

        if (inventory.length === 0) {
            talk(channel, `${capsName} has no items! :(`)
            return
        }

        if (!usedItem) {
            talk(channel, `${capsName}'s items: ${inventory.join(', ')}`)
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
            talk(channel, `${capsName}, that isn't an item! :(`)
            return
        }

        let index = -1
        for (const [idx, item] of inventory.entries()) {
            if (item.toLowerCase() === usedItem) {
                index = idx
                break
            }
        }

        if (index < 0) {
            talk(channel, `${capsName}, you don't have that item! :(`)
            return
        }

        printItem()
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
        if (targetPlayer && targetPlayer.hp <= 10) { randNum = Math.ceil(Math.random() * 4) }
        if (targetPlayer && targetPlayer.hp <= 5) { randNum = Math.ceil(Math.random() * 2) }

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
                // If mercy is successful
            } else if (randNum === 1) {
                response += `YOU WON! ${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} was spared. ${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} earned 0 EXP and ${randGoldAmt} gold.`
                sendingPlayer.gold += randGoldAmt
                sendingPlayer.hp = getUserMaxHP(user)
                targetPlayer.hp = getUserMaxHP(toUser.toLowerCase())
            } else {
                response += `${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} tried to spare ${targetPlayer.displayName}. ${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)}`
                response += getThirdPersonFlavorText()
            }
        } else {
            response += `${sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)} tried to spare themself. But nothing happened.`
            talk(channel, response)
            return
        }

        printMercy()
        if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

        talk(channel, response)
        console.log(`${cyanBg} sender: ${sendingPlayer.displayName} (${sendingPlayer.hp} HP), target: ${toUser.toLowerCase() === `dummy` ? `DUMMY` : targetPlayer?.displayName || `none`}${targetPlayer ? ` (${targetPlayer.hp} HP)` : ``}, randNum: ${randNum} ${resetTxt}`)
        return
    }

    // HP
    if (command === `!hp`) {
        // Log message
        console.log(`${inverted}${channel} ${resetTxt}`, `${boldTxt}${sendingPlayer.dead ? redTxt : greenTxt}${sendingPlayer.displayName}:${resetTxt}`, msg)

        let response
        if (targetPlayer) {
            response = `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.hp} HP`
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
            response = `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.gold} G`
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
            response = `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has ${targetPlayer.exp} EXP`
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
            response = `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)}'s LV will increase with ${targetPlayer.next} more EXP`
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
            response = `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has the ${targetPlayer.weapon} equipped (${weaponsATK[targetPlayer.weapon]} ATK)`
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
            response = `${targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)} has the ${targetPlayer.armor} equipped (${armorDEF[targetPlayer.armor]} DEF)`
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
