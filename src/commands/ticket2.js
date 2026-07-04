const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket2')
    .setDescription('Create an improved ticket system panel')
    .addChannelOption(option => option.setName('channel').setDescription('Channel for the ticket panel').setRequired(true)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('🎫 Support Ticket')
      .setDescription('Open a support ticket by clicking below.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('open_ticket').setLabel('Open Ticket').setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ticket panel created in ${channel}.`, ephemeral: true });
  },
};
