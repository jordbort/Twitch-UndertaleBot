const BOT_USERNAME = process.env.BOT_USERNAME
const DEV = process.env.DEV
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const CHANNEL_1 = process.env.CHANNEL_1
const CHANNEL_2 = process.env.CHANNEL_2
const CHANNEL_3 = process.env.CHANNEL_3
const CHANNEL_4 = process.env.CHANNEL_4
const CHANNEL_5 = process.env.CHANNEL_5
const CHANNEL_6 = process.env.CHANNEL_6
const CHANNEL_7 = process.env.CHANNEL_7
const CHANNEL_8 = process.env.CHANNEL_8
const CHANNEL_9 = process.env.CHANNEL_9

const squad = [
    CHANNEL_2,
    CHANNEL_3,
    CHANNEL_4,
    CHANNEL_5,
    CHANNEL_6,
    CHANNEL_7,
    CHANNEL_8,
    CHANNEL_9
]

const {
    globalUsers,
    players,
    playerSave,
    highestLevels,
    baseHP,
    baseAT,
    baseDF,
    weaponsATK,
    armorDEF,
    itemLvThreshold,
    consumableItems
} = require(`./data`)

const {
    resetTxt,
    boldTxt,
    underlined,
    inverted,
    blackTxt,
    redTxt,
    greenTxt,
    yellowTxt,
    blueTxt,
    magentaTxt,
    cyanTxt,
    whiteTxt,
    grayTxt,
    orangeTxt,
    blackBg,
    redBg,
    greenBg,
    yellowBg,
    blueBg,
    magentaBg,
    cyanBg,
    whiteBg,
    grayBg,
    orangeBg,
    settings
} = require(`./config`)

const tmi = require('tmi.js')

// Define configuration options
const opts = {
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [CHANNEL_1]
}

// Create a client with our options
const client = new tmi.client(opts)

