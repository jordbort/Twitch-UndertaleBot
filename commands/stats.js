const { twitchUsernamePattern, getUserMaxHP, initProps } = require(`./utils`)
const { settings, resetTxt, boldTxt, redBg, greenBg } = require(`../config`)
const { players, weaponsATK, armorDEF } = require(`../data`)

const bufferSpaces = (len) => Array(len).fill(` `).join(``)
const fillNameGap = (colWidth, user) => { return colWidth > user.length ? bufferSpaces(colWidth - user.length) : `` }
const fillShortEntry = (colWidth, title) => { return colWidth < title.length ? bufferSpaces(title.length - colWidth) : `` }

function showStats(user) {
    if (settings.debug) { console.log(`${boldTxt}> showStats(user: ${user})${resetTxt}`) }

    const player = players[user]
    const logColor = player.dead ? redBg : greenBg

    const userColumnTitle = `username`
    const userEntry = user === `dummy` ? `DUMMY` : player.displayName.match(twitchUsernamePattern) ? player.displayName : user
    const userColumnWidth = userEntry.length
    const weaponColumnTitle = `weapon`
    const weaponColumnWidth = player.weapon.length
    const armorColumnTitle = `armor`
    const armorColumnWidth = player.armor.length

    const table = []
    table.push([
        `${userColumnTitle}${fillNameGap(userColumnWidth, userColumnTitle)}`,
        `lv`,
        `hp`,
        `at`,
        `df`,
        `exp`,
        `next`,
        `${weaponColumnTitle}${fillNameGap(weaponColumnWidth, weaponColumnTitle)}`,
        `${armorColumnTitle}${fillNameGap(armorColumnWidth, armorColumnTitle)}`,
        `gold`
    ].join(`\t`))
    table.push([
        `${Array(userColumnTitle.length).fill(`-`).join(``)}${fillNameGap(userColumnWidth, userColumnTitle)}`,
        `--`,
        `--`,
        `--`,
        `--`,
        `---`,
        `----`,
        `${Array(weaponColumnTitle.length).fill(`-`).join(``)}${fillNameGap(weaponColumnWidth, weaponColumnTitle)}`,
        `${Array(armorColumnTitle.length).fill(`-`).join(``)}${fillNameGap(armorColumnWidth, armorColumnTitle)}`,
        `----`
    ].join(`\t`))

    let attackBoost = 0
    if (player.armor === `Cowboy Hat`) { attackBoost = 5 }
    if (player.armor === `Temmie Armor`) { attackBoost = 10 }
    table.push([
        `${logColor}${userEntry}${fillShortEntry(userColumnWidth, userColumnTitle)}${resetTxt}`,
        player.lv,
        `${player.hp}/${getUserMaxHP(user)}`,
        `${player.at}(${weaponsATK[player.weapon] + attackBoost})`,
        `${player.df}(${armorDEF[player.armor] + attackBoost})`,
        player.exp,
        player.next,
        `${player.weapon}${fillShortEntry(weaponColumnWidth, weaponColumnTitle)}`,
        `${player.armor}${fillShortEntry(armorColumnWidth, armorColumnTitle)}`,
        player.gold
    ].join(`\t`))

    table.forEach((row) => console.log(row))
    console.log(`Inventory:`, player.inventory)
}

function makeFullRow(columnWidth, i, j) {
    const row = []
    const username = Object.keys(players)[i + j]
    if (username) {
        const player = players[username]
        const logColor = player.dead ? redBg : greenBg
        if (player.displayName.match(twitchUsernamePattern)) {
            row.push(`${logColor}${player.displayName.length > columnWidth ? player.displayName.substring(0, columnWidth) : player.displayName}${fillNameGap(columnWidth, player.displayName)}${resetTxt}`)
        } else {
            row.push(`${logColor}${username === `dummy` ? `DUMMY` : username.length > columnWidth ? username.substring(0, columnWidth) : username}${fillNameGap(columnWidth, username)}${resetTxt}`)
        }
        let attackBoost = 0
        if (player.armor === `Cowboy Hat`) { attackBoost = 5 }
        if (player.armor === `Temmie Armor`) { attackBoost = 10 }
        row.push(player.lv, `${player.hp}/${getUserMaxHP(username)}`, `${player.at}(${weaponsATK[player.weapon] + attackBoost})`, `${player.df}(${armorDEF[player.armor] + attackBoost})`)
    }
    return row.join(`\t`)
}

