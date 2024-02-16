import dotenv from 'dotenv';
import pkg, { Interaction } from 'discord.js';
import { processPostRequest } from './scrapeProfileData';
const { Client, IntentsBitField, AttachmentBuilder } = pkg;

dotenv.config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online `);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'perfil') {
    const url = interaction.options.get('url')?.value as string;

    await interaction.deferReply();

    console.log('url enviada por el usuario: ', url);

    const res = await processPostRequest(url);

    console.log('datos obtenidos: ', res);

    const resString = JSON.stringify(res, null, 2);
    if (resString.length <= 2000) {
      await interaction.editReply(resString);
    } else {
      const buffer = Buffer.from(resString, 'utf-8');
      const attachment = new AttachmentBuilder(buffer, {
        name: 'profile.json',
      });
      await interaction.editReply({
        content: 'The response is too large to display here. Please see the file.',
        files: [attachment],
      });
    }
  }
});

client.login(process.env.TOKEN);
