const { getUserMaxHP, showStats } = require(`./utils`)

const { resetTxt, boldTxt, redBg, magentaBg, cyanBg, grayBg, settings } = require(`./config`)

const { players, consumableItems, itemLvThreshold } = require(`./data`)

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

function buyItem(user, str, price) {
    if (settings.debug) {
        console.log(`${boldTxt}> buyItem(user: ${user}, str: ${str}, price: ${price})${resetTxt}`)
        if (typeof price !== `number`) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'price' data being sent (not of type 'number')!${resetTxt}`) }
    }

    const player = players[user]
    const capsName = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)

    if (player.lv < itemLvThreshold[str]) { return `${player.displayName}, that item isn't available to you yet! :(` }

    if (str === `spider donut`) {
        if (player.gold < price) {
            return `* ${capsName} didn't have enough gold.`
        } else {
            player.gold -= price
            player.inventory.push(`Spider Donut`)
            return `* Some spiders crawled down and gave ${player.displayName} a donut.`
        }
    }
    if (str === `spider cider`) {
        if (player.gold < price) {
            return `* ${capsName} didn't have enough gold.`
        } else {
            player.gold -= price
            player.inventory.push(`Spider Cider`)
            return `* Some spiders crawled down and gave ${player.displayName} a jug.`
        }
    }
    if (str === `nice cream`) {
        if (player.gold < price) {
            return `* Huh? You don't have enough money... I wish I could make Nice Cream for free...`
        } else {
            player.gold -= price
            player.inventory.push(`Nice Cream`)
            return `* Here you go! Have a super-duper day! (${capsName} got the Nice Cream.)`
        }
    }
    if (str === `bisicle`) {
        if (player.gold < price) {
            return `* That's not enough money.`
        } else {
            player.gold -= price
            player.inventory.push(`Bisicle`)
            return `* Thanks for your purchase.`
        }
    }
    if (str === `cinnamon bunny`) {
        if (player.gold < price) {
            return `* That's not enough money.`
        } else {
            player.gold -= price
            player.inventory.push(`Cinnamon Bunny`)
            return `* Thanks for your purchase.`
        }
    }
    if (str === `tough glove`) {
        if (player.gold < price) {
            return `* That's not enough money.`
        } else {
            player.gold -= price
            player.inventory.push(`Tough Glove`)
            return `* Thanks for your purchase.`
        }
    }
    if (str === `manly bandanna`) {
        if (player.gold < price) {
            return `* That's not enough money.`
        } else {
            player.gold -= price
            player.inventory.push(`Manly Bandanna`)
            return `* Thanks for your purchase.`
        }
    }
    if (str === `crab apple`) {
        if (player.gold < price) {
            return `* You're a bit short on cash.`
        } else {
            player.gold -= price
            player.inventory.push(`Crab Apple`)
            return `* Thanks! Wa ha ha.`
        }
    }
    if (str === `sea tea`) {
        if (player.gold < price) {
            return `* You're a bit short on cash.`
        } else {
            player.gold -= price
            player.inventory.push(`Sea Tea`)
            return `* Thanks! Wa ha ha.`
        }
    }
    if (str === `torn notebook`) {
        if (player.gold < price) {
            return `* You're a bit short on cash.`
        } else {
            player.gold -= price
            player.inventory.push(`Torn Notebook`)
            return `* Thanks! Wa ha ha.`
        }
    }
    if (str === `cloudy glasses`) {
        if (player.gold < price) {
            return `* You're a bit short on cash.`
        } else {
            player.gold -= price
            player.inventory.push(`Cloudy Glasses`)
            return `* Thanks! Wa ha ha.`
        }
    }
    if (str === `temmie flakes`) {
        if (player.gold < price) {
            return `* you don hav da muns,`
        } else {
            player.gold -= price
            player.inventory.push(`Temmie Flakes`)
            return `* thanks PURCHASE!`
        }
    }
    if (str === `temmie armor`) {
        if (player.gold < price) {
            return `* you don hav da muns,`
        } else {
            player.gold -= price
            player.inventory.push(`Temmie Armor`)
            return `* thanks PURCHASE!`
        }
    }
    if (/^hot dog[ .?]*$/.test(str)) {
        if (player.gold < price) {
            return `* whoops, you don't have enough cash. you should get a job. i've heard being a sentry pays well.`
        } else {
        }
        player.gold -= price
        if (player.inventory.includes(`Hot Dog...?`)) {
            player.inventory.push(`Hot Cat`)
            return `* another h'dog? here you go... whoops, i'm actually out of hot dogs. here, you can have a hot cat instead.`
        } else {
            player.inventory.push(`Hot Dog...?`)
            return `* thanks, kid. here's your 'dog. yeah. 'dog. apostrophe-dog. it's short for hot-dog.`
        }
    }
    if (str === `junk food`) {
        if (player.gold < price) {
            return `* You need WAY more money.`
        } else {
        }
        player.gold -= price
        player.inventory.push(`Junk Food`)
        return `* Bratty! We're gonna be rich!`
    }
    if (str === `empty gun`) {
        if (player.gold < price) {
            return `* You need WAY more money.`
        } else {
            player.gold -= price
            player.inventory.push(`Empty Gun`)
            return `* Bratty! We're gonna be rich!`
        }
    }
    if (str === `cowboy hat`) {
        if (player.gold < price) {
            return `* You need WAY more money.`
        } else {
            player.gold -= price
            player.inventory.push(`Cowboy Hat`)
            return `* Bratty! We're gonna be rich!`
        }
    }
    if (str === `starfait`) {
        if (player.gold < price) {
            return `* That's not the right amount of money.`
        } else {
            player.gold -= price
            player.inventory.push(`Starfait`)
            const dialogue = [
                `Thanksy! Have a FABU-FUL day!!!`,
                `Here you go, little weirdo.`,
                `Here you go, little buddy.`
            ]
            return `* ${dialogue[Math.floor(Math.random() * dialogue.length)]}`
        }
    }
    if (str === `glamburger`) {
        if (player.gold < price) {
            return `* That's not the right amount of money.`
        } else {
            player.gold -= price
            player.inventory.push(`Glamburger`)
            const dialogue = [
                `Thanksy! Have a FABU-FUL day!!!`,
                `Here you go, little weirdo.`,
                `Here you go, little buddy.`
            ]
            return `* ${dialogue[Math.floor(Math.random() * dialogue.length)]}`
        }
    }
    if (str === `legendary hero`) {
        if (player.gold < price) {
            return `* That's not the right amount of money.`
        } else {
            player.gold -= price
            player.inventory.push(`Legendary Hero`)
            const dialogue = [
                `Thanksy! Have a FABU-FUL day!!!`,
                `Here you go, little weirdo.`,
                `Here you go, little buddy.`
            ]
            return `* ${dialogue[Math.floor(Math.random() * dialogue.length)]}`
        }
    }
    if (str === `steak in the shape of mettaton's face`) {
        if (player.gold < price) {
            return `* That's not the right amount of money.`
        } else {
            player.gold -= price
            player.inventory.push(`Steak in the Shape of Mettaton's Face`)
            const dialogue = [
                `Thanksy! Have a FABU-FUL day!!!`,
                `Here you go, little weirdo.`,
                `Here you go, little buddy.`
            ]
            return `* ${dialogue[Math.floor(Math.random() * dialogue.length)]}`
        }
    }
    if (str === `popato chisps`) {
        if (player.gold < price) {
            return `* (${capsName} didn't have enough gold.)`
        } else {
            player.gold -= price
            player.inventory.push(`Popato Chisps`)
            return `* (The vending machine dispensed some chisps.)`
        }
    }
    return `If you are reading this, ${player.displayName}, I messed up somehow.`
}

function dropItem(user, str, idx) {
    if (settings.debug) {
        console.log(`${boldTxt}> dropItem(user: ${user}, str: ${str}, idx: ${idx})${resetTxt}`)
        if (typeof idx !== `number`) { console.log(`${redBg}${boldTxt}*** WARNING: Bad 'idx' data being sent (not of type 'number')!${resetTxt}`) }
    }
    const player = players[user]
    const capsName = player.displayName.substring(0, 1).toUpperCase() + player.displayName.substring(1)

    const items = {
        // Consumable items
        "bandage": "Bandage",
        "monster candy": "Monster Candy",
        "spider donut": "Spider Donut",
        "spider cider": "Spider Cider",
        "butterscotch pie": "Butterscotch Pie",
        "snail pie": "Snail Pie",
        "snowman piece": "Snowman Piece",
        "nice cream": "Nice Cream",
        "bisicle": "Bisicle",
        "unisicle": "Unisicle",
        "cinnamon bunny": "Cinnamon Bunny",
        "astronaut food": "Astronaut Food",
        "crab apple": "Crab Apple",
        "sea tea": "Sea Tea",
        "abandoned quiche": "Abandoned quiche",
        "temmie flakes": "Temmie Flakes",
        "dog salad": "Dog Salad",
        "instant noodles": "Instant Noodles",
        "hot cat": "Hot Cat",
        "junk food": "Junk Food",
        "hush puppy": "Hush Puppy",
        "starfait": "Starfait",
        "glamburger": "Glamburger",
        "legendary hero": "Legendary Hero",
        "steak in the shape of mettaton's face": "Steak in the Shape of Mettaton's Face",
        "popato chisps": "Popato Chisps",
        "bad memory": "Bad Memory",
        "last dream": "Last Dream",

        // Unused items
        "puppydough icecream": "Puppydough Icecream",
        "pumpkin rings": "Pumpkin Rings",
        "croquet roll": "Croquet Roll",
        "ghost fruit": "Ghost Fruit",
        "stoic onion": "Stoic Onion",
        "rock candy": "Rock Candy",

        // Weapons
        "stick": "Stick",
        "toy knife": "Toy Knife",
        "tough glove": "Tough Glove",
        "ballet shoes": "Ballet Shoes",
        "torn notebook": "Torn Notebook",
        "burnt pan": "Burnt Pan",
        "empty gun": "Empty Gun",
        "worn dagger": "Worn Dagger",
        "real knife": "Real Knife",

        // Armor
        "faded ribbon": "Faded Ribbon",
        "manly bandanna": "Manly Bandanna",
        "old tutu": "Old Tutu",
        "cloudy glasses": "Cloudy Glasses",
        "temmie armor": "Temmie Armor",
        "stained apron": "Stained Apron",
        "cowboy hat": "Cowboy Hat",
        "heart locket": "Heart Locket",
        "the locket": "The Locket"
    }

    if (str === `abandoned quiche`) {
        player.inventory.splice(idx, 1)
        return `* ${capsName} leaves the Quiche on the ground and tells it they'll be right back.`
    }
    else if (str === `bad memory`) {
        return `* (${capsName} threw the Bad Memory away.) (But it came back.)`
    }
    else {
        player.inventory.splice(idx, 1)
        const randNum = Math.floor(Math.random() * 36)
        if (randNum < 29) {
            return `* The ${items[str]} was thrown away.`
        } else if ([29, 30].includes(randNum)) {
            return `* ${capsName} abandoned the ${items[str]}.`
        } else if ([31, 32].includes(randNum)) {
            return `* ${capsName} threw the ${items[str]} on the ground like the piece of trash it is.`
        } else if ([33, 34].includes(randNum)) {
            return `* ${capsName} put the ${items[str]} on the ground and gave it a little pat.`
        } else {
            return `* ${capsName} bid a quiet farewell to the ${items[str]}.`
        }
    }
}

function itemLookup(str) {
    if (settings.debug) { console.log(`${boldTxt}> itemLookup(str: ${str})${resetTxt}`) }
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
    return /^hot dog[ .?]*$/.test(str)
        ? `hot dog...?`
        : allItems.includes(str)
            ? str
            : null
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
        return itemText
    }
    if (str === `butterscotch pie`) {
        player.inventory.splice(idx, 1)
        player.hp = maxHP
        console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL ${resetTxt}`)
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
        return itemText
    }
    if (str === `hot dog...?`) {
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
            itemText += `${capsName} lost 1 HP.`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
        }
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Stick ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Toy Knife ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Tough Glove ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Ballet Shoes ${resetTxt}`)
        showStats(user)
        return balletShoesText[randIdx]
    }
    if (str === `torn notebook`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Torn Notebook`
        console.log(`${cyanBg} ${player.displayName} equipped the Torn Notebook ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Burnt Pan ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Empty Gun ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Worn Dagger ${resetTxt}`)
        showStats(user)
        return wornDaggerText[randIdx]
    }
    if (str === `real knife`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.weapon)
        player.weapon = `Real Knife`
        console.log(`${cyanBg} ${player.displayName} equipped the Real Knife ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Faded Ribbon ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Manly Bandanna ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Old Tutu ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Cloudy Glasses ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Temmie Armor ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Stained Apron ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Cowboy Hat ${resetTxt}`)
        showStats(user)
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
        console.log(`${cyanBg} ${player.displayName} equipped the Heart Locket ${resetTxt}`)
        showStats(user)
        return heartLocketText[randIdx]
    }
    if (str === `the locket`) {
        player.inventory.splice(idx, 1)
        player.inventory.push(player.armor)
        player.armor = `The Locket`
        console.log(`${cyanBg} ${player.displayName} equipped the Locket ${resetTxt}`)
        showStats(user)
        return `* ${capsName} equipped the Locket. Right where it belongs. +99 DEFENSE`
    }
    return `* ${capsName} used 0. If you are reading this, I messed up somehow.`
}

module.exports = { buyItem, dropItem, itemLookup, useItem }
