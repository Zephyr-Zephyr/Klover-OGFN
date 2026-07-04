const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show available bot commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('🤖 Available commands')
      .setDescription('Here are the most important commands:')
      .addFields(
        { name: '/info', value: 'Bot and server stats' },
        { name: '/clear', value: 'Delete messages' },
        { name: '/mute', value: 'Mute a user' },
        { name: '/unmute', value: 'Unmute a user' },
        { name: '/kick', value: 'Kick a user' },
        { name: '/slowmode', value: 'Set a slowmode' },
        { name: '/userinfo', value: 'Show user info' },
        { name: '/serverinfo', value: 'Show server info' },
        { name: '/poll', value: 'Create a poll' },
        { name: '/security scan', value: 'Scan for invite links' },
        { name: '/mod warn|ban|log', value: 'Moderation log and actions' }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
