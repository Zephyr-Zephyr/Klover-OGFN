const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show user information')
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild?.members.cache.get(user.id) || null;

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: 'Joined', value: member?.joinedAt ? member.joinedAt.toLocaleDateString('de-DE') : 'Unknown', inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
