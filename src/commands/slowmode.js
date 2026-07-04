const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set a slowmode for the current channel')
    .addIntegerOption(option => option.setName('seconds').setDescription('Slowmode duration in seconds').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply({ content: `⏱️ Slowmode set to ${seconds} seconds.`, ephemeral: true });
  },
};
