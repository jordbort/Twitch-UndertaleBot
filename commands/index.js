const { attemptFight } = require(`./fight`)
const { attemptAct } = require(`./act`)
const { getPrices, attemptSellItem, attemptDropItem, attemptBuyItem, attemptUseItem } = require(`./item`)
const { attemptMercy } = require(`./mercy`)

const { portraitMode, landscapeMode, toggleDebugMode, playersReset, playersTrueReset, reviveDummy } = require(`./settings`)
const { showPlayers, getHP, getGold, getNext, getWeapon, getArmor, getExp, handleCheck } = require(`./stats`)
const { handleRecruit, handleUnrecruit, handlePart, handleJoin, handleKnownJoin } = require(`./signup`)
const { getDocs, getHelp, getCommands } = require(`./help`)
const { getSansFace, printLogo } = require(`./graphics`)
const { handleSave, handleLoad } = require(`./save`)
const { getSpamtonQuote } = require(`./quotes`)
const { getIntroText } = require(`./utils`)

module.exports = {
    '!fight': attemptFight,
    '!attack': attemptFight,

    '!act': attemptAct,

    '!item': attemptUseItem,
    '!items': attemptUseItem,
    '!use': attemptUseItem,
    '!equip': attemptUseItem,

    '!buy': attemptBuyItem,
    '!get': attemptBuyItem,
    '!shop': attemptBuyItem,

    '!sell': attemptSellItem,
    '!drop': attemptDropItem,

    '!price': getPrices,
    '!prices': getPrices,

    '!mercy': attemptMercy,
    '!spare': attemptMercy,

    '!save': handleSave,
    '!load': handleLoad,

    '!commands': getCommands,
    '!help': getHelp,
    '!docs': getDocs,

    '!join': handleJoin,
    '!part': handlePart,
    '!recruit': handleRecruit,
    '!unrecruit': handleUnrecruit,
    '!connect': handleKnownJoin,

    '!memory': showPlayers,
    '!players': showPlayers,

    '!hp': getHP,
    '!gold': getGold,
    '!next': getNext,
    '!weapon': getWeapon,

    '!armor': getArmor,
    '!armour': getArmor,

    '!exp': getExp,
    '!experience': getExp,

    '!logo': printLogo,
    '!undertale': printLogo,
    '!sans': getSansFace,

    '!check': handleCheck,
    '!stats': handleCheck,
    '!stat': handleCheck,
    '!status': handleCheck,

    '!intro': getIntroText,

    '!spamton': getSpamtonQuote,

    '!revive': reviveDummy,
    '!portrait': portraitMode,
    '!landscape': landscapeMode,
    '!debug': toggleDebugMode,

    '!reset': playersReset,

    '!truereset': playersTrueReset
}
