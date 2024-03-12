const { BOT_USERNAME, settings, resetTxt, boldTxt, cyanBg, } = require(`../config`)
const { players } = require(`../data`)
const { getUserMaxHP, getToUser, stainedApronHeal } = require(`./utils`)
const { printAct } = require(`./graphics`)
const { showStats } = require(`./stats`)

function getAction(user, target) {
    if (settings.debug) { console.log(`${boldTxt}> getAction(user: ${user}, target: ${target})${resetTxt}`) }
    const sendingPlayer = players[user]
    const targetPlayer = players[target]
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
        ` cranks up the thermostat. It's super hot! ${capsTarget} looks satisfied.`,
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
        ` took a bite out of ${targetPlayer.displayName}. ${capsSender} recovered 5 HP!`,
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
        showStats(user)
    }

    // If user took a bite out of the target and recovered 5 HP
    if (randAction === 76) {
        sendingPlayer.hp += 5
        if (sendingPlayer.hp >= getUserMaxHP(user)) {
            sendingPlayer.hp = getUserMaxHP(user)
            actions[randAction] = ` took a bite out of ${targetPlayer.displayName}. ${capsSender}'s HP was maxed out.`
        }
        console.log(`${cyanBg} ${sendingPlayer.displayName} HP: ${sendingPlayer.hp}/${getUserMaxHP(user)}, healAmt: 5 ${resetTxt}`)
        showStats(user)
    }

    return actions[randAction]
}

function getThirdPersonFlavorText() {
    if (settings.debug) { console.log(`${boldTxt}> getThirdPersonFlavorText()${resetTxt}`) }
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

function handleAct(user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleAct(user: ${user}, toUser: ${toUser})${resetTxt}`) }
    const targetPlayer = toUser !== user && toUser in players ? players[toUser] : null
    printAct()
    let response = `* ${players[user].displayName.substring(0, 1).toUpperCase() + players[user].displayName.substring(1)}`
    targetPlayer ? response += getAction(user, toUser) : response += getThirdPersonFlavorText()

    if (players[user].armor === `Stained Apron`) { response += stainedApronHeal(user) }

    return response
}

module.exports = {
    getThirdPersonFlavorText,
    attemptAct(props) {
        const { bot, channel, tags, args } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptAct(channel: ${channel},`, Object.keys(tags).length, `tag${Object.keys(tags).length === 1 ? `` : `s`}, args:`, args, `)${resetTxt}`) }

        const user = tags.username
        const toUser = getToUser(args[0])
        const player = players[user]
        const target = toUser in players ? players[toUser] : null
        const lastStanding = Object.keys(players).filter((player) => { return !players[player].dead }).length === 1

        if (player.dead) { return bot.say(channel, `Sorry ${player.displayName}, you are dead! :(`) }

        if (toUser) {
            if (lastStanding) { return bot.say(channel, `* But nobody came.`) }
            if (target) {
                if (target.dead) { return bot.say(channel, `Sorry ${player.displayName}, ${target.displayName} is dead! :(`) }
            }
            else if (toUser === BOT_USERNAME) { return bot.say(channel, `You can't ACT with me, but you can try ACTing the Dummy!`) }
            else { return bot.say(channel, `${toUser} is not a registered player :(`) }
        }
        const response = handleAct(user, toUser)
        bot.say(channel, response)
    }
}
