const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel for the announcement').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('Announcement title').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Announcement message').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');

    if (!channel?.isTextBased?.()) {
      return interaction.reply({ content: '⚠️ Please select a text channel.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Announcement sent to ${channel}.`, ephemeral: true });
  },
};
