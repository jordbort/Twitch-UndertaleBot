require(`dotenv`).config()
const tmi = require('tmi.js')
const BOT_USERNAME = process.env.BOT_USERNAME
const OAUTH_TOKEN = process.env.OAUTH_TOKEN
const CHANNEL_1 = process.env.CHANNEL_1
const CHANNEL_2 = process.env.CHANNEL_2

// Define configuration options
const opts = {
    identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
    },
    channels: [
        CHANNEL_1,
        CHANNEL_2
    ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
function onMessageHandler(channel, tags, msg, self) {
    if (self) { return } // Ignore messages from the bot

    // Message context
    const sender = tags["display-name"]
    const senderIsSubbed = tags["subscriber"]
    const senderIsAMod = tags["mod"]
    const senderIsVIP = tags["vip"]
    const senderHasTurbo = tags["turbo"]
    const bits = tags["bits"]
    const color = tags["color"]
    const msgID = tags["id"]
    const replyMsgSender = tags["reply-parent-display-name"]
    const replyMsgBody = tags["reply-parent-msg-body"]

    // Command and arguments parser
    const args = msg.split(' ')
    const command = args.shift().toLowerCase()
    const toUser = args[0] ? getToUser(args[0]) : ``

    // Log message + optional 
    console.log(`\x1b[36m%s\x1b[0m`, `${channel} ${sender}:`, `${msg}`)
    // console.log(`command:`, command)
    // console.log(`args:`, args)
    // console.log(`toUser:`, toUser)

    // Reply cases
    if (command === `!spamton`) {
        const response = getSpamtonQuote(args[0])
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    if (command === `!fight`) {
        let response = `* ${sender} attacks `
        toUser ? response += `${toUser}, ` : response += `themself, `

        const smallDamage = Math.ceil(Math.random() * 99)
        const mediumDamage = Math.ceil(Math.random() * 299)
        const bigDamage = Math.ceil(Math.random() * 999)

        outcome = [
            `and deals ${smallDamage} damage!`,
            `and deals ${mediumDamage} damage!`,
            `and deals ${bigDamage} damage!`
        ]
        const randNum = Math.floor(Math.random() * outcome.length)
        response += outcome[randNum]

        if (randNum === 1 && mediumDamage >= 200) {
            response += ` Critical hit!`
        } else if (randNum === 2 && bigDamage >= 500) {
            response += ` Ouch!`
        } else if (randNum === 2 && bigDamage >= 200) {
            response += ` Critical hit!`
        }
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // AM I SUBBED
    if (msg.toLowerCase().includes(`am i sub`)
        || msg.toLowerCase().includes(`am i a sub`)
        || msg.toLowerCase().includes(`do i have a sub`)) {
        let response
        senderIsSubbed ? response = `Yes ${sender}, you are subbed :)` : response = `No ${sender}, you aren't subbed :(`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // AM I A MOD
    if (msg.toLowerCase().includes(`am i a mod`)
        || msg.toLowerCase().includes(`am i mod`)) {
        let response
        senderIsAMod ? response = `Yes ${sender}, you are a mod :)` : response = `No ${sender}, you aren't a mod :(`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // AM I VIP
    if (msg.toLowerCase().includes(`am i vip`)
        || msg.toLowerCase().includes(`am i a vip`)
        || msg.toLowerCase().includes(`do i have vip`)) {
        let response
        senderIsVIP ? response = `Yes ${sender}, you have VIP status :)` : response = `No ${sender}, you don't have VIP status :(`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // Sender has Turbo?
    if (senderHasTurbo) {
        const response = `Wow, ${sender} is a Twitch Turbo user! :O`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // Notice bits cheer message (Not working?)
    if (bits || msg.toLowerCase().includes(`bits`)) {
        const response = `bits: ${bits}`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // Contains MY MESSAGE ID
    if (msg.toLowerCase().includes(`my message id`)) {
        const response = `${sender}, your message ID was ${msgID} :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // Contains HEX CODE / HEX COLOR
    if (msg.toLowerCase().includes(`hex code`)
        || msg.toLowerCase().includes(`hex color`)) {
        const response = `${sender}, your name's hex color is ${color} :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // Notice a reply
    if (replyMsgSender) {
        const response = `I just noticed ${sender} reply to ${replyMsgSender}! :O`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // HELLO BOT
    if (msg.toLowerCase().includes(`hello bot`)
        || msg.toLowerCase().includes(`hey bot`)
        || msg.toLowerCase().includes(`hi bot`)) {
        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }

    // UNDERTALE BOT HI
    if (msg.toLowerCase().includes(`undertalebot hello`)
        || msg.toLowerCase().includes(`undertalebot hey`)
        || msg.toLowerCase().includes(`undertalebot hi`)) {
        const greetings = [`Hi`, `Hey`, `Hello`]
        const greeting = greetings[Math.floor(Math.random() * greetings.length)]
        const response = `${greeting}, ${sender}! How are you? :)`
        client.say(channel, response)
        console.log(`\x1b[33m%s\x1b[0m`, `> Response: ${response}`)
    }
}

// Helper functions
function getSpamtonQuote(num) {
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
        // console.log(`Delivering quote ${idx}`)
        return quotes[idx]
    } else {
        // console.log(`Delivering random quote`)
        return quotes[Math.floor(Math.random() * quotes.length)]
    }
}

function getToUser(str) {
    if (str.startsWith(`@`)) {
        return str.substring(1)
    } else {
        return str
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
    // client.say(CHANNEL_1, `I have been rebooted :)`)
}