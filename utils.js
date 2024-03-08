const fs = require(`fs`)

const { joinedChannels, players, playerSave, highestLevels, baseHP, baseAT, baseDF, weaponsATK, armorDEF } = require(`./data`)

const { BOT_USERNAME, OAUTH_TOKEN, resetTxt, boldTxt, redTxt, greenTxt, yellowTxt, blueTxt, magentaTxt, cyanTxt, orangeTxt, blackBg, redBg, greenBg, yellowBg, blueBg, magentaBg, cyanBg, whiteBg, grayBg, orangeBg, settings } = require(`./config`)

const tmi = require('tmi.js')

const dateOptions = {
    weekday: `long`,
    month: `long`,
    day: `numeric`,
    year: `numeric`,
    timeZone: settings.timeZone
}

const timeOptions = {
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
    timeZone: settings.timeZone,
    timeZoneName: `short`
}

const start = new Date()
const startDate = start.toLocaleDateString(`en-US`, dateOptions)
const startTime = start.toLocaleTimeString(`en-US`, timeOptions)

// Helper functions
async function announceCrash() {
    if (settings.debug) { console.log(`${boldTxt}> announceCrash()${resetTxt}`) }
    return Object.keys(joinedChannels).forEach((user) => {
        joinedChannels[user].active && talk(`#${user}`, `Oops, I just crashed! >( If you would like me to rejoin your channel, please visit https://www.twitch.tv/undertalebot and use !join when I am online again!`)
    })
}

function calculateUserATK(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateUserATK(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let attack = baseAT + (2 * userLV)
    if (userLV >= 20) { attack = 38 }
    return attack
}

function calculateUserDEF(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateUserDEF(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let defense = Math.floor((userLV - 1) * baseDF)
    if (userLV >= 20) { defense = 4 }
    return defense
}

function calculateUserNextLV(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateUserNextLV(user: ${user})${resetTxt}`) }
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
    if (settings.debug) { console.log(`${boldTxt}> calculateUserLV(user: ${user}) Current level: ${players[user].lv}, Highest level: ${highestLevels[user]}${resetTxt}`) }
    const player = players[user]

    const collectedItems = []
    while (player.next <= 0) {
        player.lv += 1
        if (player.lv === 2 && highestLevels[user] < 2) { collectedItems.push(`Snowman Piece`, `Toy Knife`, `Faded Ribbon`) }
        if (player.lv === 3 && highestLevels[user] < 3) { collectedItems.push(`Astronaut Food`, `Ballet Shoes`, `Old Tutu`) }
        if (player.lv === 4 && highestLevels[user] < 4) { collectedItems.push(`Abandoned Quiche`, `Burnt Pan`, `Stained Apron`) }
        if (player.lv === 5 && highestLevels[user] < 5) { collectedItems.push(`Instant Noodles`) }
        if (player.lv === 6 && highestLevels[user] < 6) { collectedItems.push(`Hush Puppy`) }
        if (player.lv === 7 && highestLevels[user] < 7) { collectedItems.push(`Worn Dagger`, `Heart Locket`) }
        if (player.lv === 8 && highestLevels[user] < 8) { collectedItems.push(`Bad Memory`) }
        if (player.lv === 9 && highestLevels[user] < 9) { collectedItems.push(`Last Dream`) }
        if (player.lv === 10 && highestLevels[user] < 10) { collectedItems.push(`Real Knife`, `The Locket`) }
        if (player.lv === 11 && highestLevels[user] < 11) { collectedItems.push(`Puppydough Icecream`) }
        if (player.lv === 12 && highestLevels[user] < 12) { collectedItems.push(`Pumpkin Rings`) }
        if (player.lv === 13 && highestLevels[user] < 13) { collectedItems.push(`Croquet Roll`) }
        if (player.lv === 14 && highestLevels[user] < 14) { collectedItems.push(`Ghost Fruit`) }
        if (player.lv === 15 && highestLevels[user] < 15) { collectedItems.push(`Stoic Onion`) }
        if (player.lv === 16 && highestLevels[user] < 16) { collectedItems.push(`Rock Candy`) }

        if (player.lv > highestLevels[user]) { highestLevels[user] = player.lv }
        player.next += calculateUserNextLV(user)
        player.at = calculateUserATK(user)
        player.df = calculateUserDEF(user)
        player.hp += 4
        console.log(`${cyanBg} ${player.displayName} reached LV ${player.lv}, next: ${player.next}, ATK: ${player.at}, DEF: ${player.df}, HP: ${player.hp} / ${getUserMaxHP(user)} ${resetTxt}`)
    }

    let foundItemsAppend = ``
    if (collectedItems.length) {
        for (const item of collectedItems) { player.inventory.push(item) }
        foundItemsAppend = ` ${player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)} found: ` + collectedItems.join(`, `)
    }
    showStats(user)
    return foundItemsAppend
}

function calculateBisiclePrice(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateBisiclePrice(user: ${user})${resetTxt}`) }

    const lv = players[user].lv
    if (lv < 3) { return 15 }
    else if (lv < 4) { return 30 }
    else if (lv < 5) { return 45 }
    else { return 75 }
}

