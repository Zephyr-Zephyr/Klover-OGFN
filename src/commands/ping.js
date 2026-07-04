const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Zeigt die Bot-Latenz an'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🏓 Pong!')
      .setDescription(`Latenz: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latenz: ${interaction.client.ws.ping}ms`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
