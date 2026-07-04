const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove a mute from a user')
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const guild = interaction.guild;
    const member = await guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Could not find this member.', ephemeral: true });
    }

    await member.timeout(null);
    const embed = new EmbedBuilder().setColor('#23a559').setTitle('🔊 User unmuted').setDescription(`${user.tag} is no longer muted.`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
