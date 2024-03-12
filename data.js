module.exports = {
    // Initializing players
    players: {
        dummy: { // change to dum?
            displayName: `the Dummy`,
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
            inventory: []
        }
    },

    // Initializing player SAVE data
    playerSave: {
        dummy: { // change to dum?
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
            inventory: []
        }
    },

    // Keeping track of highest-reached level to avoid duplicate item earnings
    highestLevels: { dummy: 1 }, // change to dum?

    // Base stats
    baseHP: 16,
    baseAT: -2,
    baseDF: 0.25,

    // AT and DF boosters
    weaponsATK: {
        'Stick': 0,
        'Toy Knife': 3,
        'Tough Glove': 5,
        'Ballet Shoes': 7,
        'Torn Notebook': 2,
        'Burnt Pan': 10,
        'Empty Gun': 12,
        'Worn Dagger': 15,
        'Real Knife': 99
    },
    armorDEF: {
        'Bandage': 0,
        'Faded Ribbon': 3,
        'Manly Bandanna': 7,
        'Old Tutu': 10,
        'Cloudy Glasses': 5,
        'Temmie Armor': 20,
        'Stained Apron': 11,
        'Cowboy Hat': 12,
        'Heart Locket': 15,
        'The Locket': 99
    },

    // Used for getting prices and dropping items
    itemNames: {
        // Consumable items
        'bandage': 'Bandage',
        'monster candy': 'Monster Candy',
        'spider donut': 'Spider Donut',
        'spider cider': 'Spider Cider',
        'butterscotch pie': 'Butterscotch Pie',
        'snail pie': 'Snail Pie',
        'snowman piece': 'Snowman Piece',
        'nice cream': 'Nice Cream',
        'bisicle': 'Bisicle',
        'unisicle': 'Unisicle',
        'cinnamon bunny': 'Cinnamon Bunny',
        'astronaut food': 'Astronaut Food',
        'crab apple': 'Crab Apple',
        'sea tea': 'Sea Tea',
        'abandoned quiche': 'Abandoned Quiche',
        'temmie flakes': 'Temmie Flakes',
        'dog salad': 'Dog Salad',
        'instant noodles': 'Instant Noodles',
        'hot dog...?': 'Hot Dog...?',
        'hot cat': 'Hot Cat',
        'junk food': 'Junk Food',
        'hush puppy': 'Hush Puppy',
        'starfait': 'Starfait',
        'glamburger': 'Glamburger',
        'legendary hero': 'Legendary Hero',
        "steak in the shape of mettaton's face": "Steak in the Shape of Mettaton's Face",
        'popato chisps': 'Popato Chisps',
        'bad memory': 'Bad Memory',
        'last dream': 'Last Dream',

        // Unused items
        'puppydough icecream': 'Puppydough Icecream',
        'pumpkin rings': 'Pumpkin Rings',
        'croquet roll': 'Croquet Roll',
        'ghost fruit': 'Ghost Fruit',
        'stoic onion': 'Stoic Onion',
        'rock candy': 'Rock Candy',

        // Weapons
        'stick': 'Stick',
        'toy knife': 'Toy Knife',
        'tough glove': 'Tough Glove',
        'ballet shoes': 'Ballet Shoes',
        'torn notebook': 'Torn Notebook',
        'burnt pan': 'Burnt Pan',
        'empty gun': 'Empty Gun',
        'worn dagger': 'Worn Dagger',
        'real knife': 'Real Knife',

        // Armor
        'faded ribbon': 'Faded Ribbon',
        'manly bandanna': 'Manly Bandanna',
        'old tutu': 'Old Tutu',
        'cloudy glasses': 'Cloudy Glasses',
        'temmie armor': 'Temmie Armor',
        'stained apron': 'Stained Apron',
        'cowboy hat': 'Cowboy Hat',
        'heart locket': 'Heart Locket',
        'the locket': 'The Locket'
    },
    itemLvThreshold: {
        'spider donut': 1,
        'spider cider': 1,

        'nice cream': 2,
        'bisicle': 2,
        'cinnamon bunny': 2,
        'tough glove': 2,
        'manly bandanna': 2,

        'crab apple': 3,
        'sea tea': 3,
        'temmie flakes': 3,
        'torn notebook': 3,
        'cloudy glasses': 3,

        'temmie armor': 4,
        'hot dog...?': 4,

        'junk food': 5,
        'starfait': 5,
        'glamburger': 5,
        'legendary hero': 5,
        "steak in the shape of mettaton's face": 5,
        'empty gun': 5,
        'cowboy hat': 5,

        'popato chisps': 6
    },
    consumableItems: {
        'bandage': 10,
        'monster candy': 10,
        'spider donut': 12,
        'spider cider': 24,
        'butterscotch pie': 99,
        'snail pie': 98,
        'snowman piece': 45,
        'nice cream': 15,
        'bisicle': 11,
        'unisicle': 11,
        'cinnamon bunny': 22,
        'astronaut food': 21,
        'crab apple': 18,
        'sea tea': 10,
        'abandoned quiche': 34,
        'temmie flakes': 2,
        'dog salad': 2,
        'instant noodles': 4,
        'hot dog...?': 20,
        'hot cat': 21,
        'junk food': 17,
        'hush puppy': 65,
        'starfait': 14,
        'glamburger': 27,
        'legendary hero': 40,
        "steak in the shape of mettaton's face": 60,
        'popato chisps': 13,
        'bad memory': -1,
        'last dream': 17,

        // Unused items
        'puppydough icecream': 28,
        'pumpkin rings': 8,
        'croquet roll': 15,
        'ghost fruit': 16,
        'stoic onion': 5,
        'rock candy': 1
    },
    itemPrices: {
        // Consumable items
        'spider donut': 7,
        'spider cider': 18,
        'cinnamon bunny': 25,
        'crab apple': 25,
        'sea tea': 18,
        'temmie flakes': 1, // (ON SALE,) -  3G (Normal) -  20G (expensiv) -  1000G (premiem, Genocide Route exclusive)
        'hot dog...?': 30,
        'junk food': 25,
        'starfait': 60,
        'glamburger': 120,
        'legendary hero': 300,
        "steak in the shape of mettaton's face": 500,
        'popato chisps': 25,

        // Weapons
        'tough glove': 50,
        'torn notebook': 55,
        'empty gun': 350,

        // Armor
        'manly bandanna': 50,
        'cloudy glasses': 35,
        'cowboy hat': 350
    }
}
