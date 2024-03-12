const { settings, startDate, startTime, boldTxt, resetTxt } = require(`../config`)
const { players, playerSave, highestLevels } = require(`../data`)

const fs = require(`fs`)

function renderArr(arr, arrName, indentation = ``) {
    const tab = `${indentation}\t`
    const data = [`${arrName}: [`]
    if (arr.length) {
        const entry = arr.map((val) => {
            return typeof val === `string`
                ? `${tab}'${val}'`
                : typeof val === `object` && val !== null
                    ? Array.isArray(val)
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
                : typeof obj[key] === `object` && obj[key] !== null && key !== `respawnTimer`
                    ? Array.isArray(obj[key])
                        ? `${tab}${renderArr(obj[key], key, tab)}`
                        : `${tab}${renderObj(obj[key], key, tab)}`
                    : `${tab}${key}: ${obj[key]}`
        }).join(`,\n`)
        data.push(keys)
        data.push(`${indentation}}`)
    } else { data[0] += `}` }
    return data.join(`\n`)
}

module.exports = {
    makeLogs(channels) {
        if (settings.debug) { console.log(`${boldTxt}> makeLogs(channels: ${channels})${resetTxt}`) }
        let data = `+---------------+\n| UNDERTALE BOT |\n+---------------+\nSession started: ${startDate} at ${startTime}\n`

        data += `\n${renderArr(channels, `Current channels`)}\n`

        const objectsToLog = [
            [settings, `settings`],
            [players, `players`],
            [playerSave, 'playerSave'],
            [highestLevels, `highestLevels`]
        ]
        for (const [obj, objName] of objectsToLog) { data += `\n${renderObj(obj, objName)}\n` }

        fs.writeFile(`logs.txt`, data, (err) => {
            if (err) { console.log(`Error writing logs:`, err) }
        })
    }
}