function calculateNiceCreamPrice(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateNiceCreamPrice(user: ${user})${resetTxt}`) }

    const lv = players[user].lv
    if (lv < 3) { return 15 }
    else if (lv < 4) { return 25 }
    else { return 12 }
}

function calculateTemmieArmorPrice(user) {
    if (settings.debug) { console.log(`${boldTxt}> calculateTemmieArmorPrice(user: ${user})${resetTxt}`) }

    const deaths = players[user].timesKilled
    const priceTable = {
        0: 9999,
        1: 9000,
        2: 8000,
        3: 7000,
        4: 6000,
        5: 5000,
        6: 4500,
        7: 4000,
        8: 3500,
        9: 3000,
        10: 2800,
        11: 2600,
        12: 2400,
        13: 2200,
        14: 2000,
        15: 1800,
        16: 1600,
        17: 1400,
        18: 1250,
        19: 1100
    }
    if (deaths >= 30) { return 500 }
    else if (deaths >= 25) { return 750 }
    else if (deaths >= 20) { return 1000 }
    else { return priceTable[deaths] }
}

function createClient(user, onMessageHandler) {
    if (settings.debug) { console.log(`${boldTxt}> createClient(user: ${user})${resetTxt}`) }

    const newClient = new tmi.client({
        identity: {
            username: BOT_USERNAME,
            password: OAUTH_TOKEN
        },
        channels: [`#${user}`]
    })

    joinedChannels[user] = {
        active: true,
        timesJoined: 1,
        timesParted: 0,
        client: newClient
    }
    const client = joinedChannels[user].client

    client.on(`message`, onMessageHandler)
    if (user === BOT_USERNAME) {
        client.on(`connected`, (addr, port) => {
            if (settings.firstConnection) {
                printLogo()
                console.log(`* Connected to ${addr}:${port} on ${settings.startTime}`)
                setTimeout(() => talk(`#${user}`, `* UndertaleBot blocks the way!`), 1000)
            } else {
                console.log(`* Reconnected to ${addr}:${port}`)
                talk(`#${user}`, `Reconnected!`)
            }
            settings.firstConnection = false
        })
    } else {
        client.on(`connected`, () => {
            if (joinedChannels[user].active) {
                console.log(`* Connected to ${user}'s channel.`)
                // setTimeout(() => talk(`#${user}`, `* UndertaleBot blocks the way!`), 1000)
            }
        })
    }
    client.connect()
}

function getChannels(bool) {
    const arr = []
    for (const channel in joinedChannels) {
        if (joinedChannels[channel].active === bool) {
            arr.push(channel)
        }
    }
    return arr.join(`, `)
}

