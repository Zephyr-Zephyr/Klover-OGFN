const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Show server information'),

  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`🛡️ ${guild.name}`)
      .addFields(
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Text Channels', value: `${guild.channels.cache.filter(ch => ch.isTextBased()).size}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
