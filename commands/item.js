const { settings, resetTxt, boldTxt, magentaBg, cyanBg, grayBg } = require(`../config`)
const { itemNames, itemLvThreshold, consumableItems, itemPrices } = require(`../data`)
const { getUserMaxHP } = require(`./utils`)
const { printItem } = require(`./graphics`)
const { showStats } = require(`./stats`)
const { calculateBisiclePrice, calculateNiceCreamPrice, calculateTemmieArmorPrice } = require(`./math`)

function buyItem(user, player, boughtItem) {
    if (settings.debug) { console.log(`${boldTxt}> buyItem(user: ${user}, boughtItem: ${boughtItem})${resetTxt}`) }

    if (player.lv < itemLvThreshold[boughtItem]) { return `${player.displayName}, that item isn't available to you yet!` }
    const price = boughtItem === `nice cream`
        ? calculateNiceCreamPrice(user)
        : boughtItem === `bisicle`
            ? calculateBisiclePrice(user)
            : boughtItem === `temmie armor`
                ? calculateTemmieArmorPrice(user)
                : itemPrices[boughtItem]

    switch (boughtItem) {
        case `spider donut`: {
            if (player.gold < price) {
                return `* ${player.capsName} didn't have enough gold.`
            } else {
                player.gold -= price
                player.inventory.push(`Spider Donut`)
                return `* Some spiders crawled down and gave ${player.displayName} a donut.`
            }
        }
        case `spider cider`: {
            if (player.gold < price) {
                return `* ${player.capsName} didn't have enough gold.`
            } else {
                player.gold -= price
                player.inventory.push(`Spider Cider`)
                return `* Some spiders crawled down and gave ${player.displayName} a jug.`
            }
        }
        case `nice cream`: {
            if (player.gold < price) {
                return `* Huh? You don't have enough money... I wish I could make Nice Cream for free...`
            } else {
                player.gold -= price
                player.inventory.push(`Nice Cream`)
                return `* Here you go! Have a super-duper day! (${player.capsName} got the Nice Cream.)`
            }
        }
        case `bisicle`: {
            if (player.gold < price) {
                return `* That's not enough money.`
            } else {
                player.gold -= price
                player.inventory.push(`Bisicle`)
                return `* Thanks for your purchase.`
            }
        }
        case `cinnamon bunny`: {
            if (player.gold < price) {
                return `* That's not enough money.`
            } else {
                player.gold -= price
                player.inventory.push(`Cinnamon Bunny`)
                return `* Thanks for your purchase.`
            }
        }
        case `tough glove`: {
            if (player.gold < price) {
                return `* That's not enough money.`
            } else {
                player.gold -= price
                player.inventory.push(`Tough Glove`)
                return `* Thanks for your purchase.`
            }
        }
        case `manly bandanna`: {
            if (player.gold < price) {
                return `* That's not enough money.`
            } else {
                player.gold -= price
                player.inventory.push(`Manly Bandanna`)
                return `* Thanks for your purchase.`
            }
        }
        case `crab apple`: {
            if (player.gold < price) {
                return `* You're a bit short on cash.`
            } else {
                player.gold -= price
                player.inventory.push(`Crab Apple`)
                return `* Thanks! Wa ha ha.`
            }
        }
        case `sea tea`: {
            if (player.gold < price) {
                return `* You're a bit short on cash.`
            } else {
                player.gold -= price
                player.inventory.push(`Sea Tea`)
                return `* Thanks! Wa ha ha.`
            }
        }
        case `torn notebook`: {
            if (player.gold < price) {
                return `* You're a bit short on cash.`
            } else {
                player.gold -= price
                player.inventory.push(`Torn Notebook`)
                return `* Thanks! Wa ha ha.`
            }
        }
        case `cloudy glasses`: {
            if (player.gold < price) {
                return `* You're a bit short on cash.`
            } else {
                player.gold -= price
                player.inventory.push(`Cloudy Glasses`)
                return `* Thanks! Wa ha ha.`
            }
        }
        case `temmie flakes`: {
            if (player.gold < price) {
                return `* you don hav da muns,`
            } else {
                player.gold -= price
                player.inventory.push(`Temmie Flakes`)
                return `* thanks PURCHASE!`
            }
        }
        case `temmie armor`: {
            if (player.gold < price) {
                return `* you don hav da muns,`
            } else {
                player.gold -= price
                player.inventory.push(`Temmie Armor`)
                return `* thanks PURCHASE!`
            }
        }
        case `hot dog...?`: {
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
        case `junk food`: {
            if (player.gold < price) {
                return `* You need WAY more money.`
            } else {
            }
            player.gold -= price
            player.inventory.push(`Junk Food`)
            return `* Bratty! We're gonna be rich!`
        }
        case `empty gun`: {
            if (player.gold < price) {
                return `* You need WAY more money.`
            } else {
                player.gold -= price
                player.inventory.push(`Empty Gun`)
                return `* Bratty! We're gonna be rich!`
            }
        }
        case `cowboy hat`: {
            if (player.gold < price) {
                return `* You need WAY more money.`
            } else {
                player.gold -= price
                player.inventory.push(`Cowboy Hat`)
                return `* Bratty! We're gonna be rich!`
            }
        }
        case `starfait`: {
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
        case `glamburger`: {
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
        case `legendary hero`: {
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
        case `steak in the shape of mettaton's face`: {
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
        case `popato chisps`: {
            if (player.gold < price) {
                return `* (${player.capsName} didn't have enough gold.)`
            } else {
                player.gold -= price
                player.inventory.push(`Popato Chisps`)
                return `* (The vending machine dispensed some chisps.)`
            }
        }
        default:
            return `If you are reading this, ${player.displayName}, I messed up somehow.`
    }
}

function dropItem(player, droppedItem, idx) {
    if (settings.debug) { console.log(`${boldTxt}> dropItem(player.displayName: ${player.displayName}, droppedItem: ${droppedItem}, idx: ${idx})${resetTxt}`) }

    if (droppedItem === `abandoned quiche`) {
        player.inventory.splice(idx, 1)
        return `* ${player.capsName} leaves the Quiche on the ground and tells it they'll be right back.`
    }
    else if (droppedItem === `bad memory`) {
        return `* (${player.capsName} threw the Bad Memory away.) (But it came back.)`
    }
    else {
        player.inventory.splice(idx, 1)
        const randNum = Math.floor(Math.random() * 36)
        if (randNum < 29) {
            return `* The ${itemNames[droppedItem]} was thrown away.`
        } else if ([29, 30].includes(randNum)) {
            return `* ${player.capsName} abandoned the ${itemNames[droppedItem]}.`
        } else if ([31, 32].includes(randNum)) {
            return `* ${player.capsName} threw the ${itemNames[droppedItem]} on the ground like the piece of trash it is.`
        } else if ([33, 34].includes(randNum)) {
            return `* ${player.capsName} put the ${itemNames[droppedItem]} on the ground and gave it a little pat.`
        } else {
            return `* ${player.capsName} bid a quiet farewell to the ${itemNames[droppedItem]}.`
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

function sellItem(player, soldItem, idx) {
    if (settings.debug) { console.log(`${boldTxt}> sellItem(player.displayName: ${player.displayName}, soldItem: ${soldItem}, idx: ${idx})${resetTxt}`) }

    const items = {
        // Consumable items
        "bandage": {
            shortName: "Bandage",
            sellPrice: 150,
            negotiatePrice: 190
        },
        "monster candy": {
            shortName: "MnstrCndy",
            sellPrice: 25,
            negotiatePrice: 34
        },
        "spider donut": {
            shortName: "SpidrDont",
            sellPrice: 30,
            negotiatePrice: 40
        },
        "spider cider": {
            shortName: "SpidrCidr",
            sellPrice: 60,
            negotiatePrice: 78
        },
        "butterscotch pie": {
            shortName: "ButtsPie",
            sellPrice: 180,
            negotiatePrice: 228
        },
        "snail pie": {
            shortName: "Snail Pie",
            sellPrice: 350,
            negotiatePrice: 440
        },
        "snowman piece": {
            shortName: "SnowPiece",
            sellPrice: 40,
            negotiatePrice: 53
        },
        "nice cream": {
            shortName: "NiceCream",
            sellPrice: 2,
            negotiatePrice: 5
        },
        "bisicle": {
            shortName: "Bisicle",
            sellPrice: 5,
            negotiatePrice: 9
        },
        "unisicle": {
            shortName: "Unisicle",
            sellPrice: 2,
            negotiatePrice: 5
        },
        "cinnamon bunny": {
            shortName: "CinnaBun",
            sellPrice: 8,
            negotiatePrice: 13
        },
        "astronaut food": {
            shortName: "AstroFood",
            sellPrice: 25,
            negotiatePrice: 34
        },
        "crab apple": {
            shortName: "CrabApple",
            sellPrice: 5,
            negotiatePrice: 9
        },
        "sea tea": {
            shortName: "Sea Tea",
            sellPrice: 5,
            negotiatePrice: 9
        },
        "abandoned quiche": {
            shortName: "Ab Quiche",
            sellPrice: 76,
            negotiatePrice: 98
        },
        "temmie flakes": {
            shortName: "TemFlakes",
            sellPrice: 2,
            negotiatePrice: 5
        },
        "dog salad": {
            shortName: "Dog Salad",
            sellPrice: 8,
            negotiatePrice: 13
        },
        "instant noodles": {
            shortName: "InstaNood",
            sellPrice: 50,
            negotiatePrice: 65
        },
        "hot dog...?": {
            shortName: "Hot Dog",
            sellPrice: 10,
            negotiatePrice: 15
        },
        "hot cat": {
            shortName: "Hot Cat",
            sellPrice: 11,
            negotiatePrice: 16
        },
        "junk food": {
            shortName: "Junk Food",
            sellPrice: 1,
            negotiatePrice: 4
        },
        "hush puppy": {
            shortName: "HushPupe",
            sellPrice: 150,
            negotiatePrice: 190
        },
        "starfait": {
            shortName: "Starfait",
            sellPrice: 10,
            negotiatePrice: 15
        },
        "glamburger": {
            shortName: "GlamBurg",
            sellPrice: 15,
            negotiatePrice: 21
        },
        "legendary hero": {
            shortName: "Leg.Hero",
            sellPrice: 40,
            negotiatePrice: 53
        },
        "steak in the shape of mettaton's face": {
            shortName: "FaceSteak",
            sellPrice: 14,
            negotiatePrice: 20
        },
        "popato chisps": {
            shortName: "PT Chisps",
            sellPrice: 35,
            negotiatePrice: 46
        },
        "bad memory": {
            shortName: "BadMemory",
            sellPrice: 300,
            negotiatePrice: 378
        },
        "last dream": {
            shortName: "LastDream",
            sellPrice: 250,
            negotiatePrice: 315
        },

        // Unused items
        "puppydough icecream": {
            shortName: "PDIceCram",
            sellPrice: 2,
            negotiatePrice: 5
        },
        "pumpkin rings": {
            shortName: "PunkRings",
            sellPrice: 3,
            negotiatePrice: 6
        },
        "croquet roll": {
            shortName: "CroqtRoll",
            sellPrice: 10,
            negotiatePrice: 15
        },
        "ghost fruit": {
            shortName: "GhostFrut",
            sellPrice: 10,
            negotiatePrice: 15
        },
        "stoic onion": {
            shortName: "StocOnoin",
            sellPrice: 10,
            negotiatePrice: 15
        },
        "rock candy": {
            shortName: "RockCandy",
            sellPrice: 3,
            negotiatePrice: 6
        },

        // Weapons
        "stick": {
            shortName: "Stick",
            sellPrice: 150,
            negotiatePrice: 190
        },
        "toy knife": {
            shortName: "Toy Knife",
            sellPrice: 100,
            negotiatePrice: 128
        },
        "tough glove": {
            shortName: "TuffGlove",
            sellPrice: 50,
            negotiatePrice: 65
        },
        "ballet shoes": {
            shortName: "BallShoes",
            sellPrice: 80,
            negotiatePrice: 103
        },
        "torn notebook": {
            shortName: "TornNotbo",
            sellPrice: 50,
            negotiatePrice: 65
        },
        "burnt pan": {
            shortName: "Burnt Pan",
            sellPrice: 100,
            negotiatePrice: 128
        },
        "empty gun": {
            shortName: "Empty Gun",
            sellPrice: 100,
            negotiatePrice: 128
        },
        "worn dagger": {
            shortName: "WornDG",
            sellPrice: 250,
            negotiatePrice: 315
        },
        "real knife": {
            shortName: "RealKnife",
            sellPrice: 500,
            negotiatePrice: 628
        },

        // Armor
        "faded ribbon": {
            shortName: "Ribbon",
            sellPrice: 100,
            negotiatePrice: 128
        },
        "manly bandanna": {
            shortName: "Mandanna",
            sellPrice: 50,
            negotiatePrice: 65
        },
        "old tutu": {
            shortName: "Old Tutu",
            sellPrice: 80,
            negotiatePrice: 103
        },
        "cloudy glasses": {
            shortName: "ClodGlass",
            sellPrice: 50,
            negotiatePrice: 65
        },
        "temmie armor": {
            shortName: "Temmie AR",
            sellPrice: 500,
            negotiatePrice: 628
        },
        "stained apron": {
            shortName: "StainApro",
            sellPrice: 100,
            negotiatePrice: 128
        },
        "cowboy hat": {
            shortName: "CowboyHat",
            sellPrice: 100,
            negotiatePrice: 128
        },
        "heart locket": {
            shortName: "<--Locket",
            sellPrice: 250,
            negotiatePrice: 315
        },
        "the locket": {
            shortName: "TheLocket",
            sellPrice: 500,
            negotiatePrice: 628
        }
    }

    const item = items[soldItem].shortName

    player.inventory.splice(idx, 1)
    if (player.itemsSold % 8 === 0) {
        const price = items[soldItem].negotiatePrice
        player.gold += price
        player.itemsSold++
        return `* WOA!! u gota... ${item}s!!! hnnn.... i gota have dat ${item}s... but i gota pay for colleg, hnnnn....!!! tem always wanna ${item}s...! tem buy ${item} for... ${price}G!!!`
    } else {
        const price = items[soldItem].sellPrice
        player.gold += price
        player.itemsSold++
        return `* tem buy ${item} for ${price}G!!!`
    }
}

function useItem(user, player, usedItem, idx) {
    if (settings.debug) { console.log(`${boldTxt}> useItem(user: ${user}, usedItem: ${usedItem}, idx: ${idx})${resetTxt}`) }
    printItem()

    const maxHP = getUserMaxHP(user)
    let healAmt = consumableItems[usedItem]
    const burntPanBonus = player.weapon === `Burnt Pan` ? 4 : 0
    if (burntPanBonus > 0) { console.log(`${magentaBg} ${player.displayName} is using the Burnt Pan, heal amount +${burntPanBonus} ${resetTxt}`) }

    switch (usedItem) {
        // Consumable items
        case `bandage`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const bandageText = [
                `* ${player.capsName} re-applied the used Bandage. Still kind of gooey.`,
                `* ${player.capsName} re-applied the gross Bandage. Still kind of gooey.`,
                `* ${player.capsName} re-applied their old, used Bandage. Still kind of gooey.`,
                `* ${player.capsName} re-applied the dirty Bandage. Still kind of gooey.`,
                `* ${player.capsName} re-applied the well-used Bandage. Still kind of gooey.`
            ]
            const randIdx = Math.floor(Math.random() * bandageText.length)
            let itemText = bandageText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `monster candy`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const monstercandyText = [
                `* ${player.capsName} ate a Monster Candy. Very un-licorice-like.`,
                `* ${player.capsName} ate a Monster Candy. ...tastes like licorice.`
            ]
            const randIdx = Math.floor(Math.random() * monstercandyText.length)
            let itemText = monstercandyText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `spider donut`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const spiderdonutText = [
                `* ${player.capsName} ate a Spider Donut.`,
                `* ${player.capsName} ate a Spider Donut. Made with Spider Cider in the batter.`
            ]
            const randIdx = Math.floor(Math.random() * spiderdonutText.length)
            let itemText = spiderdonutText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `spider cider`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const spiderciderText = [
                `* ${player.capsName} drank a Spider Cider.`,
                `* ${player.capsName} drank a Spider Cider. Made with whole spiders, not just the juice.`
            ]
            const randIdx = Math.floor(Math.random() * spiderciderText.length)
            let itemText = spiderciderText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `butterscotch pie`: {
            player.inventory.splice(idx, 1)
            player.hp = maxHP
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL ${resetTxt}`)
            showStats(user)
            return `* ${player.capsName} ate the Butterscotch-Cinnamon Pie. ${player.capsName}'s HP was maxed out.`
        }
        case `snail pie`: {
            player.inventory.splice(idx, 1)
            player.hp = maxHP - 1
            const snailpieText = [
                `* ${player.capsName} ate the Snail Pie. ${player.capsName}'s HP was maxed out.`,
                `* ${player.capsName} ate the Snail Pie. It's an acquired taste. ${player.capsName}'s HP was maxed out.`
            ]
            const randIdx = Math.floor(Math.random() * snailpieText.length)
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL - 1 ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return snailpieText[randIdx]
        }
        case `snowman piece`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const snowmanpieceText = [
                `* ${player.capsName} ate a Snowman Piece.`,
                `* ${player.capsName} ate a Snowman Piece.`,
                `* ${player.capsName} ate a Snowman Piece.`,
                `* ${player.capsName} ate a Snowman Piece.`,
                `* ${player.capsName} ate a Snowman Piece in front of the Snowman it came from.`
            ]
            const randIdx = Math.floor(Math.random() * snowmanpieceText.length)
            let itemText = snowmanpieceText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `nice cream`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const nicecreamText = [
                `* ${player.capsName} ate a Nice Cream. You're super spiffy!`,
                `* ${player.capsName} ate a Nice Cream. Are those claws natural?`,
                `* ${player.capsName} ate a Nice Cream. Love yourself! I love you!`,
                `* ${player.capsName} ate a Nice Cream. You look nice today!`,
                `* ${player.capsName} ate a Nice Cream. (An illustration of a hug)`,
                `* ${player.capsName} ate a Nice Cream. Have a wonderful day!`,
                `* ${player.capsName} ate a Nice Cream. Is this as sweet as you?`,
                `* ${player.capsName} ate a Nice Cream. You're just great!`
            ]
            const randIdx = Math.floor(Math.random() * nicecreamText.length)
            let itemText = nicecreamText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `bisicle`: {
            player.inventory[idx] = `Unisicle`
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const bisicleText = [
                `* ${player.capsName} eats one half of the Bisicle.`,
                `* ${player.capsName} eats one half of the Bisicle. It is now a Unisicle.`
            ]
            const randIdx = Math.floor(Math.random() * bisicleText.length)
            let itemText = bisicleText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `unisicle`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const unisicleText = [
                `* ${player.capsName} ate a Unisicle.`,
                `* ${player.capsName} ate a Unisicle. It's a SINGLE-pronged popsicle. Wait, that's just normal...`
            ]
            const randIdx = Math.floor(Math.random() * unisicleText.length)
            let itemText = unisicleText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `cinnamon bunny`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const cinnamonbunnyText = [
                `* ${player.capsName} ate a Cinnamon Bunny.`,
                `* ${player.capsName} ate a Cinnamon Bunny. A cinnamon roll in a shape of a bunny.`
            ]
            const randIdx = Math.floor(Math.random() * cinnamonbunnyText.length)
            let itemText = cinnamonbunnyText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `astronaut food`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const astronautfoodText = [
                `* ${player.capsName} ate some Astronaut Food.`,
                `* ${player.capsName} ate some Astronaut Food. It's for a pet astronaut?`
            ]
            const randIdx = Math.floor(Math.random() * astronautfoodText.length)
            let itemText = astronautfoodText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `crab apple`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const crabappleText = [
                `* ${player.capsName} ate a Crab Apple.`,
                `* ${player.capsName} ate a Crab Apple. An aquatic fruit that resembles a crustacean.`
            ]
            const randIdx = Math.floor(Math.random() * crabappleText.length)
            let itemText = crabappleText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `sea tea`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const seateaText = [
                `* ${player.capsName} drank a Sea Tea.`,
                `* ${player.capsName} drank a Sea Tea. Made from glowing marsh water.`
            ]
            const randIdx = Math.floor(Math.random() * seateaText.length)
            let itemText = seateaText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `abandoned quiche`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const abandonedquicheText = [
                `* ${player.capsName} ate the Abandoned Quiche.`,
                `* ${player.capsName} ate the quiche they found under a bench.`,
                `* ${player.capsName} ate a psychologically-damaged spinach egg pie.`
            ]
            const randIdx = Math.floor(Math.random() * abandonedquicheText.length)
            let itemText = abandonedquicheText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `temmie flakes`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const temmieflakesText = [
                `* ${player.capsName} ate some Temmie Flakes (cheap). hOI!`,
                `* ${player.capsName} ate some Temmie Flakes (cheap). It's just torn up pieces of colored construction paper.`,
                `* ${player.capsName} ate some Temmie Flakes (normal). hOI!!! i'm tEMMIE!!`,
                `* ${player.capsName} ate some Temmie Flakes (normal). It's just torn up pieces of colored construction paper.`,
                `* ${player.capsName} ate some Temmie Flakes (expensiv). WOA!! u gota... tem flakes!!!`,
                `* ${player.capsName} ate some Temmie Flakes (expensiv). It's just torn up pieces of colored construction paper.`,
                `* ${player.capsName} ate some Temmie Flakes (premiem). FOOB!!!`,
                `* ${player.capsName} ate some Temmie Flakes (premiem). It's just torn up pieces of colored construction paper.`
            ]
            const randIdx = Math.floor(Math.random() * temmieflakesText.length)
            let itemText = temmieflakesText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `dog salad`: {
            player.inventory.splice(idx, 1)
            const dogSaladText = [
                `* ${player.capsName} ate Dog Salad. Oh. There are bones...`,
                `* ${player.capsName} ate Dog Salad. Oh. Fried tennis ball...`,
                `* ${player.capsName} ate Dog Salad. Oh. Tastes yappy...`,
                `* ${player.capsName} ate Dog Salad. It's literally garbage??? ${player.capsName}'s HP was maxed out.`,
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
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${dogSaladHealAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, dogSaladHealAmt: ${dogSaladHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `instant noodles`: {
            player.inventory.splice(idx, 1)
            const instantnoodlesText = [
                `* ${player.capsName} ate the Instant Noodles. They're better dry.`,
                `* ${player.capsName} cooked the Instant Noodles. Comes with everything you need for a quick meal!`,
                `* ${player.capsName} spends four minutes cooking Instant Noodles before eating them. ... they don't taste very good. They add the flavor packet. That's better. Not great, but better.`
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
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${instantNoodlesHealAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, instantNoodlesHealAmt: ${instantNoodlesHealAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `hot dog...?`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const hotdogText = [
                `* ${player.capsName} ate a Hot Dog...? (Bark!)`,
                `* ${player.capsName} ate a Hot Dog...? (Bark!)`,
                `* ${player.capsName} ate a Hot Dog...? The "meat" is made of something called a "water sausage."`
            ]
            const randIdx = Math.floor(Math.random() * hotdogText.length)
            let itemText = hotdogText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `hot cat`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const hotcatText = [
                `* ${player.capsName} ate a Hot Cat. (Meow!)`,
                `* ${player.capsName} ate a Hot Cat. (Meow!)`,
                `* ${player.capsName} ate a Hot Cat. Like a hot dog, but with little cat ears on the end.`
            ]
            const randIdx = Math.floor(Math.random() * hotcatText.length)
            let itemText = hotcatText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `junk food`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const junkfoodText = [
                `* ${player.capsName} used Junk Food.`,
                `* ${player.capsName} used Junk Food.`,
                `* ${player.capsName} used Junk Food. Food that was probably once thrown away.`,
                `* ${player.capsName} used Junk Food. (Eating garbage?!)`
            ]
            const randIdx = Math.floor(Math.random() * junkfoodText.length)
            let itemText = junkfoodText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `hush puppy`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} ate a Hush Puppy. Dog-magic is neutralized.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `starfait`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const starfaitText = [
                `* ${player.capsName} ate a Starfait.`,
                `* ${player.capsName} ate a Starfait.`,
                `* ${player.capsName} ate a Starfait.`,
                `* ${player.capsName} ate a Starfait. A sweet treat made of sparkling stars.`,
                `* ${player.capsName} ate a Starfait. Viewer ratings go up by 200 points!`,
                `* ${player.capsName} ate a Starfait. Viewer ratings go up by 200 points!`
            ]
            const randIdx = Math.floor(Math.random() * starfaitText.length)
            let itemText = starfaitText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `glamburger`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const glamburgerText = [
                `* ${player.capsName} ate a Glamburger.`,
                `* ${player.capsName} ate the Glamburger. Made of edible glitter and sequins.`
            ]
            const randIdx = Math.floor(Math.random() * glamburgerText.length)
            let itemText = glamburgerText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `legendary hero`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const legendaryheroText = [
                `* ${player.capsName} ate a Legendary Hero.`,
                `* ${player.capsName} ate the Legendary Hero. Sandwich shaped like a sword. Increases ATTACK when eaten.`,
                `* ${player.capsName} ate a Legendary Hero. Viewer ratings go up by 500 points!`
            ]
            const randIdx = Math.floor(Math.random() * legendaryheroText.length)
            let itemText = legendaryheroText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `steak in the shape of mettaton's face`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const steakText = [
                `* ${player.capsName} ate the Steak in the Shape of Mettaton's Face. They feel like it's not made of real meat...`,
                `* ${player.capsName} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts.`,
                `* ${player.capsName} ate the Steak in the Shape of Mettaton's Face. The audience goes nuts. Viewer ratings go up by 700 points!`
            ]
            const randIdx = Math.floor(Math.random() * steakText.length)
            let itemText = steakText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `popato chisps`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            const popatochispsText = [
                `* ${player.capsName} ate some Popato Chisps.`,
                `* ${player.capsName} ate some Popato Chisps. Regular old popato chisps.`
            ]
            const randIdx = Math.floor(Math.random() * popatochispsText.length)
            let itemText = popatochispsText[randIdx]
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt} ${grayBg} randIdx: ${randIdx} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `bad memory`: {
            player.inventory.splice(idx, 1)
            let itemText = `* ${player.capsName} consumes the Bad Memory. `
            if (player.hp <= 3) {
                player.hp = maxHP
                itemText += `${player.capsName}'s HP was maxed out.`
                console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ALL ${resetTxt}`)
            } else {
                player.hp += healAmt
                itemText += `${player.capsName} lost 1 HP.`
                console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            }
            showStats(user)
            return itemText
        }
        case `last dream`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} used Last Dream. Through DETERMINATION, the dream became true.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered 12 HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `puppydough icecream`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} ate Puppydough Icecream. Mmm! Tastes like puppies.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `pumpkin rings`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} ate Pumpkin Rings. A small pumpkin cooked like onion rings.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `croquet roll`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} hit a Croquet Roll into their mouth. Fried dough traditionally served with a mallet.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `ghost fruit`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} ate a Ghost Fruit. It will never pass to the other side.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `stoic onion`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} ate a Stoic Onion. They didn't cry...`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }
        case `rock candy`: {
            player.inventory.splice(idx, 1)
            healAmt += burntPanBonus
            player.hp += healAmt
            if (player.hp > maxHP) { player.hp = maxHP }
            let itemText = `* ${player.capsName} ate Rock Candy. It's a rock.`
            player.hp === maxHP ? itemText += ` ${player.capsName}'s HP was maxed out.` : itemText += ` ${player.capsName} recovered ${healAmt} HP!`
            console.log(`${cyanBg} ${player.displayName} HP: ${player.hp}/${maxHP}, healAmt: ${healAmt} ${resetTxt}`)
            showStats(user)
            return itemText
        }

        // Weapons
        case `stick`: {
            showStats(user)
            return `* ${player.capsName} threw the stick away. Then picked it back up.`
        }
        case `toy knife`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Toy Knife`
            const toyKnifeText = [
                `* ${player.capsName} equipped the Toy Knife. +3 ATTACK`,
                `* ${player.capsName} equipped the Toy Knife. Made of plastic. A rarity nowadays. +3 ATTACK`
            ]
            const randIdx = Math.floor(Math.random() * toyKnifeText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Toy Knife ${resetTxt}`)
            showStats(user)
            return toyKnifeText[randIdx]
        }
        case `tough glove`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Tough Glove`
            const toughGloveText = [
                `* ${player.capsName} equipped the Tough Glove. +5 ATTACK`,
                `* ${player.capsName} equipped the Tough Glove. A worn pink leather glove. For five-fingered folk. +5 ATTACK`
            ]
            const randIdx = Math.floor(Math.random() * toughGloveText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Tough Glove ${resetTxt}`)
            showStats(user)
            return toughGloveText[randIdx]
        }
        case `ballet shoes`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Ballet Shoes`
            const balletShoesText = [
                `* ${player.capsName} equipped the Ballet Shoes. +7 ATTACK`,
                `* ${player.capsName} equipped the Ballet Shoes. These used shoes make you feel incredibly dangerous. +7 ATTACK`
            ]
            const randIdx = Math.floor(Math.random() * balletShoesText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Ballet Shoes ${resetTxt}`)
            showStats(user)
            return balletShoesText[randIdx]
        }
        case `torn notebook`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Torn Notebook`
            console.log(`${cyanBg} ${player.displayName} equipped the Torn Notebook ${resetTxt}`)
            showStats(user)
            return `* ${player.capsName} equipped the Torn Notebook. +2 ATTACK`
        }
        case `burnt pan`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Burnt Pan`
            const burntPanText = [
                `* ${player.capsName} equipped the Burnt Pan. +10 ATTACK`,
                `* ${player.capsName} equipped the Burnt Pan. Damage is rather consistent. Consumable items heal 4 more HP. +10 ATTACK`
            ]
            const randIdx = Math.floor(Math.random() * burntPanText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Burnt Pan ${resetTxt}`)
            showStats(user)
            return burntPanText[randIdx]
        }
        case `empty gun`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Empty Gun`
            const emptyGunText = [
                `* ${player.capsName} equipped the Empty Gun. +12 ATTACK`,
                `* ${player.capsName} equipped the Empty Gun. An antique revolver. It has no ammo. Must be used precisely, or damage will be low. +12 ATTACK`
            ]
            const randIdx = Math.floor(Math.random() * emptyGunText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Empty Gun ${resetTxt}`)
            showStats(user)
            return emptyGunText[randIdx]
        }
        case `worn dagger`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Worn Dagger`
            const wornDaggerText = [
                `* ${player.capsName} equipped the Worn Dagger. +15 ATTACK`,
                `* ${player.capsName} equipped the Worn Dagger. Perfect for cutting plants and vines. +15 ATTACK`
            ]
            const randIdx = Math.floor(Math.random() * wornDaggerText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Worn Dagger ${resetTxt}`)
            showStats(user)
            return wornDaggerText[randIdx]
        }
        case `real knife`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.weapon)
            player.weapon = `Real Knife`
            console.log(`${cyanBg} ${player.displayName} equipped the Real Knife ${resetTxt}`)
            showStats(user)
            return `* ${player.capsName} equipped the Real Knife. About time. +99 ATTACK`
        }

        // Armor
        case `faded ribbon`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Faded Ribbon`
            const fadedRibbonText = [
                `* ${player.capsName} equipped the Faded Ribbon. +5 DEFENSE`,
                `* ${player.capsName} equipped the Faded Ribbon. If you're cuter, they won't hit you as hard. +5 DEFENSE`
            ]
            const randIdx = Math.floor(Math.random() * fadedRibbonText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Faded Ribbon ${resetTxt}`)
            showStats(user)
            return fadedRibbonText[randIdx]
        }
        case `manly bandanna`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Manly Bandanna`
            const manlyBandannaText = [
                `* ${player.capsName} equipped the Manly Bandanna. +7 DEFENSE`,
                `* ${player.capsName} equipped the Manly Bandanna. It has seen some wear. It has abs drawn on it. +7 DEFENSE`
            ]
            const randIdx = Math.floor(Math.random() * manlyBandannaText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Manly Bandanna ${resetTxt}`)
            showStats(user)
            return manlyBandannaText[randIdx]
        }
        case `old tutu`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Old Tutu`
            const oldTutuText = [
                `* ${player.capsName} equipped the Old Tutu. +10 DEFENSE`,
                `* ${player.capsName} equipped the Old Tutu. Finally, a protective piece of armor. +10 DEFENSE`
            ]
            const randIdx = Math.floor(Math.random() * oldTutuText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Old Tutu ${resetTxt}`)
            showStats(user)
            return oldTutuText[randIdx]
        }
        case `cloudy glasses`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Cloudy Glasses`
            const cloudyGlassesText = [
                `* ${player.capsName} equipped the Cloudy Glasses. +5 DEFENSE`,
                `* ${player.capsName} equipped the Cloudy Glasses. Glasses marred with wear. +5 DEFENSE`
            ]
            const randIdx = Math.floor(Math.random() * cloudyGlassesText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Cloudy Glasses ${resetTxt}`)
            showStats(user)
            return cloudyGlassesText[randIdx]
        }
        case `temmie armor`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Temmie Armor`
            const temmieArmorText = [
                `* ${player.capsName} donned the Temmie Armor. The things you can do with a college education!`,
                `* ${player.capsName} donned the Temmie Armor. tem armor so GOOds! any battle becom! a EASY victories!!!`
            ]
            const randIdx = Math.floor(Math.random() * temmieArmorText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Temmie Armor ${resetTxt}`)
            showStats(user)
            return temmieArmorText[randIdx]
        }
        case `stained apron`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Stained Apron`
            const stainedApronText = [
                `* ${player.capsName} equipped the Stained Apron. +11 DEFENSE`,
                `* ${player.capsName} equipped the Stained Apron. Heals 1 HP every other turn.`
            ]
            const randIdx = Math.floor(Math.random() * stainedApronText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Stained Apron ${resetTxt}`)
            showStats(user)
            return stainedApronText[randIdx]
        }
        case `cowboy hat`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Cowboy Hat`
            const cowboyHatText = [
                `* ${player.capsName} equipped the Cowboy Hat. +5 ATTACK +12 DEFENSE`,
                `* ${player.capsName} equipped the Cowboy Hat. This battle-worn hat makes them want to grow a beard. +5 ATTACK +12 DEFENSE`
            ]
            const randIdx = Math.floor(Math.random() * cowboyHatText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Cowboy Hat ${resetTxt}`)
            showStats(user)
            return cowboyHatText[randIdx]
        }
        case `heart locket`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `Heart Locket`
            const heartLocketText = [
                `* ${player.capsName} equipped the Heart Locket. +15 DEFENSE`,
                `* ${player.capsName} equipped the Heart Locket. It says "Best Friends Forever." +15 DEFENSE`
            ]
            const randIdx = Math.floor(Math.random() * heartLocketText.length)
            console.log(`${cyanBg} ${player.displayName} equipped the Heart Locket ${resetTxt}`)
            showStats(user)
            return heartLocketText[randIdx]
        }
        case `the locket`: {
            player.inventory.splice(idx, 1)
            player.inventory.push(player.armor)
            player.armor = `The Locket`
            console.log(`${cyanBg} ${player.displayName} equipped the Locket ${resetTxt}`)
            showStats(user)
            return `* ${player.capsName} equipped the Locket. Right where it belongs. +99 DEFENSE`
        }
        default:
            return `* ${player.capsName} used 0. If you are reading this, I messed up somehow.`
    }
}

module.exports = {
    getPrices(props) {
        const { bot, channel, args, user, player } = props
        if (settings.debug) { console.log(`${boldTxt}> getPrices( user: ${user}, args:`, args, `)${resetTxt}`) }

        const availableItems = Object.keys(itemLvThreshold).filter((item) => itemLvThreshold[item] <= player.lv)
        const prices = availableItems.map((item) => `${itemNames[item]} (${item === `temmie armor`
            ? calculateTemmieArmorPrice(user)
            : item === `nice cream`
                ? calculateNiceCreamPrice(user)
                : item === `bisicle`
                    ? calculateBisiclePrice(user)
                    : itemPrices[item]
            }G)`)

        const item = itemLookup(args.join(` `))
        if (player.lv < itemLvThreshold[item]) {
            bot.say(channel, `Sorry ${player.displayName}, that item isn't available to you yet!`)
            return
        }

        const checkedItem = [`nice cream`, `bisicle`, `temmie armor`].includes(item) || item in itemPrices ? item : null
        checkedItem
            ? bot.say(channel, `The ${itemNames[checkedItem]} costs ${checkedItem === `nice cream`
                ? calculateNiceCreamPrice(user)
                : checkedItem === `bisicle`
                    ? calculateBisiclePrice(user)
                    : checkedItem === `temmie armor`
                        ? calculateTemmieArmorPrice(user)
                        : itemPrices[checkedItem]
                } G`)
            : bot.say(channel, `Item prices: ${prices.join(`, `)}`)
    },
    attemptSellItem(props) {
        const { bot, channel, args, user, player } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptSellItem( user: ${user}, args:`, args, `)${resetTxt}`) }

        // Can't use if dead
        if (player.dead) {
            bot.say(channel, `Sorry ${player.displayName}, you are dead!`)
            return
        }

        // Can't use if not LV 3
        if (player.lv < 3) {
            bot.say(channel, `* Huh? Sell somethin'? Does this look like a pawn shop? I don't know how it works where you come from... but... If I started spending money on old branches and used bandages, I'd be out of business in a jiffy!`)
            return
        }

        // Welcome/no item specified
        if (args.length === 0) {
            bot.say(channel, `* hOI! welcom to... da TEM SHOP!!!`)
            return
        }

        // Empty inventory
        const inventory = player.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) {
            bot.say(channel, `* no more item...`)
            return
        }

        // Item validation
        const soldItem = itemLookup(args.join(` `))
        if (!soldItem) {
            bot.say(channel, `${player.capsName}, that isn't an item!`)
            return
        }

        // Check possession
        const index = inventory.indexOf(soldItem)
        if (index < 0) {
            console.log(`Inventory:`, player.inventory)
            bot.say(channel, `${player.capsName}, you don't have that item!`)
            return
        }

        const response = sellItem(player, soldItem, index)
        console.log(`Inventory:`, player.inventory)
        bot.say(channel, response)
    },
    attemptDropItem(props) {
        const { bot, channel, args, player } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptDropItem( player.displayName: ${player.displayName}, args:`, args, `)${resetTxt}`) }

        // Can't use if dead
        if (player.dead) {
            bot.say(channel, `Sorry ${player.displayName}, you are dead!`)
            return
        }

        // Empty inventory
        const inventory = player.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) {
            bot.say(channel, `${player.capsName} has no items!`)
            return
        }

        // Stop if no item 
        if (!args.length) {
            bot.say(channel, `${player.capsName}, no item specified!`)
            return
        }

        // Item validation
        const droppedItem = itemLookup(args.join(` `))

        if (!droppedItem) {
            bot.say(channel, `${player.capsName}, that isn't an item!`)
            return
        }

        // Check possession
        const index = inventory.indexOf(droppedItem)
        if (index < 0) {
            console.log(`Inventory:`, player.inventory)
            bot.say(channel, `${player.capsName}, you don't have that item!`)
            return
        }

        const response = dropItem(player, droppedItem, index)
        console.log(`Inventory:`, player.inventory)
        bot.say(channel, response)
    },
    attemptBuyItem(props) {
        const { bot, channel, args, user, player } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptBuyItem( user: ${user}, args:`, args, `)${resetTxt}`) }

        if (player.dead) {
            bot.say(channel, `Sorry ${player.displayName}, you are dead!`)
            return
        }

        const item = itemLookup(args.join(` `))
        const purchasedItem = [`nice cream`, `bisicle`, `temmie armor`].includes(item) || item in itemPrices ? item : null

        if (purchasedItem) {
            bot.say(channel, buyItem(user, player, purchasedItem))
        } else {
            let response = `${player.displayName} can buy: `
            if (player.lv >= 1) { response += `Spider Donut, Spider Cider` }
            if (player.lv >= 2) { response += `, Nice Cream, Bisicle, Cinnamon Bunny, Tough Glove, Manly Bandanna` }
            if (player.lv >= 3) { response += `, Crab Apple, Sea Tea, Temmie Flakes, Torn Notebook, Cloudy Glasses` }
            if (player.lv >= 4) { response += `, Temmie Armor, Hot Dog...?` }
            if (player.lv >= 5) { response += `, Junk Food, Starfait, Glamburger, Legendary Hero, Steak in the Shape of Mettaton's Face, Empty Gun, Cowboy Hat` }
            if (player.lv >= 6) { response += `, Popato Chisps` }
            bot.say(channel, response)
        }
    },
    attemptUseItem(props) {
        const { bot, channel, message, args, user, player } = props
        if (settings.debug) { console.log(`${boldTxt}> attemptUseItem( user: ${user}, args:`, args, `)${resetTxt}`) }

        // Show items if none selected
        if (args.length === 0) {
            console.log(`Inventory:`, player.inventory)
            bot.say(channel, `${player.capsName}'s items: ${player.inventory.join(`, `)}`)
            return
        }

        // Empty inventory
        const inventory = player.inventory.map(item => item.toLowerCase())
        if (inventory.length === 0) {
            bot.say(channel, `${player.capsName} has no items!`)
            return
        }

        // Can't use if dead
        if (player.dead) {
            console.log(`Inventory:`, player.inventory)
            bot.say(channel, `Sorry ${player.displayName}, you are dead!`)
            return
        }

        // Item validation
        const usedItem = itemLookup(args.join(` `))

        if (!usedItem) {
            console.log(`Inventory:`, player.inventory)
            bot.say(channel, `${player.capsName}, that isn't an item!`)
            return
        }

        // Can't use !equip if not a weapon or armor
        if (message.startsWith(`!equip`) && usedItem in consumableItems) { return }

        // Check possession
        const index = inventory.indexOf(usedItem)
        if (index < 0) {
            console.log(`Inventory:`, player.inventory)
            bot.say(channel, `${player.capsName}, you don't have that item!`)
            return
        }

        const response = useItem(user, player, usedItem, index)
        bot.say(channel, response)
    }
}