module.exports = {
    showStats,
    getHP(props) {
        const { bot, channel, toUser, player, capsPlayer, target, capsTarget } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> getHP(player.displayName: ${player.displayName}, toUser: ${toUser})${resetTxt}`) }

        if (target) { bot.say(channel, `${capsTarget} has ${target.hp} HP`) }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else { bot.say(channel, `${capsPlayer} has ${player.hp} HP`) }
    },
    getGold(props) {
        const { bot, channel, toUser, player, capsPlayer, target, capsTarget } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> getGold(player.displayName: ${player.displayName}, toUser: ${toUser})${resetTxt}`) }

        if (target) { bot.say(channel, `${capsTarget} has ${target.gold} G`) }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else { bot.say(channel, `${capsPlayer} has ${player.gold} G`) }
    },
    getNext(props) {
        const { bot, channel, toUser, player, capsPlayer, target, capsTarget } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> getNext(player.displayName: ${player.displayName}, toUser: ${toUser})${resetTxt}`) }

        if (target) { bot.say(channel, `${capsTarget}'s LV will increase with ${target.next} EXP`) }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else { bot.say(channel, `${capsPlayer}'s LV will increase with ${player.next} EXP`) }
    },
    getWeapon(props) {
        const { bot, channel, toUser, player, capsPlayer, target, capsTarget } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> getWeapon(player.displayName: ${player.displayName}, toUser: ${toUser})${resetTxt}`) }

        if (target) { bot.say(channel, `${capsTarget} has the ${target.weapon} equipped (${weaponsATK[target.weapon]} ATK)`) }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else { bot.say(channel, `${capsPlayer} has the ${player.weapon} equipped (${weaponsATK[player.weapon]} ATK)`) }
    },
    getArmor(props) {
        const { bot, channel, toUser, player, capsPlayer, target, capsTarget } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> getArmor(player.displayName: ${player.displayName}, toUser: ${toUser})${resetTxt}`) }

        if (target) { bot.say(channel, `${capsTarget} has the ${target.armor} equipped (${armorDEF[target.armor]} DEF)`) }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else { bot.say(channel, `${capsPlayer} has the ${player.armor} equipped (${armorDEF[player.armor]} DEF)`) }
    },
    getExp(props) {
        const { bot, channel, toUser, player, capsPlayer, target, capsTarget } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> getExp(player.displayName: ${player.displayName}, toUser: ${toUser})${resetTxt}`) }

        if (target) { bot.say(channel, `${capsTarget} has ${target.exp} EXP`) }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else { bot.say(channel, `${capsPlayer} has ${player.exp} EXP`) }
    },
    handleCheck(props) {
        const { bot, channel, user, toUser, player, target } = initProps(props)
        if (settings.debug) { console.log(`${boldTxt}> handleCheck(user: ${user}, toUser: ${toUser})${resetTxt}`) }

        const attackBonus = player.armor === `Cowboy Hat` ? 5 : player.armor === `Temmie Armor` ? 10 : 0

        if (target) {
            showStats(toUser)
            bot.say(channel, `"${user === `dummy` ? `DUMMY` : target.displayName}" LV: ${target.lv}, HP: ${target.hp}/${getUserMaxHP(toUser)}, AT: ${target.at}(${weaponsATK[target.weapon] + attackBonus}), DF: ${target.df}(${armorDEF[target.armor]}), EXP: ${target.exp}, NEXT: ${target.next}, WEAPON: ${target.weapon}, ARMOR: ${target.armor}, GOLD: ${target.gold}`)
        }
        else if (toUser) { bot.say(channel, `"${toUser}" isn't a known player!`) }
        else {
            showStats(user)
            bot.say(channel, `"${user === `dummy` ? `DUMMY` : player.displayName}" LV: ${player.lv}, HP: ${player.hp}/${getUserMaxHP(user)}, AT: ${player.at}(${weaponsATK[player.weapon] + attackBonus}), DF: ${player.df}(${armorDEF[player.armor]}), EXP: ${player.exp}, NEXT: ${player.next}, WEAPON: ${player.weapon}, ARMOR: ${player.armor}, GOLD: ${player.gold}`)
        }
    },
    showPlayers(props) {
        const { bot, channel } = props
        if (settings.debug) { console.log(`${boldTxt}> showPlayers(bot: ${typeof bot}, channel: ${channel})${resetTxt}`) }

        let columnGroups = settings.landscapeView ? 4 : 2
        const numPlayers = Object.keys(players).length
        if (numPlayers < columnGroups) { columnGroups = numPlayers }

        const usersColumnTitle = `username`
        const maxUsersColWidth = process.stdout.columns < 192 ? 15 : 23
        let usersColumnWidth = Math.max(...Object.keys(players).map((name) => name.length))
        if (usersColumnWidth < usersColumnTitle.length) { usersColumnWidth = usersColumnTitle.length }
        if (usersColumnWidth > maxUsersColWidth) { usersColumnWidth = maxUsersColWidth }

        const table = [
            Array(columnGroups).fill(`${usersColumnTitle}${bufferSpaces(usersColumnWidth - usersColumnTitle.length)}\t` + `lv\t` + `hp\t` + `at\t` + `df`).join(`\t`),
            Array(columnGroups).fill(`${Array(usersColumnTitle.length).fill(`-`).join(``)}${bufferSpaces(usersColumnWidth - usersColumnTitle.length)}\t` + `--\t` + `--\t` + `--\t` + `--`).join(`\t`)
        ]

        for (let i = 0; i < numPlayers; i++) {
            if (i % columnGroups === 0) {
                const fullRow = []
                for (let j = 0; j < columnGroups; j++) { fullRow.push(makeFullRow(usersColumnWidth, i, j)) }
                table.push(fullRow.join(`\t`))
            }
        }

        table.forEach((row) => console.log(row))

        // Not counting the Dummy
        bot.say(channel, `${numPlayers - 1} human${numPlayers - 1 === 1 ? `` : `s`} ha${numPlayers - 1 === 1 ? `s` : `ve`} fallen into the Underground. Use !check to inspect yourself or another user!`)
    }
}