function getIntroText(name) {
    if (settings.debug) { console.log(`${boldTxt}> getIntroText(name: ${name})${resetTxt}`) }
    const capsName = name.substring(0, 1).toUpperCase() + name.substring(1)
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
        `Here comes ${name}.`,
        `Here comes ${name}. Same as usual.`,
        `It's ${name}.`,
        `It's ${name}.`,
        `Special enemy ${name} appears here to defeat you!!`,
        `You encountered ${name}.`,
        `You tripped over ${name}.`
    ]
    const randIntroText = Math.floor(Math.random() * introText.length)
    response += introText[randIntroText]
    return response
}

function getSaveText(displayName) {
    if (settings.debug) { console.log(`${boldTxt}> getSaveText(displayName: ${displayName})${resetTxt}`) }
    const capsName = displayName.substring(0, 1).toUpperCase() + displayName.substring(1)
    const saveText = [
        `The shadow of the ruins looms above, filling ${displayName} with determination.`,
        `Playfully crinkling through the leaves fills ${displayName} with determination.`,
        `Knowing the mouse might one day leave its hole and get the cheese... It fills ${displayName} with determination.`,
        `Seeing such a cute, tidy house in the RUINS gives ${displayName} determination.`,
        `The cold atmosphere of a new land... it fills ${displayName} with determination.`,
        `The convenience of that lamp still fills ${displayName} with determination.`,
        `Knowing the mouse might one day find a way to heat up the spaghetti... It fills ${displayName} with determination.`,
        `Snow can always be broken down and rebuilt into something more useful. This simple fact fills ${displayName} with determination.`,
        `Knowing that dog will never give up trying to make the perfect snowdog... It fills ${displayName} with determination.`,
        `The sight of such a friendly town fills ${displayName} with determination.`,
        `The sound of rushing water fills ${displayName} with determination.`,
        `A feeling of dread hangs over ${displayName}... But ${displayName} stays determined.`,
        `Knowing the mouse might one day extract the cheese from the mystical crystal... It fills ${displayName} with determination.`,
        `The serene sound of a distant music box... It fills ${displayName} with determination.`,
        `The sound of muffled rain on the cavetop... It fills ${displayName} with determination.`,
        `The waterfall here seems to flow from the ceiling of the cavern... Occasionally, a piece of trash will flow through... and fall into the bottomless abyss below. Viewing this endless cycle of worthless garbage... It fills ${displayName} with determination.`,
        `Partaking in useless garbage fills ${displayName} with determination.`,
        `${capsName} feels a calming tranquility. ${capsName} is filled with determination.`,
        `${capsName} feels... something. ${capsName} is filled with detemmienation.`,
        `The wind is howling. ${capsName} is filled with determination.`,
        `The wind has stopped. ${capsName} is filled with determination.`,
        `The howling wind is now a breeze. This gives ${displayName} determination.`,
        `Seeing such a strange laboratory in a place like this... ${capsName} is filled with determination.`,
        `The wooshing sound of steam and cogs... it fills ${displayName} with determination.`,
        `An ominous structure looms in the distance... ${capsName} is filled with determination.`,
        `Knowing the mouse might one day hack into the computerized safe and get the cheese... It fills ${displayName} with determination.`,
        `The smell of cobwebs fills the air... ${capsName} is filled with determination.`,
        `The relaxing atmosphere of this hotel... it fills ${displayName} with determination.`,
        `The air is filled with the smell of ozone... it fills ${displayName} with determination.`,
        `Behind this door must be the elevator to the King's castle. ${capsName} is filled with determination.`
    ]
    const randSaveText = saveText[Math.floor(Math.random() * saveText.length)]
    return `* ${randSaveText}`
}

