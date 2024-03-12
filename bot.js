require(`dotenv`).config()

const client = require(`./client`)

const { announceCrash } = require(`./commands/utils`)

process.on(`uncaughtException`, async (err) => {
    await announceCrash(client)
    console.error(err)
    process.exit(1)
})

client.connect()
