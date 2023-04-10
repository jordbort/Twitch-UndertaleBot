# UndertaleBot on Twitch
This is under development! It is a Twitch chatbot that will eventually simulate Undertale-style battles. There is currently no way to add the bot to your Twitch channel, but listed below are the features that are currently being developed.

## How it works
When the bot is active in a Twitch channel, it keeps track of everyone active in the chat. Upon speaking, each chat member is created with base stats. A dummy is also always initialized by the bot. Users can use commands to interact with the bot and other chat members, particularly in the style of the battle system from Undertale. Users can fight each other to deplete their HP. If a user "kills" another user, they can earn EXP and increase their LV, and if a user "dies", they lose the ability to use commands. SPEED and INV are not used stats, and there is currently no use for gold. However, gold may be used in the future to purchase items, weapons, and armor.

## Main commands
`!fight @user`

This command attacks the user specified (or the user who used the command, if none is specified). There is a 25% chance that you'll "miss", otherwise the ATK stat + weapon damage + a random number will be used to calculate damage, from which the DEF stat and armor bonuses are deducted. If the user kills a user, the bot also sends a message that the dead user should "stay determined..." When a player kills another user, they receive their EXP and gold (if any), plus a base of 10 EXP. Users cannot use !fight if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

`!act @user`

This command uses flavor text from Undertale. Results will vary whether another user is specified or not, but for now the outcome has no real effect. Users cannot use !act if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

`!item @user`

This command gives a consumable item from Undertale to the user specified (or the user who used the command, if none is specified). Items heal for the same amount of HP as in the real game. Some items are more common/rare than others, including items that heal different amounts in different scenarios. Rare items include the Butterscotch-Cinnamon Pie, Snail Pie, Last Dream, certain instances of Dog Salad and Instant Noodles, Papyrus's spaghetti, and items removed from the final game before release. Users cannot use !item if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

`!mercy @user`

This command attempts to "spare" the user specified. If no user is specified, or the user tries to spare themself, nothing happens. There is only a 10% chance that it will work, in which case both users' HP is restored to max, and the user who invoked it also receives a random amount of gold. If the user's target has 10 or less HP remaining, the chance it will work increases to 25%, and 50% if their HP is 5 or less. Users cannot use !mercy if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

`!equip @user`

This command works like `!item`, except that it is used for weapons and armor, rather than consumable items. Some weapons/armor are more common/rare than others. Examples of rare weapons/armor include the Real Knife, the Locket and Heart Locket, the Temmie Armor, and some miscellaneous non-consumable items that aren't technically weapons or armor. If a weapon or piece of armor is equipped, it will affect the user's AT and/or DF stats. Using the Burnt Pan causes consumable items to heal for an additional 4 HP, and the Stained Apron causes the wearer to recover 1 HP every other "turn". Users cannot use !equip if they are dead, nor can the command be used on a dead user or a user that isn't in the bot's memory.

## Other commands
`!stats @user`

This command checks the current stats of the user specified (or the user who used the command, if none is specified). Stats include LV, AT, DF, EXP, Next EXP to increase LV, Weapon, Armor, and Gold. This command cannot be used on a user that isn't in the bot's memory.

`!spend`

This command allows the user to spend their gold. Gold currently has no use. Users cannot use !spend if they are dead.

`!spamton <number>`

This command returns a random Spamton quote from Deltarune. Optionally, a number (1-148) can be given for a specific quote.

`!memory`

This command returns a list of each chat member the bot has acknowledged in memory. This data is lost when the bot's server is dropped.

`!hp @user` (obsoleted by `!stats`)

This command checks the current HP of the user specified (or the user who used the command, if none is specified). If the user's HP is less than or equal to zero, the bot also indicates that the user is "dead".

`!gold @user` (obsoleted by `!stats`)

This command checks how much gold the user specified has (or the user who used the command, if none is specified). Gold currently has no use.
