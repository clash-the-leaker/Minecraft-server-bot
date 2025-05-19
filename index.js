require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

// Bot ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Command handler
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

// Button interaction handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'toggle_server') {
    const embed = interaction.message.embeds[0];
    let isOn = embed.description.includes('**ON**');
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

// Web server for Railway/uptime check
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Web server is running on port ${PORT}`));

// Login to Discord
client.login(process.env.BOT_TOKEN);
