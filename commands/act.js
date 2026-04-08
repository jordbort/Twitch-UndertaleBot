const { BOT_USERNAME, settings, resetTxt, boldTxt, cyanBg, } = require(`../config`)
const { getUserMaxHP, stainedApronHeal } = require(`./utils`)
const { printAct } = require(`./graphics`)
const { showStats } = require(`./stats`)

function getAction(user, toUser, player, target) {
    if (settings.debug) { console.log(`${boldTxt}> getAction(user: ${user}, toUser: ${toUser})${resetTxt}`) }

    const randGold = Math.ceil(Math.random() * 10) * 5
    const actions = [
        ` and the others celebrate ${target.displayName}'s disappearance.`,
        ` and the others ditch ${target.displayName} when they look away!`,
        ` asks ${target.displayName} about their day.`,
        ` asks ${target.displayName} about their day. There's no response.`,
        ` asks ${target.displayName} to clean them. ${target.capsName} hops around excitedly.`,
        ` attempts to touch ${target.displayName}'s armor. Their hands slip off.`,
        ` boos ${target.displayName}.`,
        ` boos loudly. ${target.capsName} leaves to look elsewhere for praise.`,
        ` boos... but haters only make ${target.displayName} stronger. ${target.capsName} ATTACK UP+DEFENSE DOWN.`,
        ` calls ${target.displayName}. ${target.capsName} bounds toward them, flecking slobber into ${player.displayName}'s face.`,
        ` claps like a gorilla. ${target.capsName} is becoming addicted to their praise.`,
        ` claps really sloppily. ${target.capsName} sucks up their praise like a vacuum cleaner.`,
        ` cleans ${target.displayName}'s armor. Its cooling dirt begins to wash away.`,
        ` compliments ${target.displayName}. They understood them perfectly. ${target.capsName}'s ATTACK dropped.`,
        ` cranks up the thermostat. ${target.capsName} begins to get excited.`,
        ` cranks up the thermostat. It's super hot! ${target.capsName} looks satisfied.`,
        ` did something mysterious. ${target.capsName} recognizes they have more to learn from this world.`,
        ` does nothing. ${target.capsName} leaves to look elsewhere for praise.`,
        ` does nothing. ${target.capsName} looks desperate for attention.`,
        ` does nothing. ${target.capsName} looks disappointed they aren't paying attention.`,
        ` doesn't hug ${target.displayName}. They appreciate their respect of their boundaries.`,
        ` doesn't pick on ${target.displayName}.`,
        ` flexes. ${target.capsName} flexes twice as hard. ATTACK increases for both of them.`,
        ` flexes. ${target.capsName} flexes very hard... They flex themself out of the room!`,
        ` gave ${target.displayName} a patient smile.`,
        ` gets close to ${target.displayName}. But not too close.`,
        ` gives ${target.displayName} a cruel look.`,
        ` gives ${target.displayName} a friendly pat.`,
        ` hugs ${target.displayName}. Gross slime covers them. ${player.capsName}'s SPEED decreased.`,
        ` ignores ${target.displayName} and thinks of pollen and sunshine. ${player.capsName}'s DEFENSE increased by 1.`,
        ` informs ${target.displayName} that they have a great hat!`,
        ` invites ${target.displayName} to hang out.`,
        ` kneels and prays for safety. ${target.capsName} remembers their conscience.`,
        ` laughs at ${target.displayName} before they say anything funny.`,
        ` lies down. ${target.capsName} lies down too. ${target.capsName} understands life now.`,
        ` lies immobile with ${target.displayName}. They feel like they understand the world a little better.`,
        ` makes fun of ${target.displayName}.`,
        ` manages to tear their eyes away from ${target.displayName}'s hat. They look annoyed...`,
        ` pats ${target.displayName}'s chest like a muscular bongo.`,
        ` pats their stomach. ${target.capsName} offers a healthy meal.`,
        ` pays ${randGold} G. ${target.capsName} reduces their ATTACK for this turn!`,
        ` pets ${target.displayName}. Their excitement knows no bounds.`,
        ` pets the ${target.displayName}. They start to generate a Stage I Happiness Froth.`,
        ` picks on ${target.displayName}.`,
        ` presses the yellow button. The phone is resonating with ${target.displayName}'s presence!`,
        ` raises their arms and wiggles their fingers. ${target.capsName} freaks out!`,
        ` reaches out. ${target.capsName} recoils from their touch.`,
        ` says hello to ${target.displayName}.`,
        ` sings an old lullaby. ${target.capsName} starts to look sleepy...`,
        ` stands up to ${target.displayName}.`,
        ` talks to ${target.displayName}. ...They don't seem much for conversation. No one is happy with this.`,
        ` talks to ${target.displayName}... They don't seem much for conversation. JPEGSTRIPES seems happy with ${player.displayName}.`,
        ` tells ${target.displayName} that no one will ever love them the way they are... They struggle to make a retort, and slink away utterly crushed...`,
        ` tells ${target.displayName} that their attacks are NOT helpful.`,
        ` tells ${target.displayName} that their rump looks like a sack of trash.`,
        ` tells ${target.displayName} that there's a mirror behind them.`,
        ` tells ${target.displayName} that they aren't funny.`,
        ` tells ${target.displayName} their attacks are too easy. The bullets get faster.`,
        ` tells ${target.displayName} their attacks are too easy. The bullets get unfair.`,
        ` tells ${target.displayName} their attacks are too easy. They don't care.`,
        ` tells ${target.displayName} their favorite secret.`,
        ` tells ${target.displayName} they have a powerful rudder.`,
        ` tells ${target.displayName} they have an impressive wingspan.`,
        ` tells ${target.displayName} they have cute winglets.`,
        ` tells ${target.displayName} they have nice turbines.`,
        ` tells ${target.displayName} they like their taste in movies and books.`,
        ` tells ${target.displayName} they're all wrong.`,
        ` tells ${target.displayName} they're doing a great job. Their attacks become extreme...`,
        ` tells ${target.displayName} to be honest with their feelings.`,
        ` tells ${target.displayName} to go away.`,
        ` threatens ${target.displayName}. They understood them perfectly. ${target.capsName}'s DEFENSE dropped.`,
        ` threw the stick and ${target.displayName} ran to get it. They played fetch for a while.`,
        ` throws the stick. ${target.capsName} brings it back in their mouth.`,
        ` told ${target.displayName} a little joke.`,
        ` told ${target.displayName} they didn't want to fight. But nothing happened.`,
        ` told ${target.displayName} they just want to be friends. They remember someone... ${target.capsName}'s attacks became a little less extreme.`,
        ` took a bite out of ${target.displayName}. ${player.capsName} recovered 5 HP!`,
        ` tried to eat ${target.displayName}, but they weren't weakened enough.`,
        ` tries to console ${target.displayName}...`,
        ` wiggles their hips. ${target.capsName} wiggles back. What a meaningful conversation!`
    ]

    const randAction = Math.floor(Math.random() * actions.length)

    // If player paid the target gold
    if (randAction === 40) {
        const differenceInGold = player.gold - randGold
        console.log(`randGold: ${randGold}, senderGold: ${player.gold}, differenceInGold: ${differenceInGold}`)
        if (player.gold <= 0) {
            return ` is out of money. ${target.capsName} shakes their head.`
        } else if (differenceInGold < 0) {
            target.gold += player.gold
            player.gold = 0
            return ` empties their pockets. ${target.capsName} lowers the price.`
        } else {
            player.gold -= randGold
            target.gold += randGold
        }
        showStats(user)
        showStats(toUser)
    }

    // If player took a bite out of the target and recovered 5 HP
    if (randAction === 76) {
        player.hp += 5
        if (player.hp >= getUserMaxHP(user)) {
            player.hp = getUserMaxHP(user)
            actions[randAction] = ` took a bite out of ${target.displayName}. ${player.capsName}'s HP was maxed out.`
        }
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${getUserMaxHP(user)}, healAmt: 5 ${resetTxt}`)
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

function handleAct(user, toUser, player, target) {
    if (settings.debug) { console.log(`${boldTxt}> handleAct(user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printAct()

    let response = `* ${player.capsName}`
    target && target !== player
        ? response += getAction(user, toUser, player, target)
        : response += getThirdPersonFlavorText()

    if (player.armor === `Stained Apron`) { response += stainedApronHeal(user, player) }

    return response
}

module.exports = {
    getThirdPersonFlavorText,
    attemptAct(props) {
        const { bot, channel, user, player, toUser, target, lastStanding } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptAct( user: ${user}, toUser: ${toUser}, lastStanding:`, lastStanding, `)${resetTxt}`) }

        if (player.dead) {
            bot.say(channel, `Sorry ${player.displayName}, you are dead! :(`)
            return
        }

        if (toUser) {
            if (lastStanding) {
                bot.say(channel, `* But nobody came.`)
                return
            }
            if (toUser === BOT_USERNAME) {
                bot.say(channel, `You can't ACT with me, but you can try ACTing the Dummy!`)
                return
            }
            if (!target) {
                bot.say(channel, `${toUser} is not a known player!`)
                return
            }
            if (target.dead) {
                bot.say(channel, `Sorry ${player.displayName}, ${target.displayName} is dead!`)
                return
            }
        }

        const response = handleAct(user, toUser, player, target)
        bot.say(channel, response)
    }
}
