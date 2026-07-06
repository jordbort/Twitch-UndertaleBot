require(`dotenv`).config()

const client = require(`./client`)

const { announceCrash } = require(`./commands/utils`)

async function exit(err) {
    await announceCrash(client)
    console.error(err)
    process.exit(1)
}

process.on(`uncaughtException`, exit)
process.on(`unhandledRejection`, exit)

client.connect()
