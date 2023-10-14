<img src="https://github.com/jordbort/Twitch-UndertaleBot/assets/115664302/2260e16a-0681-4ca3-9547-d90c968a5fc0" alt="UNDERTALE logo">

# UndertaleBot on Twitch
This is under development! It is a Twitch chatbot that simulates encounters in the game Undertale. While the bot is online, you can also visit its Twitch chat and type `!join` to make the bot active in your Twitch chat as well, at least until next time the bot is rebooted.

## How it works
When the bot is active in a Twitch channel, it keeps track of everyone sending messages in the chat. Upon speaking, each chat member is created with base stats. A dummy is also always initialized by the bot. Users can use commands to interact with the bot and other chat members, particularly in the style of the battle system from Undertale. Users can fight each other to deplete their HP. If a user "kills" another user, they can earn EXP and increase their LV, and if a user "dies", they lose the ability to use commands. Any user (dead or alive) can use the `!load` command to revert to their last SAVE.

## Main commands
`!fight @user` or `!attack @user`

This command attacks the user specified (or no one, if none specified). There is a 20% chance that you'll "miss", otherwise the ATK stat + weapon damage + a random number will be used to calculate damage, from which the DEF stat and armor bonuses are deducted. If the user kills a user, the bot also sends a message that the dead user should "stay determined..." When a player kills another user, they receive all their EXP and gold (if any), plus a base of 10 EXP. Users cannot use !fight if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory. If users try to fight the bot, it suggests that they try fighting the Dummy instead.

`!act @user`

This command uses flavor text from Undertale. Results will vary whether another user is specified or not, but for now the outcome has no real effect. Users cannot use !act if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

`!item` or `!items` or `!use`

If this command is used without any other text, it tells the user which item(s) they have in their inventory. Currently, every user spawns with one Monster Candy by default. If the user types the command followed by the name of an item in their inventory, they'll use the item. Some items are weapons or armor, and others are consumable and heal the user for some amount of HP. If a weapon or piece of armor is equipped, it will affect the user's AT and/or DF stats. Equipping the Burnt Pan causes consumable items to heal for an additional 4 HP, and the Stained Apron causes the wearer to recover 1 HP every other "turn". Users cannot use items if they are dead, but they can still use !item to check what was in their inventory.

`!mercy @user` or `!spare @user`

This command attempts to "spare" the user specified. If no user is specified, or the user tries to spare themself, nothing happens. There is only a 10% chance that it will work, in which case both users' HP is restored to max, and the user who invoked it also receives a random amount of gold. If the user's target has 10 or less HP remaining, the chance it will work increases to 25%, and 50% if their HP is 5 or less. Users cannot use !mercy if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

`!buy` or `!shop` or `!get`

If this command is used without an item name, it tells the user which items they are able to purchase. More items become available to purchase by the user as their LV increases. If the user types the command followed by the name of an item available to them, they'll spend their gold to buy it, unless they can't afford it. Purchased items can then be used or equipped with the !item command. Users cannot use !buy if they are dead.

`!save`

This command SAVEs the user's current status, which can then be loaded at any time with the !load command. Every user starts with a SAVE state of their base stats, but this command must be used to update that as they progress in the game. If a user dies, the only information retained in their SAVE is the user's weapon and armor. This is to prevent EXP farming by the user who killed them. Users cannot use !save if they are dead.

`!load`

This command loads the user's SAVE state. If the user hasn't used the !save command yet, the user reverts to their original SAVE, which is their base stats. Using this command is the only way to come back after being killed. It is not necessary to use this command to enter the game.

## Other commands
`!stats @user` or `!stat @user` or `!status @user`

This command checks the current stats of the user specified (or the user who used the command, if none is specified). Stats include LV, AT, DF, EXP, Next EXP to increase LV, Weapon, Armor, and Gold. This command cannot be used on a user that isn't in the bot's memory. Individual stats can also be checked with `!hp`, `!gold`, `!exp`, `!next`, `!weapon`, and `!armor`

`!intro`

This command uses random battle-starting text from Undertale. Some text is rarer than others, but it's all just for fun. Users cannot use !intro if they are dead.

`!spamton <number>`

This command returns a random Spamton quote from Deltarune. Optionally, a number (1-148) can be given for a specific quote.

`!memory`

This command returns a list of each chat member the bot has acknowledged in memory. This data is lost when the bot's server is dropped.

`!help`

This command posts a brief summary of why the bot exists and how to use it.

`!commands`

This command posts a short list of commonly-used commands to help new users get started.