function getSpamtonQuote(num) {
    if (settings.debug) { console.log(`${boldTxt}> getSpamtonQuote(num: ${num})${resetTxt}`) }
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

function getUserMaxHP(user) {
    if (settings.debug) { console.log(`${boldTxt}> getUserMaxHP(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let maxHP = baseHP + (4 * userLV)
    if (userLV >= 20) { maxHP = 99 }
    return maxHP
}

function renderArr(arr, arrName, indentation = ``) {
    const tab = `${indentation}\t`
    const data = [`${arrName}: [`]
    if (arr.length) {
        const entry = arr.map((val) => {
            return typeof val === `string`
                ? `${tab}'${val}'`
                : typeof val === `object`
                    ? val === null
                        ? `${tab}null`
                        : Array.isArray(val)
                            ? `${tab}${renderArr(val, tab)}`
                            : `${tab}${renderObj(val, ``, tab)}`
                    : `${tab}${val}`
        }).join(`,\n`)
        data.push(entry)
        data.push(`${indentation}]`)
    } else { data[0] += `]` }
    return data.join(`\n`)
}

function renderObj(obj, objName, indentation = ``) {
    const tab = `${indentation}\t`
    const data = [`${objName}: {`]
    if (Object.keys(obj).length) {
        const keys = Object.keys(obj).map((key) => {
            return typeof obj[key] === `string`
                ? `${tab}${key}: '${obj[key]}'`
                : typeof obj[key] === `object` && ![`respawnTimer`, `client`].includes(key)
                    ? obj[key] === null
                        ? `${tab}${key}: null`
                        : Array.isArray(obj[key])
                            ? `${tab}${renderArr(obj[key], key, tab)}`
                            : `${tab}${renderObj(obj[key], key, tab)}`
                    : `${tab}${key}: ${obj[key]}`
        }).join(`,\n`)
        data.push(keys)
        data.push(`${indentation}}`)
    } else { data[0] += `}` }
    return data.join(`\n`)
}

function makeLogs() {
    let data = `+---------------+\n| UNDERTALE BOT |\n+---------------+\nSession started: ${startDate} at ${startTime}\n`

    const objectsToLog = [
        [settings, `settings`],
        [joinedChannels, `joinedChannels`],
        [players, `players`],
        [playerSave, 'playerSave'],
        [highestLevels, `highestLevels`]
    ]
    for (const [obj, objName] of objectsToLog) { data += `\n${renderObj(obj, objName)}\n` }

    fs.writeFile(`logs.txt`, data, (err) => {
        if (err) { console.log(`Error writing logs:`, err) }
    })
}

function printLogo() {
    if (settings.debug) { console.log(`${boldTxt}> printLogo()${resetTxt}`) }

    const whSq = `${whiteBg}  ${resetTxt}`
    const gySq = `${grayBg}  ${resetTxt}`
    const rdSq = `${redBg}  ${resetTxt}`
    const bkSq = `${blackBg}  ${resetTxt}`

    const ws = `${whiteBg} ${resetTxt}`
    const gs = `${grayBg} ${resetTxt}`
    const rs = `${redBg} ${resetTxt}`
    const bs = `${blackBg} ${resetTxt}`

    // Colored text
    console.log(`${boldTxt + orangeTxt}Bravery.${resetTxt} ${boldTxt + yellowTxt}Justice.${resetTxt} ${boldTxt + blueTxt}Integrity.${resetTxt} ${boldTxt + greenTxt}Kindness.${resetTxt} ${boldTxt + magentaTxt}Perseverance.${resetTxt} ${boldTxt + cyanTxt}Patience.${resetTxt}`)

    if (settings.landscapeView) {
        // UNDERTALE logo (full-size)
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
    } else {
        // UNDERTALE logo (shrunk)
        //          U (10 blocks wide)                                     N (10 blocks wide)                                     D (9 blocks wide)                                 E (8 blocks wide)                            R (10 blocks wide)                                     T (10 blocks wide)                                     A (9 blocks wide)                                 L (8 blocks wide)                            E (8 blocks wide)
        console.log(gs + ws + ws + ws + bs + bs + ws + ws + ws + ws + bs + ws + ws + ws + ws + bs + bs + ws + ws + ws + ws + bs + gs + ws + ws + ws + ws + ws + ws + ws + bs + bs + gs + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws + ws + gs + bs + gs + ws + ws + ws + ws + ws + ws + ws + ws + ws + bs + gs + ws + ws + ws + ws + ws + ws + ws + ws + bs + gs + ws + ws + ws + bs + bs + bs + bs + bs + gs + ws + ws + ws + ws + ws + ws + ws) // 1[1]
        console.log(ws + ws + ws + ws + bs + bs + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + bs + ws + ws + ws + bs + gs + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + ws + rs + ws + rs + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + bs + bs + bs + bs + bs + ws + ws + ws + ws + ws + bs + bs + bs) // 2[3]
        console.log(ws + ws + ws + ws + bs + gs + ws + ws + ws + ws + bs + ws + ws + gs + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + bs + bs + gs + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + gs + bs + ws + ws + ws + ws + ws + rs + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + gs + bs + bs + ws + ws + ws + bs + ws + ws + ws + ws + bs + bs + bs + bs + bs + ws + ws + ws + ws + ws + ws + ws + gs) // 3[5]
        console.log(ws + ws + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + bs + bs + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + bs + bs + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + ws + ws + ws + ws + gs + bs + bs + bs + bs + bs + bs + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + bs + bs + bs) // 4[7]
        console.log(ws + ws + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + bs + bs + bs + gs + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws + bs + bs + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + bs + bs + bs + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + ws + bs + bs + bs + bs + ws + ws + ws + bs + bs + gs + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws + bs + ws + ws + ws + ws + ws + ws + ws + ws) // 5[9]
        //          [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][ 0 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][spc][ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][8]}
    }

    // List of basic commands
    console.log(`${redBg} !fight ${resetTxt}`, `${boldTxt + redTxt}- Choose another chat member to attack${resetTxt}`)
    console.log(`${orangeBg} !act ${resetTxt}`, `${boldTxt + orangeTxt}  - Do an action by yourself or with another chat member${resetTxt}`)
    console.log(`${yellowBg} !item ${resetTxt}`, `${boldTxt + yellowTxt} - Check for (or use) items in your inventory${resetTxt}`)
    console.log(`${blueBg} !mercy ${resetTxt}`, `${boldTxt + blueTxt}- Choose another chat member to spare${resetTxt}`)
    console.log(`${greenBg} !buy ${resetTxt}`, `${boldTxt + greenTxt}  - Spend gold on items, or check what is possible to buy${resetTxt}`)
    console.log(`${magentaBg} !save ${resetTxt}`, `${boldTxt + magentaTxt} - Use determination to save your current state${resetTxt}`)
    console.log(`${cyanBg} !load ${resetTxt}`, `${boldTxt + cyanTxt} - Reload your previous save file${resetTxt}`)
}

const bufferSpaces = (len) => Array(len).fill(` `).join(``)
const fillNameGap = (colWidth, user) => { return colWidth > user.length ? bufferSpaces(colWidth - user.length) : `` }

function showPlayers(channel) {
    let columnGroups = settings.landscapeView ? 4 : 2
    if (Object.keys(players).length < columnGroups) { columnGroups = Object.keys(players).length }

    const usersColumnTitle = `username`
    const maxUsersColWidth = process.stdout.columns < 224 ? process.stdout.columns < 192 ? 7 : 15 : 23
    let usersColumnWidth = Math.max(...Object.keys(players).map((name) => name.length))
    if (usersColumnWidth < usersColumnTitle.length) { usersColumnWidth = usersColumnTitle.length }
    if (usersColumnWidth > maxUsersColWidth) { usersColumnWidth = maxUsersColWidth }

    const table = []
    table.push(Array(columnGroups).fill(`${usersColumnTitle}${bufferSpaces(usersColumnWidth - usersColumnTitle.length)}\t` + `lv\t` + `hp\t` + `at\t` + `df`).join(`\t`))
    table.push(Array(columnGroups).fill(`${Array(usersColumnTitle.length).fill(`-`).join(``)}${bufferSpaces(usersColumnWidth - usersColumnTitle.length)}\t` + `--\t` + `--\t` + `--\t` + `--`).join(`\t`))

    const allPlayers = []
    function makeFullRow(columnWidth, i, j) {
        const row = []
        const username = Object.keys(players)[i + j]
        if (username) {
            const player = players[username]
            const logColor = player.dead ? redBg : greenBg
            if (player.displayName.match(/^[a-zA-Z0-9_]{4,25}$/)) {
                allPlayers.push(player.displayName)
                row.push(`${logColor}${player.displayName.length > usersColumnWidth ? player.displayName.substring(0, usersColumnWidth) : player.displayName}${fillNameGap(usersColumnWidth, player.displayName)}${resetTxt}`)
            } else {
                allPlayers.push(username)
                row.push(`${logColor}${username === `dummy` ? `DUMMY` : username.length > usersColumnWidth ? username.substring(0, usersColumnWidth) : username}${fillNameGap(usersColumnWidth, username)}${resetTxt}`)
            }
            let attackBoost = 0
            if (player.armor === `Cowboy Hat`) { attackBoost = 5 }
            if (player.armor === `Temmie Armor`) { attackBoost = 10 }
            row.push(player.lv, `${player.hp}/${getUserMaxHP(username)}`, `${player.at}(${weaponsATK[player.weapon] + attackBoost})`, `${player.df}(${armorDEF[player.armor] + attackBoost})`)
        }
        return row.join(`\t`)
    }

    for (const [i] of Object.keys(players).entries()) {
        if (i % columnGroups === 0) {
            const fullRow = []
            for (let j = 0; j < columnGroups; j++) { fullRow.push(makeFullRow(usersColumnWidth, i, j)) }
            table.push(fullRow.join(`\t`))
        }
    }

    table.forEach((row) => console.log(row))
    talk(channel, `Players: ${allPlayers.join(`, `)}`)
}

const fillShortEntry = (colWidth, title) => { return colWidth < title.length ? bufferSpaces(title.length - colWidth) : `` }

function showStats(user) {
    const player = players[user]
    const logColor = player.dead ? redBg : greenBg

    const userColumnTitle = `username`
    const userEntry = user === `dummy` ? `DUMMY` : player.displayName.match(/^[a-zA-Z0-9_]{4,25}$/) ? player.displayName : user
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

function stainedApronHeal(user) {
    if (settings.debug) { console.log(`${boldTxt}> stainedApronHeal(user: ${user})${resetTxt}`) }
    const sendingPlayer = players[user]
    const capsName = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    sendingPlayer.stainedApronHealTime = !sendingPlayer.stainedApronHealTime
    if (!sendingPlayer.stainedApronHealTime) {
        if (sendingPlayer.hp < getUserMaxHP(user)) {
            sendingPlayer.hp += 1
            console.log(`${cyanBg} ${sendingPlayer.displayName} HP: ${sendingPlayer.hp}/${getUserMaxHP(user)}, healAmt: 1 ${resetTxt}`)
            return sendingPlayer.hp === getUserMaxHP(user) ? ` ${capsName}'s HP was maxed out.` : ` ${capsName} recovered 1 HP!`
        }
    }
    return ``
}

function talk(chatroom, resp) {
    // if (settings.debug) { console.log(`${boldTxt}> talk(chatroom: ${chatroom}, resp: '${resp.substring(0, 8)}...')${resetTxt}`) }
    if (!chatroom.startsWith(`#`)) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'chatroom' data being sent (doesn't start with '#')!${resetTxt}`) }
    const channel = joinedChannels[chatroom.substring(1)]
    if (channel.active) {
        channel.client.say(chatroom, resp)
        console.log(`${yellowBg}${chatroom} ${resetTxt}`, `${boldTxt}${yellowTxt}UndertaleBot:${resetTxt}`, `${yellowTxt}${resp}${resetTxt}`)
    }
}

module.exports = {
    announceCrash,
    calculateUserATK,
    calculateUserDEF,
    calculateUserNextLV,
    calculateUserLV,
    calculateBisiclePrice,
    calculateNiceCreamPrice,
    calculateTemmieArmorPrice,
    createClient,
    getChannels,
    getIntroText,
    getSaveText,
    getSpamtonQuote,
    getUserMaxHP,
    makeLogs,
    printLogo,
    showPlayers,
    showStats,
    stainedApronHeal,
    talk
}
