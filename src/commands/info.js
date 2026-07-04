const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Track bot start time
let botStartTime = Date.now();

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function countOpenTickets(guild) {
  try {
    return guild.channels.cache.filter(ch => ch.name.startsWith('ticket-')).size;
  } catch {
    return 0;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Display bot and server statistics'),

  async execute(interaction) {
    const guild = interaction.guild;
    const client = interaction.client;

    // Get package version
    const packagePath = path.join(__dirname, '../../package.json');
    let version = '1.0.0';

    try {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      version = pkg.version || '1.0.0';
    } catch (err) {
      console.error('Error reading package.json:', err);
    }

    // Uptime
    const uptimeMs = Date.now() - botStartTime;
    const uptime = formatUptime(uptimeMs);

    // Ping
    const ping = client.ws.ping;

    // Tickets
    const openTickets = countOpenTickets(guild);

    // Members
    const memberCount = guild.memberCount || guild.members.cache.size;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🌙 Lunaris Hub Bot')
      .setDescription('Bot and Server Statistics')
      .addFields(
        { name: '⚡ Ping', value: `${ping}ms`, inline: true },
        { name: '🤖 Version', value: version, inline: true },
        { name: '📅 Uptime', value: uptime, inline: true },
        { name: '🎫 Tickets Open', value: `${openTickets}`, inline: true },
        { name: '👥 Members', value: `${memberCount}`, inline: true },
        { name: '📊 Server', value: `${guild.name}`, inline: true }
      )
      .setFooter({ text: 'Powered by Orion Studios' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};

// Update bot start time
if (!global.botStartTime) {
  global.botStartTime = Date.now();
  botStartTime = Date.now();
}