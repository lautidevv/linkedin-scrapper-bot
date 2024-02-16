require('dotenv').config()

// este es el indice de emojis que cree en base a los emojis del server de la comunidad
// hay que tener en cuenta que los bots acceden a los emojis del servidor por su id.
const emojisIndex = {
    ".net": "\:net:1207123156196786196",
    "C#": "\:C_:1207123045303455784",
    "C++": "\:C_:1207123045303455784",
    "QA": "\:QA:1207129410222948382",
    "adonisjs": "\:adonisjs:1207123167626403910",
    "android": "\:android:1207129412030570566",
    "angular": "\:angular:1207123624515866634",
    "blazor": "\:blazor:1207123143991369758",
    "dart": "\:dart:1207123146151436308",
    "django": "\:django:1207123147808182392",
    "docker": "\:docker:1207123149317996594",
    "fluter": "\:fluter:1207123046704357507",
    "git": "\:git:1207123169622884392",
    "github": "\:git:1207123169622884392",
    "go": "\:go:1207126527318433852",
    "html5": "\:htmlycss:1207123334945447966",
    "html": "\:htmlycss:1207123334945447966",
    "css": "\:htmlycss:1207123334945447966",
    "ionic": "\:ionic:1207123151126007849",
    "java": "\:java:1207123418827456562",
    "js": "\:javascript:1207123049883897936",
    "javascript": "\:javascript:1207123049883897936",
    "kotlin": "\:kotlin:1207123152824438874",
    "python": "\:python:1207123163872497684",
    "postgresql": "\:postgresql:1207123947368349736",
    "postgres": "\:postgresql:1207123947368349736",
    "php": "\:php:1207123160110071881",
    "node": "\:node:1207123898156712006",
    "nodejs": "\:node:1207123898156712006",
    "nextjs": "\:nextjs:1207126876544573470",
    "mysql": "\:mysql:1207123154477121576",
    "mongo": "\:mongo:1207123142556913705",
    "laravel": "\:laravel:1207123141038444574",
    "reactjs": "\:reactjs:1207123333334700112",
    "react": "\:reactjs:1207123333334700112",
    "rust": "\:rust:1207128502130839612",
    "spring": "\:spring:1207123255048011817",
    "sql": "\:sql:1207123256545509497",
    "swagger": "\:swagger:1207123258109861948",
    "swift": "\:swift:1207123259603292190",
    "symfony": "\:symfony:1207123261033418863",
    "ts": "\:ts:1207123262493163570",
    "typescript": "\:ts:1207123262493163570",
    "unity": "\:unity:1207123263944265728",
    "vue": ":vue:1207123266771226694",
}

// para el proximo paso, voy a hacer un indice de roles que se van a poder asignar
// const rolesIndex = ["Frontend", "Backend"];

const {Client, IntentsBitField} = require('discord.js')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

client.on('ready',async (c) => {
    console.log(`✅ ${c.user.tag} is online `)
    // ver de recuperar el listado de emojis del servi
    // const emojiList = await fetch(`https://discord.com/api/v9/guilds/${process.env.GUILD_ID}/emojis`).then(res => res.json());
    // console.log(emojiList)
})

// ante cada mensaje que se envie en el servidor:
client.on('messageCreate', async (message) => {
    // si es un bot no responder
    if (message.author.bot) return

   

    // Parsing logic to extract emojis and developer roles
    const extractedEmojis = [];
    // const extractedRoles = [];

    // Loop through emojisIndex to find matching emojis
    for (const [key, value] of Object.entries(emojisIndex)) {
        const regex = new RegExp(`(?:^|\\s|,|;|\\.|!|\\?)${key}(?:$|\\s|,|;|\\.|!|\\?)`, 'i');
        if (regex.test(message.content)) {
            console.log('encontre: ', key);
            extractedEmojis.push(key);
        }
    }

    // Loop through rolesIndex to find matching roles
    // rolesIndex.forEach(role => {
    //     if (message.content.toLowerCase().includes(role.toLowerCase())) {
    //         extractedRoles.push(role);
    //     }
    // })

    // Returning the response in JSON format
    const response = {
        emojis: extractedEmojis,
        // roles: extractedRoles
    };

    try {
        // Loop through the emojis array and react to the message with each one
        for (const emoji of response.emojis) {
            console.log('reaccionando con: ', emojisIndex[emoji])
            await message.react(`\\${emojisIndex[emoji]}`);
        }
      } catch (error) {
        console.error(error); // Log any errors that occur during the reaction process
      }

    // if (message.content === 'Hola' || message.content === 'hola') {
    //     message.reply('Hola!!')
    //     message.react('\<:svelte:1018942335112978572>')
    // }
})


client.login(process.env.TOKEN)