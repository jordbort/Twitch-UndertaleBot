const { BOT_CHANNEL, settings, resetTxt, boldTxt, cyanBg } = require(`../config`)
const { players, playerSave, baseHP } = require(`../data`)

const fs = require(`fs/promises`)

const twitchUsernamePattern = /^[a-z0-9_]{4,25}$/i

function getToUser(str) {
    return str
        ? str.replace(/^[@#]/, ``)
        : null
}

function getUserMaxHP(user) {
    if (settings.debug) { console.log(`${boldTxt}> getUserMaxHP(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    const maxHP = userLV >= 20 ? 99 : baseHP + (4 * userLV)
    return maxHP
}

function getIntroText(props) {
    const { bot, channel, tags, player } = props
    if (settings.debug) { console.log(`${boldTxt}> getIntroText(channel: ${channel},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

    const { displayName, capsName } = player
    let response = `* `
    const introText = [
        `${capsName} and co. decided to pick on you!`,
        `${capsName} appeared.`,
        `${capsName} appeared.`,
        `${capsName} appeared.`,
        `${capsName} appears.`,
        `${capsName} appears.`,
        `${capsName} appears. Jerry came, too.`,
        `${capsName} approached meekly!`,
        `${capsName} assaults you!`,
        `${capsName} attacked!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} attacks!`,
        `${capsName} blocked the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way!`,
        `${capsName} blocks the way.`,
        `${capsName} bounds towards you!`,
        `${capsName} came out of the earth!`,
        `${capsName} clings to you!`,
        `${capsName} confronts you, sighing. Jerry.`,
        `${capsName} confronts you!`,
        `${capsName} crawled up close!`,
        `${capsName} crawled up close!`,
        `${capsName} decided to pick on you!`,
        `${capsName} drew near!`,
        `${capsName} drew near!`,
        `${capsName} drew near!`,
        `${capsName} drew near!`,
        `${capsName} drew near.`,
        `${capsName} emerges from the shadows.`,
        `${capsName} emerges from the shadows.`,
        `${capsName} flexes in!`,
        `${capsName} flutters forth!`,
        `${capsName} flutters forth!`,
        `${capsName} flutters in.`,
        `${capsName} gets in the way! Not on purpose or anything.`,
        `${capsName} hides in the corner but somehow encounters you anyway.`,
        `${capsName} hissed out of the earth!`,
        `${capsName} hopped close!`,
        `${capsName} hopped in...?`,
        `${capsName} hopped towards you.`,
        `${capsName} pops out of their hat!`,
        `${capsName} rushed in!`,
        `${capsName} saunters up!`,
        `${capsName} shuffles up.`,
        `${capsName} slithered out of the earth!`,
        `${capsName} strolls in.`,
        `${capsName} struts into view.`,
        `${capsName} swooped in!`,
        `${capsName} traps you!`,
        `${capsName} was already there, waiting for you.`,
        `Here comes ${displayName}.`,
        `Here comes ${displayName}. Same as usual.`,
        `It's ${displayName}.`,
        `It's ${displayName}.`,
        `Special enemy ${displayName} appears here to defeat you!!`,
        `You encountered ${displayName}.`,
        `You tripped over ${displayName}.`
    ]

    const randIntroText = Math.floor(Math.random() * introText.length)
    response += introText[randIntroText]
    bot.say(channel, response)
}

async function printMemory(channels) {
    await fs.writeFile(`./memory.json`, JSON.stringify({
        joined: [`#undertalebot`, ...channels],
        players,
        playerSave
    }, null, 4))
}

module.exports = {
    twitchUsernamePattern,
    getToUser,
    getUserMaxHP,
    getIntroText,
    initUser(props) {
        const { tags } = props
        if (settings.debug) { console.log(`${boldTxt}> initUser(username: ${tags.username},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // Intercept props to getIntroText
        props.channel = BOT_CHANNEL

        const username = tags.username
        const displayName = tags[`display-name`]

        players[username] = {
            id: Number(tags[`user-id`]),
            displayName: displayName,
            capsName: displayName.substring(0, 1).toUpperCase() + displayName.substring(1),
            lv: 1,
            highestLevel: 1,
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

        playerSave[username] = {
            id: Number(tags[`user-id`]),
            displayName: displayName,
            capsName: displayName.substring(0, 1).toUpperCase() + displayName.substring(1),
            lv: 1,
            highestLevel: 1,
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

        let firstTimer = true
        for (const oldUsername of Object.keys(players)) {
            if (players[username].id === players[oldUsername].id && oldUsername !== username) {
                firstTimer = false
                players[username] = {
                    ...players[oldUsername],
                    displayName: displayName,
                    capsName: displayName.substring(0, 1).toUpperCase() + displayName.substring(1)
                }
                playerSave[username] = {
                    ...playerSave[oldUsername],
                    displayName: displayName,
                    capsName: displayName.substring(0, 1).toUpperCase() + displayName.substring(1)
                }
                delete players[oldUsername]
            }
        }

        if (firstTimer) {
            props.player = players[username]
            getIntroText(props)
        }
    },
    getUsername(str) {
        return str
            ? str.replace(/^[@#]/, ``).match(twitchUsernamePattern)
                ? str.replace(/^[@#]/, ``)
                : null
            : null
    },
    stainedApronHeal(user, player) {
        if (settings.debug) { console.log(`${boldTxt}> stainedApronHeal(user: ${user})${resetTxt}`) }

        player.stainedApronHealTime = !player.stainedApronHealTime
        if (!player.stainedApronHealTime) {
            if (player.hp < getUserMaxHP(user)) {
                player.hp += 1
                console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: 1 ${resetTxt}`)
                return player.hp === getUserMaxHP(user) ? ` ${player.capsName}'s HP was maxed out.` : ` ${player.capsName} recovered 1 HP!`
            }
        }
        return ``
    },
    async shutdown(props) {
        if (settings.debug) { console.log(`${boldTxt}> shutdown(${props.bot.channels})${resetTxt}`) }
        await printMemory(props.bot.channels)
        if (settings.debug) { console.log(`${boldTxt}Done${resetTxt}`) }
        process.exit(0)
    },
    async announceCrash(bot) {
        if (settings.debug) { console.log(`${boldTxt}> announceCrash()${resetTxt}`) }

        await printMemory(bot.channels)

        bot.channels.forEach(channel => {
            bot.say(channel, `Oops, I just crashed! >(`)
        })
    }
}
