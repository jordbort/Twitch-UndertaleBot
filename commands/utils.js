const { BOT_CHANNEL, settings, resetTxt, boldTxt, cyanBg } = require(`../config`)
const { players, playerSave, highestLevels, baseHP } = require(`../data`)

const twitchUsernamePattern = /^[a-z0-9_]{4,25}$/i

function getToUser(str) {
    return str
        ? str.replace(/^[@#]/, ``)
        : null
}

function getUserMaxHP(user) {
    if (settings.debug) { console.log(`${boldTxt}> getUserMaxHP(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let maxHP = baseHP + (4 * userLV)
    if (userLV >= 20) { maxHP = 99 }
    return maxHP
}

function getIntroText(props) {
    const { bot, channel, tags } = props
    if (settings.debug) { console.log(`${boldTxt}> getIntroText(bot: ${typeof bot}, channel: ${channel},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

    const displayName = tags[`display-name`]
    const capsName = displayName.substring(0, 1).toUpperCase() + displayName.substring(1)
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

module.exports = {
    twitchUsernamePattern,
    getUserMaxHP,
    getIntroText,
    initProps(props) {
        const { tags, args } = props
        const user = tags.username
        const toUser = getToUser(args[0])
        const player = players[user]
        const capsPlayer = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)
        const target = toUser in players ? players[toUser] : null
        const capsTarget = target ? target.displayName.substring(0, 1).toUpperCase() + target.displayName.substring(1) : null
        const lastStanding = Object.keys(players).filter((player) => { return !players[player].dead }).length === 1
        return { ...props, user: user, toUser: toUser, player: player, capsPlayer: capsPlayer, target: target, capsTarget: capsTarget, lastStanding: lastStanding }
    },
    initUser(props) {
        const { tags } = props
        if (settings.debug) { console.log(`${boldTxt}> initUser(username: ${tags.username},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`})${resetTxt}`) }

        // Intercept props to getIntroText
        props.channel = BOT_CHANNEL

        const username = tags.username
        const displayName = tags[`display-name`]

        players[username] = {
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
        playerSave[username] = {
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
        highestLevels[username] = 1
        getIntroText(props)
    },
    getUsername(str) {
        return str
            ? str.replace(/^[@#]/, ``).match(twitchUsernamePattern)
                ? str.replace(/^[@#]/, ``)
                : null
            : null
    },
    async announceCrash(bot) {
        if (settings.debug) { console.log(`${boldTxt}> announceCrash(bot: ${typeof bot})${resetTxt}`) }

        return bot.channels.forEach((channel) => {
            bot.say(channel, `Oops, I just crashed! >( If you would like me to rejoin your channel, please visit https://www.twitch.tv/undertalebot and use !join when I am online again!`)
        })
    },
    stainedApronHeal(user, player, capsPlayer) {
        if (settings.debug) { console.log(`${boldTxt}> stainedApronHeal(user: ${user})${resetTxt}`) }

        player.stainedApronHealTime = !player.stainedApronHealTime
        if (!player.stainedApronHealTime) {
            if (player.hp < getUserMaxHP(user)) {
                player.hp += 1
                console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: 1 ${resetTxt}`)
                return player.hp === getUserMaxHP(user) ? ` ${capsPlayer}'s HP was maxed out.` : ` ${capsPlayer} recovered 1 HP!`
            }
        }
        return ``
    }
}
