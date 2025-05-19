const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionType } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!togglestatus') {
    const embed = new EmbedBuilder()
      .setTitle('Server Status')
      .setDescription('Server is currently **OFF**')
      .setColor('Red');

    const toggleButton = new ButtonBuilder()
      .setCustomId('toggle_server')
      .setLabel('Turn ON')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(toggleButton);

    await message.reply({ embeds: [embed], components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'toggle_server') {
    const embed = interaction.message.embeds[0];
    let isOn = embed.description.includes('**ON**');

    // Toggle state
    isOn = !isOn;

    const newEmbed = new EmbedBuilder()
      .setTitle('Server Status')
      .setDescription(`Server is currently **${isOn ? 'ON' : 'OFF'}**`)
      .setColor(isOn ? 'Green' : 'Red');

    const newButton = new ButtonBuilder()
      .setCustomId('toggle_server')
      .setLabel(isOn ? 'Turn OFF' : 'Turn ON')
      .setStyle(isOn ? ButtonStyle.Danger : ButtonStyle.Primary);

    const newRow = new ActionRowBuilder().addComponents(newButton);

    await interaction.update({ embeds: [newEmbed], components: [newRow] });
  }
});
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('Web server is running'));
const http = require('http');

setInterval(() => {
  http.get('http://localhost:3000');  // Ping your own Express server internally
}, 1* 60 * 1000); // every 1 minutes

client.login(process.env.BOT_TOKEN);