// Helper functions
function talk(chatroom, resp) {
    // if (settings.debug) { console.log(`${boldTxt}> talk(chatroom: ${chatroom}, resp: '${resp.substring(0, 8)}...')${resetTxt}`) }
    if (!chatroom.startsWith(`#`)) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'chatroom' data being sent (doesn't start with '#')!${resetTxt}`) }
    client.say(chatroom, resp)
    console.log(`${yellowBg}${chatroom} ${resetTxt}`, `${boldTxt}${yellowTxt}UndertaleBot:${resetTxt}`, `${yellowTxt}${resp}${resetTxt}`)
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

function getSaveText(displayName) {
    if (settings.debug) { console.log(`${boldTxt}> getSaveText(displayName: ${displayName})${resetTxt}`) }
    const capsName = displayName.substring(0, 1).toUpperCase() + displayName.substring(1)
    const saveText = [
        `The shadow of the ruins looms above, filling ${displayName} with determination.`,
        `Playfully crinkling through the leaves fills ${displayName} with determination.`,
        `Knowing the mouse might one day leave its hole and get the cheese... It fills ${displayName} with determination.`,
        `Seeing such a cute, tidy house in the RUINS gives ${displayName} determination.`,
        `The cold atmosphere of a new land... it fills ${displayName} with determination.`,
        `The convenience of that lamp still fill    s ${displayName} with determination.`,
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
    }

    // If user took a bite out of the target and recovered 5 HP
    if (randAction === 76) {
        sendingPlayer.hp += 5
        if (sendingPlayer.hp >= getUserMaxHP(user)) {
            sendingPlayer.hp = getUserMaxHP(user)
            actions[randAction] = ` took a bite out of ${targetPlayer.displayName}. ${capsSender}'s HP was maxed out.`
        }
        console.log(`${cyanBg} ${sendingPlayer.displayName} HP: ${sendingPlayer.hp}/${getUserMaxHP(user)}, healAmt: 5 ${resetTxt}`)
    }

    return actions[randAction]
}

function handleFight(channel, user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleFight(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printFight()
    const sendingPlayer = players[user]
    const targetPlayer = players[toUser]
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
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
            console.log(`${grayBg} smallDamage: ${smallDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${smallDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${smallDamageDealt} ${resetTxt}`)
        } else if (randNum === 1) {
            targetPlayer.hp -= mediumDamageDealt
            console.log(`${grayBg} mediumDamage: ${mediumDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${mediumDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${mediumDamageDealt} ${resetTxt}`)
        } else if (randNum === 2) {
            targetPlayer.hp -= largeDamageDealt
            console.log(`${grayBg} largeDamage: ${largeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${largeDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${largeDamageDealt} ${resetTxt}`)
        } else if (randNum === 3) {
            targetPlayer.hp -= extraLargeDamageDealt
            console.log(`${grayBg} extraLargeDamage: ${extraLargeDamage} ${resetTxt} ${sendingPlayer.hp <= 0 ? redBg : greenBg} ${sendingPlayer.displayName} ${resetTxt} ${blueBg} ATK: ${attackBonus}, weapon: ${weaponDamage} ${resetTxt} ${grayBg} ${extraLargeDamage + weaponDamage + attackBonus} ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} ${toUser === `dummy` ? `DUMMY` : targetPlayer.displayName} ${resetTxt} ${magentaBg} DEF: ${defenseBonus}, armor: ${armorDeduction} ${resetTxt} ${grayBg} ${armorDeduction + defenseBonus} ${resetTxt} ${yellowBg} ${extraLargeDamageDealt} ${resetTxt}`)
        }

        if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

        talk(channel, response)
        deathCheck(channel, user, toUser)
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
}

function handleAct(channel, user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleAct(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }
    const targetPlayer = toUser !== user && toUser in players ? players[toUser] : null
    printAct()
    let response = `* ${players[user].displayName.substring(0, 1).toUpperCase() + players[user].displayName.substring(1)}`
    targetPlayer ? response += getAction(user, toUser) : response += getThirdPersonFlavorText()

    if (players[user].armor === `Stained Apron`) { response += stainedApronHeal(user) }

    talk(channel, response)
}

function handleMercy(channel, user, toUser) {
    if (settings.debug) { console.log(`${boldTxt}> handleMercy(channel: ${channel}, user: ${user}, toUser: ${toUser})${resetTxt}`) }
    printMercy()
    const sendingPlayer = players[user]
    const targetPlayer = players[toUser]
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    const capsTarget = targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)
    const randNum = targetPlayer.hp <= 5
        ? Math.floor(Math.random() * 2)
        : targetPlayer.hp <= 10
            ? Math.floor(Math.random() * 4)
            : Math.floor(Math.random() * 10)

    const randGoldAmt = Math.floor(Math.random() * 101)
    let response = `* `

    if (randNum === 0) {
        response += `YOU WON! ${capsTarget} was spared. ${capsSender} earned 0 EXP and ${randGoldAmt} gold.`
        sendingPlayer.gold += randGoldAmt
        sendingPlayer.hp = getUserMaxHP(user)
        targetPlayer.hp = getUserMaxHP(toUser)
    } else {
        response += `${capsSender} tried to spare ${targetPlayer.displayName}. ${capsTarget}`
        response += getThirdPersonFlavorText()
    }
    if (sendingPlayer.armor === `Stained Apron`) { response += stainedApronHeal(user) }

    talk(channel, response)
    console.log(`${cyanBg} sender: ${sendingPlayer.displayName} (${sendingPlayer.hp} HP), target: ${toUser === `dummy` ? `DUMMY` : targetPlayer?.displayName || `none`}${targetPlayer ? ` (${targetPlayer.hp} HP)` : ``}, randNum: ${randNum} ${resetTxt}`)
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

function deathCheck(chatroom, user, target) {
    if (settings.debug) {
        console.log(`${boldTxt}> deathCheck(chatroom: ${chatroom}, user: ${user}, target: ${target})${resetTxt}`)
        if (!chatroom.startsWith(`#`)) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'chatroom' data being sent (doesn't start with '#')!${resetTxt}`) }
    }
    const sendingPlayer = players[user]
    const targetPlayer = players[target]
    const targetSaveData = playerSave[target]
    const capsSender = sendingPlayer.displayName.substring(0, 1).toUpperCase() + sendingPlayer.displayName.substring(1)
    const capsTarget = targetPlayer.displayName.substring(0, 1).toUpperCase() + targetPlayer.displayName.substring(1)
    console.log(`${sendingPlayer.hp <= 0 ? redBg : greenBg} user: ${sendingPlayer.displayName} ${sendingPlayer.hp}/${getUserMaxHP(user)} HP ${resetTxt} ${targetPlayer.hp <= 0 ? redBg : greenBg} target: ${target === `dummy` ? `DUMMY` : targetPlayer.displayName} ${targetPlayer.hp}/${getUserMaxHP(target)} HP ${resetTxt}`)

    const deathText = [
        `The future of monsters depends on you!`,
        `Don't lose hope!`,
        `You cannot give up just yet...`,
        `Our fate rests upon you...`,
        `It cannot end now!`,
        `You're going to be alright!`
    ]

    if (targetPlayer.hp <= 0) {
        // Building death response
        let response = `* `
        response += deathText[Math.floor(Math.random() * deathText.length)]
        target === `dummy` ? response += ` The Dummy was ripped to shreds... ` : response += ` ${capsTarget}! Stay determined... `

        // Checking if user killed a different user
        if (user !== target) {
            // Appending awarded EXP
            const awardedEXP = 10 + targetPlayer.exp
            response += `${capsSender} earned ${awardedEXP} EXP`

            // Appending awarded gold
            const randGold = Math.ceil(Math.random() * 100)
            sendingPlayer.gold += randGold
            if (targetPlayer.gold > 0) {
                sendingPlayer.gold += targetPlayer.gold
                targetPlayer.gold = 0
                response += `, got ${targetPlayer.displayName}'s gold, and found ${randGold} G.`
            } else {
                response += ` and ${randGold} G.`
            }

            // Resetting target's EXP and Gold in SAVE data, because it was taken by another user, and would otherwise be duplicated if/when they LOAD
            targetSaveData.lv = 1
            if (targetSaveData.hp > 20) { targetSaveData.hp = 20 }
            targetSaveData.at = 0
            targetSaveData.df = 0
            targetSaveData.exp = 0
            targetSaveData.next = 10
            targetSaveData.gold = 0

            // Checking for LV threshold
            sendingPlayer.exp += awardedEXP
            sendingPlayer.next -= awardedEXP
            if (sendingPlayer.next <= 0) {
                response += ` ${capsSender}'s LOVE increased.`
                response += calculateUserLV(user)
            }
        } else {
            if (sendingPlayer.gold > 0) {
                sendingPlayer.gold = 0
                response += ` ${capsSender} lost all their gold!`
            }
        }

        // Resetting target user's stats
        targetPlayer.dead = true
        targetPlayer.hp = 0
        targetPlayer.lv = 1
        targetPlayer.exp = 0
        targetPlayer.next = 10
        targetPlayer.at = 0
        targetPlayer.df = 0

        const msgDelay = chatroom === CHANNEL_1 ? 1000 : 2000
        setTimeout(() => {
            client.say(chatroom, response)
            console.log(`${yellowBg}${chatroom} ${resetTxt}`, `${yellowTxt}UndertaleBot: ${response}${resetTxt}`)
        }, msgDelay)
    }
}

function getUserMaxHP(user) {
    if (settings.debug) { console.log(`${boldTxt}> getUserMaxHP(user: ${user})${resetTxt}`) }
    const userLV = players[user].lv
    let maxHP = baseHP + (4 * userLV)
    if (userLV >= 20) { maxHP = 99 }
    return maxHP
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
    let foundItemsAppend = ``

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

    if (collectedItems.length) {
        for (const item of collectedItems) { player.inventory.push(item) }
        foundItemsAppend = ` ${player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)} found: ` + collectedItems.join(`, `)
    }
    console.log(`Inventory:`, player.inventory)
    return foundItemsAppend
}

function printLogo() {
    if (settings.debug) { console.log(`${boldTxt}> printLogo()${resetTxt}`) }
    const whSq = `\x1b[47m  \x1b[0m`
    const gySq = `\x1b[100m  \x1b[0m`
    const rdSq = `\x1b[41m  \x1b[0m`
    const bkSq = `\x1b[40m  \x1b[0m`

    // Colored text
    console.log(`${orangeTxt}Bravery.${resetTxt}`, `${yellowTxt}Justice.${resetTxt}`, `${blueTxt}Integrity.${resetTxt}`, `${greenTxt}Kindness.${resetTxt}`, `${magentaTxt}Perseverance.${resetTxt}`, `${cyanTxt}Patience.${resetTxt}`)

    // UNDERTALE logo
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

    // List of basic commands
    console.log(`${redBg} !fight ${resetTxt}`, `${redTxt}- Choose another chat member to attack${resetTxt}`)
    console.log(`${orangeBg} !act ${resetTxt}`, `${orangeTxt}  - Do an action by yourself or with another chat member${resetTxt}`)
    console.log(`${yellowBg} !item ${resetTxt}`, `${yellowTxt} - Check for (or use) items in your inventory${resetTxt}`)
    console.log(`${blueBg} !mercy ${resetTxt}`, `${blueTxt}- Choose another chat member to spare${resetTxt}`)
    console.log(`${greenBg} !buy ${resetTxt}`, `${greenTxt}  - Spend gold on items, or check what is possible to buy${resetTxt}`)
    console.log(`${magentaBg} !save ${resetTxt}`, `${magentaTxt} - Use determination to save your current state${resetTxt}`)
    console.log(`${cyanBg} !load ${resetTxt}`, `${cyanTxt} - Reload your previous save file${resetTxt}`)
}

function printFight() {
    if (settings.debug) { console.log(`${boldTxt}> printFight()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const ywSq = `\x1b[43m  \x1b[0m`
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
}

function printAct() {
    if (settings.debug) { console.log(`${boldTxt}> printAct()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const ywSq = `\x1b[43m  \x1b[0m`
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
}

function printItem() {
    if (settings.debug) { console.log(`${boldTxt}> printItem()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const ywSq = `\x1b[43m  \x1b[0m`
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + ywSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
}

function printMercy() {
    if (settings.debug) { console.log(`${boldTxt}> printMercy()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const ywSq = `\x1b[43m  \x1b[0m`
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + ywSq + bkSq + ywSq + bkSq + ywSq + ywSq + ywSq + bkSq + bkSq + ywSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + ywSq)
    console.log(ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq + ywSq)
}

function buyItem(user, str, price) {
    if (settings.debug) {
        console.log(`${boldTxt}> buyItem(user: ${user}, str: ${str}, price: ${price})${resetTxt}`)
        if (typeof price !== `number`) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'price' data being sent (not of type 'number')!${resetTxt}`) }
    }

    const player = players[user]
    const capsName = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)

    if (player.lv < itemLvThreshold[str]) { return `${player.displayName}, that item isn't available to you yet! :(` }

    if (player.gold < price) { return `${player.displayName}, that item costs ${price}G, you have ${player.gold}G! :(` }

    if (str === `spider donut`) {
        player.gold -= price
        player.inventory.push(`Spider Donut`)
        return `* ${capsName} bought the Spider Donut!`
    }
    if (str === `spider cider`) {
        player.gold -= price
        player.inventory.push(`Spider Cider`)
        return `* ${capsName} bought the Spider Cider!`
    }
    if (str === `nice cream`) {
        player.gold -= price
        player.inventory.push(`Nice Cream`)
        return `* ${capsName} bought the Nice Cream!`
    }
    if (str === `bisicle`) {
        player.gold -= price
        player.inventory.push(`Bisicle`)
        return `* ${capsName} bought the Bisicle!`
    }
    if (str === `cinnamon bunny`) {
        player.gold -= price
        player.inventory.push(`Cinnamon Bunny`)
        return `* ${capsName} bought the Cinnamon Bunny!`
    }
    if (str === `tough glove`) {
        player.gold -= price
        player.inventory.push(`Tough Glove`)
        return `* ${capsName} bought the Tough Glove!`
    }
    if (str === `manly bandanna`) {
        player.gold -= price
        player.inventory.push(`Manly Bandanna`)
        return `* ${capsName} bought the Manly Bandanna!`
    }
    if (str === `crab apple`) {
        player.gold -= price
        player.inventory.push(`Crab Apple`)
        return `* ${capsName} bought the Crab Apple!`
    }
    if (str === `sea tea`) {
        player.gold -= price
        player.inventory.push(`Sea Tea`)
        return `* ${capsName} bought the Sea Tea!`
    }
    if (str === `temmie flakes`) {
        player.gold -= price
        player.inventory.push(`Temmie Flakes`)
        return `* ${capsName} bought the Temmie Flakes!`
    }
    if (str === `torn notebook`) {
        player.gold -= price
        player.inventory.push(`Torn Notebook`)
        return `* ${capsName} bought the Torn Notebook!`
    }
    if (str === `cloudy glasses`) {
        player.gold -= price
        player.inventory.push(`Cloudy Glasses`)
        return `* ${capsName} bought the Cloudy Glasses!`
    }
    if (str === `temmie armor`) {
        player.gold -= price
        player.inventory.push(`Temmie Armor`)
        return `* ${capsName} bought the Temmie Armor!`
    }
    if (str === `hot dog`) {
        player.gold -= price
        player.inventory.push(`Hot Dog...?`)
        return `* ${capsName} bought the Hot Dog...?!`
    }
    if (str === `hot cat`) {
        player.gold -= price
        player.inventory.push(`Hot Cat`)
        return `* ${capsName} bought the Hot Cat!`
    }
    if (str === `junk food`) {
        player.gold -= price
        player.inventory.push(`Junk Food`)
        return `* ${capsName} bought the Junk Food!`
    }
    if (str === `starfait`) {
        player.gold -= price
        player.inventory.push(`Starfait`)
        return `* ${capsName} bought the Starfait!`
    }
    if (str === `glamburger`) {
        player.gold -= price
        player.inventory.push(`Glamburger`)
        return `* ${capsName} bought the Glamburger!`
    }
    if (str === `legendary hero`) {
        player.gold -= price
        player.inventory.push(`Legendary Hero`)
        return `* ${capsName} bought the Legendary Hero!`
    }
    if (str === `steak in the shape of mettaton's face`) {
        player.gold -= price
        player.inventory.push(`Steak in the Shape of Mettaton's Face`)
        return `* ${capsName} bought the Steak in the Shape of Mettaton's Face!`
    }
    if (str === `empty gun`) {
        player.gold -= price
        player.inventory.push(`Empty Gun`)
        return `* ${capsName} bought the Empty Gun!`
    }
    if (str === `cowboy hat`) {
        player.gold -= price
        player.inventory.push(`Cowboy Hat`)
        return `* ${capsName} bought the Cowboy Hat!`
    }
    if (str === `popato chisps`) {
        player.gold -= price
        player.inventory.push(`Popato Chisps`)
        return `* ${capsName} bought the Popato Chisps!`
    }
    return `If you are reading this, ${player.displayName}, I messed up somehow.`
}

function itemLookup(channel, capsName, str) {
    if (settings.debug) { console.log(`${boldTxt}> itemLookup(channel: ${channel}, capsName: ${capsName}, str: ${str})${resetTxt}`) }
    const allItems = [
        // Consumable items
        `bandage`,
        `monster candy`,
        `spider donut`,
        `spider cider`,
        `butterscotch pie`,
        `snail pie`,
        `snowman piece`,
        `nice cream`,
        `bisicle`,
        `unisicle`,
        `cinnamon bunny`,
        `astronaut food`,
        `crab apple`,
        `sea tea`,
        `abandoned quiche`,
        `temmie flakes`,
        `dog salad`,
        `instant noodles`,
        `hot dog`,
        `hot cat`,
        `junk food`,
        `hush puppy`,
        `starfait`,
        `glamburger`,
        `legendary hero`,
        `steak in the shape of mettaton's face`,
        `popato chisps`,
        `bad memory`,
        `last dream`,

        // Unused items
        `puppydough icecream`,
        `pumpkin rings`,
        `croquet roll`,
        `ghost fruit`,
        `stoic onion`,
        `rock candy`,

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
    return allItems.includes(str) ? str : null
}

function useItem(user, str, idx) {
    if (settings.debug) {
        console.log(`${boldTxt}> useItem(user: ${user}, str: ${str}, idx: ${idx})${resetTxt}`)
        if (typeof idx !== `number`) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'idx' data being sent (not of type 'number')!${resetTxt}`) }
    }
    printItem()
    const player = players[user]
    const capsName = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)
    const maxHP = getUserMaxHP(user)
    let healAmt = consumableItems[str]
    const burntPanBonus = player.weapon === `Burnt Pan` ? 4 : 0
    if (burntPanBonus > 0) { console.log(`${magentaBg} ${player.displayName} is using the Burnt Pan, heal amount +${burntPanBonus} ${resetTxt}`) }

    // Consumable items
    if (str === `bandage`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const bandageText = [
            `* ${capsName} re-applied the used Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied the gross Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied their old, used Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied the dirty Bandage. Still kind of gooey.`,
            `* ${capsName} re-applied the well-used Bandage. Still kind of gooey.`
        ]
        const randIdx = Math.floor(Math.random() * bandageText.length)
        let itemText = bandageText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `monster candy`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const monstercandyText = [
            `* ${capsName} ate a Monster Candy. Very un-licorice-like.`,
            `* ${capsName} ate a Monster Candy. ...tastes like licorice.`
        ]
        const randIdx = Math.floor(Math.random() * monstercandyText.length)
        let itemText = monstercandyText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `spider donut`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const spiderdonutText = [
            `* ${capsName} ate a Spider Donut.`,
            `* ${capsName} ate a Spider Donut. Made with Spider Cider in the batter.`
        ]
        const randIdx = Math.floor(Math.random() * spiderdonutText.length)
        let itemText = spiderdonutText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `spider cider`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const spiderciderText = [
            `* ${capsName} drank a Spider Cider.`,
            `* ${capsName} drank a Spider Cider. Made with whole spiders, not just the juice.`
        ]
        const randIdx = Math.floor(Math.random() * spiderciderText.length)
        let itemText = spiderciderText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `butterscotch pie`) {
        player.inventory.splice(idx, 1)
        player.hp = maxHP
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL ${resetTxt}`)
        return `* ${capsName} ate the Butterscotch-Cinnamon Pie. ${capsName}'s HP was maxed out.`
    }
    if (str === `snail pie`) {
        player.inventory.splice(idx, 1)
        player.hp = maxHP - 1
        const snailpieText = [
            `* ${capsName} ate the Snail Pie. ${capsName}'s HP was maxed out.`,
            `* ${capsName} ate the Snail Pie. It's an acquired taste. ${capsName}'s HP was maxed out.`
        ]
        const randIdx = Math.floor(Math.random() * snailpieText.length)
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL - 1 ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return snailpieText[randIdx]
    }
    if (str === `snowman piece`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const snowmanpieceText = [
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece.`,
            `* ${capsName} ate a Snowman Piece in front of the Snowman it came from.`
        ]
        const randIdx = Math.floor(Math.random() * snowmanpieceText.length)
        let itemText = snowmanpieceText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `nice cream`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const nicecreamText = [
            `* ${capsName} ate a Nice Cream. You're super spiffy!`,
            `* ${capsName} ate a Nice Cream. Are those claws natural?`,
            `* ${capsName} ate a Nice Cream. Love yourself! I love you!`,
            `* ${capsName} ate a Nice Cream. You look nice today!`,
            `* ${capsName} ate a Nice Cream. (An illustration of a hug)`,
            `* ${capsName} ate a Nice Cream. Have a wonderful day!`,
            `* ${capsName} ate a Nice Cream. Is this as sweet as you?`,
            `* ${capsName} ate a Nice Cream. You're just great!`
        ]
        const randIdx = Math.floor(Math.random() * nicecreamText.length)
        let itemText = nicecreamText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `bisicle`) {
        player.inventory[idx] = `Unisicle`
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const bisicleText = [
            `* ${capsName} eats one half of the Bisicle.`,
            `* ${capsName} eats one half of the Bisicle. It is now a Unisicle.`
        ]
        const randIdx = Math.floor(Math.random() * bisicleText.length)
        let itemText = bisicleText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `unisicle`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const unisicleText = [
            `* ${capsName} ate a Unisicle.`,
            `* ${capsName} ate a Unisicle. It's a SINGLE-pronged popsicle. Wait, that's just normal...`
        ]
        const randIdx = Math.floor(Math.random() * unisicleText.length)
        let itemText = unisicleText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `cinnamon bunny`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const cinnamonbunnyText = [
            `* ${capsName} ate a Cinnamon Bunny.`,
            `* ${capsName} ate a Cinnamon Bunny. A cinnamon roll in a shape of a bunny.`
        ]
        const randIdx = Math.floor(Math.random() * cinnamonbunnyText.length)
        let itemText = cinnamonbunnyText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `astronaut food`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const astronautfoodText = [
            `* ${capsName} ate some Astronaut Food.`,
            `* ${capsName} ate some Astronaut Food. It's for a pet astronaut?`
        ]
        const randIdx = Math.floor(Math.random() * astronautfoodText.length)
        let itemText = astronautfoodText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `crab apple`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const crabappleText = [
            `* ${capsName} ate a Crab Apple.`,
            `* ${capsName} ate a Crab Apple. An aquatic fruit that resembles a crustacean.`
        ]
        const randIdx = Math.floor(Math.random() * crabappleText.length)
        let itemText = crabappleText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `sea tea`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const seateaText = [
            `* ${capsName} drank a Sea Tea.`,
            `* ${capsName} drank a Sea Tea. Made from glowing marsh water.`
        ]
        const randIdx = Math.floor(Math.random() * seateaText.length)
        let itemText = seateaText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `abandoned quiche`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const abandonedquicheText = [
            `* ${capsName} ate the Abandoned Quiche.`,
            `* ${capsName} ate the quiche they found under a bench.`,
            `* ${capsName} ate a psychologically-damaged spinach egg pie.`
        ]
        const randIdx = Math.floor(Math.random() * abandonedquicheText.length)
        let itemText = abandonedquicheText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `temmie flakes`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const temmieflakesText = [
            `* ${capsName} ate some Temmie Flakes (cheap). hOI!`,
            `* ${capsName} ate some Temmie Flakes (cheap). It's just torn up pieces of colored construction paper.`,
            `* ${capsName} ate some Temmie Flakes (normal). hOI!!! i'm tEMMIE!!`,
            `* ${capsName} ate some Temmie Flakes (normal). It's just torn up pieces of colored construction paper.`,
            `* ${capsName} ate some Temmie Flakes (expensiv). WOA!! u gota... tem flakes!!!`,
            `* ${capsName} ate some Temmie Flakes (expensiv). It's just torn up pieces of colored construction paper.`,
            `* ${capsName} ate some Temmie Flakes (premiem). FOOB!!!`,
            `* ${capsName} ate some Temmie Flakes (premiem). It's just torn up pieces of colored construction paper.`
        ]
        const randIdx = Math.floor(Math.random() * temmieflakesText.length)
        let itemText = temmieflakesText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `dog salad`) {
        player.inventory.splice(idx, 1)
        const dogSaladText = [
            `* ${capsName} ate Dog Salad. Oh. There are bones...`,
            `* ${capsName} ate Dog Salad. Oh. Fried tennis ball...`,
            `* ${capsName} ate Dog Salad. Oh. Tastes yappy...`,
            `* ${capsName} ate Dog Salad. It's literally garbage??? ${capsName}'s HP was maxed out.`,
        ]
        const randIdx = Math.floor(Math.random() * dogSaladText.length)
        let dogSaladHealAmt = 99
        if (randIdx === 0) {
            dogSaladHealAmt = 2
            dogSaladHealAmt += burntPanBonus
            player.hp += dogSaladHealAmt
        }
        if (randIdx === 1) {
            dogSaladHealAmt = 10
            dogSaladHealAmt += burntPanBonus
            player.hp += dogSaladHealAmt
        }
        if (randIdx === 2) {
            dogSaladHealAmt = 30
            dogSaladHealAmt += burntPanBonus
            player.hp += dogSaladHealAmt
        }
        if (player.hp > maxHP) { player.hp = maxHP }
        if (randIdx === 3) { player.hp = maxHP }
        let itemText = dogSaladText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${dogSaladHealAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, dogSaladHealAmt: ${dogSaladHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `instant noodles`) {
        player.inventory.splice(idx, 1)
        const instantnoodlesText = [
            `* ${capsName} ate the Instant Noodles. They're better dry.`,
            `* ${capsName} cooked the Instant Noodles. Comes with everything you need for a quick meal!`,
            `* ${capsName} spends four minutes cooking Instant Noodles before eating them. ... they don't taste very good. They add the flavor packet. That's better. Not great, but better.`
        ]
        const randIdx = Math.floor(Math.random() * instantnoodlesText.length)
        let instantNoodlesHealAmt = 4
        if (randIdx === 0) {
            instantNoodlesHealAmt = 90
            instantNoodlesHealAmt += burntPanBonus
            player.hp += instantNoodlesHealAmt
        }
        if (randIdx === 1) {
            instantNoodlesHealAmt = 15
            instantNoodlesHealAmt += burntPanBonus
            player.hp += instantNoodlesHealAmt
        }
        if (randIdx === 2) {
            instantNoodlesHealAmt = 4
            instantNoodlesHealAmt += burntPanBonus
            player.hp += instantNoodlesHealAmt
        }
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = instantnoodlesText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${instantNoodlesHealAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, instantNoodlesHealAmt: ${instantNoodlesHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hot dog`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const hotdogText = [
            `* ${capsName} ate a Hot Dog...? (Bark!)`,
            `* ${capsName} ate a Hot Dog...? (Bark!)`,
            `* ${capsName} ate a Hot Dog...? The "meat" is made of something called a "water sausage."`
        ]
        const randIdx = Math.floor(Math.random() * hotdogText.length)
        let itemText = hotdogText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hot cat`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const hotcatText = [
            `* ${capsName} ate a Hot Cat. (Meow!)`,
            `* ${capsName} ate a Hot Cat. (Meow!)`,
            `* ${capsName} ate a Hot Cat. Like a hot dog, but with little cat ears on the end.`
        ]
        const randIdx = Math.floor(Math.random() * hotcatText.length)
        let itemText = hotcatText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `junk food`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const junkfoodText = [
            `* ${capsName} used Junk Food.`,
            `* ${capsName} used Junk Food.`,
            `* ${capsName} used Junk Food. Food that was probably once thrown away.`,
            `* ${capsName} used Junk Food. (Eating garbage?!)`
        ]
        const randIdx = Math.floor(Math.random() * junkfoodText.length)
        let itemText = junkfoodText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `hush puppy`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} ate a Hush Puppy. Dog-magic is neutralized.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `starfait`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const starfaitText = [
            `* ${capsName} ate a Starfait.`,
            `* ${capsName} ate a Starfait.`,
            `* ${capsName} ate a Starfait.`,
            `* ${capsName} ate a Starfait. A sweet treat made of sparkling stars.`,
            `* ${capsName} ate a Starfait. Viewer ratings go up by 200 points!`,
            `* ${capsName} ate a Starfait. Viewer ratings go up by 200 points!`
        ]
        const randIdx = Math.floor(Math.random() * starfaitText.length)
        let itemText = starfaitText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `glamburger`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const glamburgerText = [
            `* ${capsName} ate a Glamburger.`,
            `* ${capsName} ate the Glamburger. Made of edible glitter and sequins.`
        ]
        const randIdx = Math.floor(Math.random() * glamburgerText.length)
        let itemText = glamburgerText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `legendary hero`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const legendaryheroText = [
            `* ${capsName} ate a Legendary Hero.`,
            `* ${capsName} ate the Legendary Hero. Sandwich shaped like a sword. Increases ATTACK when eaten.`,
            `* ${capsName} ate a Legendary Hero. Viewer ratings go up by 500 points!`
        ]
        const randIdx = Math.floor(Math.random() * legendaryheroText.length)
        let itemText = legendaryheroText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `steak in the shape of mettaton's face`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const steakText = [
            `* ${capsName} ate the Steak in the Shape of Mettaton's Face. They feel like it's not made of real meat...`,
            `* ${capsName} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts.`,
            `* ${capsName} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts. Viewer ratings go up by 700 points!`
        ]
        const randIdx = Math.floor(Math.random() * steakText.length)
        let itemText = steakText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `popato chisps`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        const popatochispsText = [
            `* ${capsName} ate some Popato Chisps.`,
            `* ${capsName} ate some Popato Chisps. Regular old popato chisps.`
        ]
        const randIdx = Math.floor(Math.random() * popatochispsText.length)
        let itemText = popatochispsText[randIdx]
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
        return itemText
    }
    if (str === `bad memory`) {
        player.inventory.splice(idx, 1)
        let itemText = `* ${capsName} consumes the Bad Memory. `
        if (player.hp <= 3) {
            player.hp = maxHP
            itemText += `${capsName}'s HP was maxed out.`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL ${resetTxt}`)
        } else {
            player.hp += healAmt
            itemText += `${player.displayName} lost 1 HP.`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        }
        return itemText
    }
    if (str === `last dream`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} used Last Dream. Through DETERMINATION, the dream became true.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered 12 HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `puppydough icecream`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} ate Puppydough Icecream. Mmm! Tastes like puppies.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `pumpkin rings`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} ate Pumpkin Rings. A small pumpkin cooked like onion rings.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `croquet roll`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} hit a Croquet Roll into their mouth. Fried dough traditionally served with a mallet.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `ghost fruit`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} ate a Ghost Fruit. It will never pass to the other side.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `stoic onion`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} ate a Stoic Onion. They didn't cry...`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }
    if (str === `rock candy`) {
        player.inventory.splice(idx, 1)
        healAmt += burntPanBonus
        player.hp += healAmt
        if (player.hp > maxHP) { player.hp = maxHP }
        let itemText = `* ${capsName} ate Rock Candy. It's a rock.`
        player.hp === maxHP ? itemText += ` ${capsName}'s HP was maxed out.` : itemText += ` ${capsName} recovered ${healAmt} HP!`
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        return itemText
    }

    // Weapons
    if (str === `stick`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Stick`
        const stickText = [
            `* ${capsName} threw the Stick away. Then picked it back up.`,
            `* ${capsName} equipped the Stick. Its bark is worse than its bite.`
        ]
        const randIdx = Math.floor(Math.random() * stickText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Stick, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return stickText[randIdx]
    }
    if (str === `toy knife`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Toy Knife`
        const toyKnifeText = [
            `* ${capsName} equipped the Toy Knife. +3 ATTACK`,
            `* ${capsName} equipped the Toy Knife. Made of plastic. A rarity nowadays. +3 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * toyKnifeText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Toy Knife, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return toyKnifeText[randIdx]
    }
    if (str === `tough glove`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Tough Glove`
        const toughGloveText = [
            `* ${capsName} equipped the Tough Glove. +5 ATTACK`,
            `* ${capsName} equipped the Tough Glove. A worn pink leather glove. For five-fingered folk. +5 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * toughGloveText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Tough Glove, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return toughGloveText[randIdx]
    }
    if (str === `ballet shoes`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Ballet Shoes`
        const balletShoesText = [
            `* ${capsName} equipped the Ballet Shoes. +7 ATTACK`,
            `* ${capsName} equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous. +7 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * balletShoesText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Ballet Shoes, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return balletShoesText[randIdx]
    }
    if (str === `torn notebook`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Torn Notebook`
        console.log(`${cyanBg} ${player.displayName} equipped the Torn Notebook, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return `* ${capsName} equipped the Torn Notebook. +2 ATTACK`
    }
    if (str === `burnt pan`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Burnt Pan`
        const burntPanText = [
            `* ${capsName} equipped the Burnt Pan. +10 ATTACK`,
            `* ${capsName} equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP. +10 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * burntPanText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Burnt Pan, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return burntPanText[randIdx]
    }
    if (str === `empty gun`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Empty Gun`
        const emptyGunText = [
            `* ${capsName} equipped the Empty Gun. +12 ATTACK`,
            `* ${capsName} equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low. +12 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * emptyGunText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Empty Gun, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return emptyGunText[randIdx]
    }
    if (str === `worn dagger`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Worn Dagger`
        const wornDaggerText = [
            `* ${capsName} equipped the Worn Dagger. +15 ATTACK`,
            `* ${capsName} equipped the Worn Dagger. Perfect for cutting plants and vines. +15 ATTACK`
        ]
        const randIdx = Math.floor(Math.random() * wornDaggerText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Worn Dagger, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return wornDaggerText[randIdx]
    }
    if (str === `real knife`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Real Knife`
        console.log(`${cyanBg} ${player.displayName} equipped the Real Knife, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return `* ${capsName} equipped the Real Knife. About time. +99 ATTACK`
    }

    // Armor
    if (str === `faded ribbon`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Faded Ribbon`
        const fadedRibbonText = [
            `* ${capsName} equipped the Faded Ribbon. +5 DEFENSE`,
            `* ${capsName} equipped the Faded Ribbon. If you're cuter, they won't hit you as hard. +5 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * fadedRibbonText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Faded Ribbon, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return fadedRibbonText[randIdx]
    }
    if (str === `manly bandanna`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Manly Bandanna`
        const manlyBandannaText = [
            `* ${capsName} equipped the Manly Bandanna. +7 DEFENSE`,
            `* ${capsName} equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it. +7 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * manlyBandannaText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Manly Bandanna, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return manlyBandannaText[randIdx]
    }
    if (str === `old tutu`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Old Tutu`
        const oldTutuText = [
            `* ${capsName} equipped the Old Tutu. +10 DEFENSE`,
            `* ${capsName} equipped the Old Tutu. Finally, a protective piece of armor. +10 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * oldTutuText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Old Tutu, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return oldTutuText[randIdx]
    }
    if (str === `cloudy glasses`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Cloudy Glasses`
        const cloudyGlassesText = [
            `* ${capsName} equipped the Cloudy Glasses. +5 DEFENSE`,
            `* ${capsName} equipped the Cloudy Glasses. Glasses marred with wear. +5 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * cloudyGlassesText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Cloudy Glasses, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return cloudyGlassesText[randIdx]
    }
    if (str === `temmie armor`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Temmie Armor`
        const temmieArmorText = [
            `* ${capsName} donned the Temmie Armor. The things you can do with a college education!`,
            `* ${capsName} donned the Temmie Armor. tem armor so GOOds! any battle becom! a EASY victories!!!`
        ]
        const randIdx = Math.floor(Math.random() * temmieArmorText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Temmie Armor, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return temmieArmorText[randIdx]
    }
    if (str === `stained apron`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Stained Apron`
        const stainedApronText = [
            `* ${capsName} equipped the Stained Apron. +11 DEFENSE`,
            `* ${capsName} equipped the Stained Apron. Heals 1 HP every other turn.`
        ]
        const randIdx = Math.floor(Math.random() * stainedApronText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Stained Apron, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return stainedApronText[randIdx]
    }
    if (str === `cowboy hat`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Cowboy Hat`
        const cowboyHatText = [
            `* ${capsName} equipped the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
            `* ${capsName} equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard. +5 ATTACK +12 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * cowboyHatText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Cowboy Hat, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return cowboyHatText[randIdx]
    }
    if (str === `heart locket`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `Heart Locket`
        const heartLocketText = [
            `* ${capsName} equipped the Heart Locket. +15 DEFENSE`,
            `* ${capsName} equipped the Heart Locket. It says "Best Friends Forever." +15 DEFENSE`
        ]
        const randIdx = Math.floor(Math.random() * heartLocketText.length)
        console.log(`${cyanBg} ${player.displayName} equipped the Heart Locket, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return heartLocketText[randIdx]
    }
    if (str === `the locket`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `The Locket`
        console.log(`${cyanBg} ${player.displayName} equipped the Locket, HP: ${player.hp}/${maxHP} ${resetTxt}`)
        return `* ${capsName} equipped the Locket. Right where it belongs. +99 DEFENSE`
    }
    return `* ${capsName} used 0. If you are reading this, I messed up somehow.`
}

function sansOpenEyes() {
    if (settings.debug) { console.log(`${boldTxt}> sansOpenEyes()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const whSq = `\x1b[47m  \x1b[0m`
    const noSq = `  `
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-   -33-   -34-   -35-   -36-   -37-   -38-   -39-   -40-   -41-   -42-   -43-   -44-   -45-   -46-   -47-   -48-   -49-   -50-   -51-   -52-   -53-   -54-   -56-   -57-   -58-   -59-   -60-   -61-   -62-   -63-   -64-   -65-   -66-   -67-   -68-   -69-   -70-   -71-   -72-
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 1
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 2
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 3
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq) // 4
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 5
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 6
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 7
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 8
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 9
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 10
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq) // 11
    console.log(whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq) // 12
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq) // 13
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq) // 14
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq) // 15
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + noSq) // 16
    console.log(noSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq) // 17
    console.log(noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq + noSq) // 18
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + noSq + noSq + noSq) // 19
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 20
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 21
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 22
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 23
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 24
    console.log(noSq + noSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + noSq) // 25
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 26
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 27
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 28
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 29
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 30
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq) // 31
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 32
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 33
}

function sansClosedEyes() {
    if (settings.debug) { console.log(`${boldTxt}> sansClosedEyes()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const whSq = `\x1b[47m  \x1b[0m`
    const noSq = `  `
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-   -33-   -34-   -35-   -36-   -37-   -38-   -39-   -40-   -41-   -42-   -43-   -44-   -45-   -46-   -47-   -48-   -49-   -50-   -51-   -52-   -53-   -54-   -56-   -57-   -58-   -59-   -60-   -61-   -62-   -63-   -64-   -65-   -66-   -67-   -68-   -69-   -70-   -71-   -72-
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 1
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 2
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 3
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq) // 4
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 5
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 6
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 7
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 8
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 9
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 10
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 11
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 12
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 13
    console.log(whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq) // 14
    console.log(whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq) // 15
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + noSq) // 16
    console.log(noSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq) // 17
    console.log(noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq + noSq) // 18
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + noSq + noSq + noSq) // 19
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 20
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 21
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 22
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 23
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 24
    console.log(noSq + noSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + noSq) // 25
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 26
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 27
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 28
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 29
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 30
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq) // 31
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 32
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 33}
}

function sansNoEyes() {
    if (settings.debug) { console.log(`${boldTxt}> sansNoEyes()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const whSq = `\x1b[47m  \x1b[0m`
    const noSq = `  `
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-   -33-   -34-   -35-   -36-   -37-   -38-   -39-   -40-   -41-   -42-   -43-   -44-   -45-   -46-   -47-   -48-   -49-   -50-   -51-   -52-   -53-   -54-   -56-   -57-   -58-   -59-   -60-   -61-   -62-   -63-   -64-   -65-   -66-   -67-   -68-   -69-   -70-   -71-   -72-
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 1
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 2
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 3
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq) // 4
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 5
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 6
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 7
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 8
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 9
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 10
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq) // 11
    console.log(whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq) // 12
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq) // 13
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq) // 14
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq) // 15
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + noSq) // 16
    console.log(noSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq) // 17
    console.log(noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq + noSq) // 18
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + noSq + noSq + noSq) // 19
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 20
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 21
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 22
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 23
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 24
    console.log(noSq + noSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + noSq) // 25
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 26
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 27
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 28
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 29
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 30
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq) // 31
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 32
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 33
}

function sansWink() {
    if (settings.debug) { console.log(`${boldTxt}> sansWink()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const whSq = `\x1b[47m  \x1b[0m`
    const noSq = `  `
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-   -33-   -34-   -35-   -36-   -37-   -38-   -39-   -40-   -41-   -42-   -43-   -44-   -45-   -46-   -47-   -48-   -49-   -50-   -51-   -52-   -53-   -54-   -56-   -57-   -58-   -59-   -60-   -61-   -62-   -63-   -64-   -65-   -66-   -67-   -68-   -69-   -70-   -71-   -72-
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 1
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 2
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 3
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq) // 4
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 5
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 6
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 7
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 8
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 9
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 10
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 11
    console.log(whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 12
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 13
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq) // 14
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq) // 15
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + noSq) // 16
    console.log(noSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + noSq) // 17
    console.log(noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq + noSq) // 18
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 19
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 20
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 21
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 22
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 23
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 24
    console.log(noSq + noSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + noSq) // 25
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 26
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 27
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 28
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 29
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 30
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq) // 31
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 32
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 33
}

function sansLookAround() {
    if (settings.debug) { console.log(`${boldTxt}> sansLookAround()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const whSq = `\x1b[47m  \x1b[0m`
    const noSq = `  `
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-   -24-   -25-   -26-   -27-   -28-   -29-   -30-   -31-   -32-   -33-   -34-   -35-   -36-   -37-   -38-   -39-   -40-   -41-   -42-   -43-   -44-   -45-   -46-   -47-   -48-   -49-   -50-   -51-   -52-   -53-   -54-   -56-   -57-   -58-   -59-   -60-   -61-   -62-   -63-   -64-   -65-   -66-   -67-   -68-   -69-   -70-   -71-   -72-
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 1
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 2
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 3
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq) // 4
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 5
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 6
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 7
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 8
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 9
    console.log(noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq) // 10
    console.log(whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq) // 11
    console.log(whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq) // 12
    console.log(whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq) // 13
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq) // 14
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq) // 15
    console.log(whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + noSq) // 16
    console.log(noSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq) // 17
    console.log(noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + noSq + noSq) // 18
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 19
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 20
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 21
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 22
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 23
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 24
    console.log(noSq + noSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + noSq) // 25
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 26
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq) // 27
    console.log(noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 28
    console.log(noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq) // 29
    console.log(noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq) // 30
    console.log(noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq) // 31
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq) // 32
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 33
}

function sansSmall() {
    if (settings.debug) { console.log(`${boldTxt}> sansSmall()${resetTxt}`) }
    const bkSq = `\x1b[40m  \x1b[0m`
    const whSq = `\x1b[47m  \x1b[0m`
    const blSq = `\x1b[44m  \x1b[0m`
    const gySq = `\x1b[100m  \x1b[0m`
    const noSq = `  `
    //          -1 -   -2 -   -3 -   -4 -   -5 -   -6 -   -7 -   -8 -   -9 -   -10-   -11-   -12-   -13-   -14-   -15-   -16-   -17-   -18-   -19-   -20-   -21-   -22-   -23-
    console.log(noSq + noSq + noSq + noSq + noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq) // 1
    console.log(noSq + noSq + noSq + noSq + noSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + noSq + noSq + noSq + noSq + noSq) // 2
    console.log(noSq + noSq + noSq + noSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + noSq + noSq + noSq + noSq) // 3
    console.log(noSq + noSq + noSq + noSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + noSq + noSq + noSq + noSq) // 4
    console.log(noSq + noSq + noSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + noSq + noSq + noSq) // 5
    console.log(noSq + noSq + noSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + noSq + noSq + noSq) // 6
    console.log(noSq + noSq + noSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + noSq + noSq + noSq) // 7
    console.log(noSq + noSq + noSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + noSq + noSq + noSq) // 8
    console.log(noSq + noSq + noSq + noSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + noSq + noSq + noSq + noSq) // 9
    console.log(noSq + noSq + noSq + bkSq + bkSq + whSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + whSq + bkSq + bkSq + noSq + noSq + noSq) // 10
    console.log(noSq + noSq + noSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + noSq + noSq + noSq) // 11
    console.log(noSq + noSq + noSq + bkSq + whSq + whSq + whSq + bkSq + whSq + bkSq + whSq + bkSq + whSq + bkSq + whSq + bkSq + whSq + whSq + whSq + bkSq + noSq + noSq + noSq) // 12
    console.log(noSq + noSq + noSq + noSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + bkSq + noSq + noSq + noSq + noSq) // 13
    console.log(noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq) // 14
    console.log(noSq + noSq + bkSq + blSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + blSq + bkSq + noSq + noSq) // 15
    console.log(noSq + bkSq + bkSq + blSq + bkSq + gySq + gySq + bkSq + whSq + whSq + whSq + bkSq + whSq + whSq + whSq + bkSq + gySq + gySq + bkSq + blSq + bkSq + bkSq + noSq) // 16
    console.log(noSq + bkSq + blSq + blSq + blSq + bkSq + gySq + gySq + bkSq + bkSq + bkSq + whSq + bkSq + bkSq + bkSq + gySq + gySq + bkSq + blSq + blSq + blSq + bkSq + noSq) // 17
    console.log(bkSq + blSq + blSq + bkSq + bkSq + blSq + bkSq + bkSq + bkSq + whSq + whSq + bkSq + whSq + whSq + bkSq + bkSq + bkSq + blSq + bkSq + bkSq + blSq + blSq + bkSq) // 18
    console.log(bkSq + blSq + blSq + blSq + blSq + bkSq + blSq + blSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + blSq + blSq + bkSq + blSq + blSq + blSq + blSq + bkSq) // 19
    console.log(bkSq + blSq + blSq + blSq + blSq + blSq + bkSq + blSq + bkSq + bkSq + whSq + whSq + whSq + bkSq + bkSq + blSq + bkSq + blSq + blSq + blSq + blSq + blSq + bkSq) // 20
    console.log(noSq + bkSq + blSq + blSq + blSq + bkSq + blSq + blSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + blSq + blSq + bkSq + blSq + blSq + blSq + bkSq + noSq) // 21
    console.log(noSq + noSq + bkSq + bkSq + blSq + bkSq + blSq + blSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + blSq + blSq + bkSq + blSq + bkSq + bkSq + noSq + noSq) // 22
    console.log(noSq + noSq + noSq + bkSq + bkSq + bkSq + blSq + blSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + blSq + blSq + bkSq + bkSq + bkSq + noSq + noSq + noSq) // 23
    console.log(noSq + noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq + noSq) // 24
    console.log(noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq) // 25
    console.log(noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq) // 26
    console.log(noSq + noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq + noSq) // 27
    console.log(noSq + noSq + bkSq + bkSq + bkSq + whSq + whSq + whSq + whSq + bkSq + noSq + noSq + noSq + bkSq + whSq + whSq + whSq + whSq + bkSq + bkSq + bkSq + noSq + noSq) // 28
    console.log(noSq + noSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + bkSq + noSq + noSq + noSq + bkSq + bkSq + whSq + whSq + whSq + whSq + whSq + bkSq + noSq + noSq) // 29
    console.log(noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq + noSq + noSq + noSq + noSq + bkSq + bkSq + bkSq + bkSq + bkSq + noSq + noSq + noSq) // 30
}

module.exports = {
    BOT_USERNAME,
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
    getThirdPersonFlavorText,
    getAction,
    handleFight,
    handleAct,
    handleMercy,
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
    itemLookup,
    useItem,
    sansOpenEyes,
    sansClosedEyes,
    sansNoEyes,
    sansWink,
    sansLookAround,
    sansSmall
}