<img src="https://github.com/jordbort/Twitch-UndertaleBot/assets/115664302/2260e16a-0681-4ca3-9547-d90c968a5fc0" alt="UNDERTALE logo">

# UndertaleBot on Twitch [(watch)](https://www.twitch.tv/undertalebot)
This is a Twitch chatbot that simulates encounters from the 2015 video game "Undertale" by Toby Fox, is hosted in the cloud, and sometimes livestreams.

You can visit its Twitch chat and type `!join` to make the bot active in your Twitch chat as well at any time. Commands always are live, but additionally the bot may simultaneously be live streaming its terminal output, which has a UI and simple graphics.

## How it works
When the bot is active in a Twitch channel, it keeps track of everyone sending messages in the chat. Upon speaking, each chat member is created with base-level stats. A dummy is also always initialized by the bot, which the dev can revive. Users can use commands to interact with the bot and toward players, particularly in the style of the battle system from Undertale. Users can `!act`, use an `!item`, `!mercy`, or `!fight` each other to deplete their HP. If a user "kills" another user, they can earn EXP and increase their LV, and if a user "dies", they lose the ability to use most commands. Any user (dead or alive) can use the `!load` command to revert to their last `!save`.

## Technologies used
- [JavaScript](https://javascript.com/)
- [Node.js](https://nodejs.org/)
- [tmi.js](https://tmijs.com)

Hosted on [Google Cloud](https://cloud.google.com/), streams from a [Raspberry Pi 5](https://www.raspberrypi.com/).

## Main commands
`!fight @user` or `!attack @user`

This command attacks the user specified (or no one, if none specified). There is a 20% chance that you'll "miss", otherwise the ATK stat + weapon damage + a random number will be used to calculate damage, from which the DEF stat and armor bonuses are deducted. If the user kills a user, the bot also sends a message that the dead user should "stay determined..." When a player kills another user, they receive all their EXP and gold (if any), plus a base of 10 EXP. Users cannot use `!fight` if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory. If users try to fight the bot, it suggests that they try fighting the Dummy instead.

`!act @user`

This command uses flavor text from Undertale. Results will vary whether another user is specified or not, but mostly has no impact on the game data. Users cannot use `!act` if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory. If users try to act with the bot, it suggests that they try acting with the Dummy instead.

`!item` or `!items` or `!use`

If this command is used without any other text, it tells the user which item(s) they have in their inventory. Currently, every user spawns with a Monster Candy and a Butterscotch Pie by default. If the user types `!item` followed by the name of an item in their inventory, they'll use the item. Some items are weapons or armor (therefore `!equip` also works), and others are consumable (heal the user for some amount of HP). If a weapon or piece of armor is equipped, it will affect the user's AT and/or DF stats. Equipping the Burnt Pan also causes consumable items to heal for an additional 4 HP, while the Stained Apron also causes the wearer to recover 1 HP every other "turn". Users cannot use items if they are dead, but they can still use `!item` to check what was in their inventory.

`!mercy @user` or `!spare @user`

This command attempts to "spare" the user specified. If no user is specified, or the user tries to spare themself, nothing happens. There is only a 10% chance that it will work, in which case both users' HP is restored to max, and the user who invoked it also receives a random amount of gold. If the user's target has 10 or less HP remaining, the chance it will work increases to 25%, and 50% if their HP is 5 or less. Users cannot use `!mercy` if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory. If users try to spare the bot, it suggests that they try sparing the Dummy instead.

`!buy` or `!shop` or `!get`

If this command is used without an item name, it tells the user which items they are able to purchase. More items from various shopkeepers become available to purchase by the user as their LV increases. If the user types the command followed by the name of an item available to them, they'll spend their gold to buy it, unless they can't afford it. Purchased items can then be used or equipped with the `!item` command. Users cannot buy items if they are dead.

`!save`

This command SAVEs the user's current status, which can then be loaded at any time with the `!load` command. Every user starts with a SAVE state of their base stats, but this command must be used to update that as they progress in the game. If a user dies, the only information retained in their SAVE is the user's weapon and armor. This is to prevent EXP farming. Users cannot SAVE if they are dead.

`!load`

This command loads the user's SAVE state. If the user hasn't used the `!save` command yet, the user reverts to their original SAVE, which is their base stats. Using this command is the only way to come back after being killed. It is not necessary to use this command to enter the game.

## Other commands
`!stats @user` or `!stat @user` or `!status @user`

This command checks the current stats of the user specified (or the user who used the command, if none is specified). Stats include LV, HP, AT, DF, EXP, Next EXP to increase LV, Weapon, Armor, and Gold. This data is also output to the terminal. This command cannot be used on a user that isn't in the bot's memory. Individual stats can also be checked with `!hp`, `!gold`, `!exp`, `!next`, `!weapon`, and `!armor`.

`!intro`

This command uses random battle-starting text from Undertale. Some text is rarer than others, but it's all just for fun. Users cannot use introduce themselves if they are dead.

`!spamton <number>`

This command returns a random Spamton quote from Deltarune. Optionally, a number (1-148) can be provided for a specific quote.

`!memory` or `!players`

This command returns a list of each chat member the bot has acknowledged in memory. This data is lost when the bot's server is rebooted.

`!help`

This command posts a brief summary of why the bot exists and how to use it.

`!commands`

This command posts a short list of commonly-used commands to help new users get started.
