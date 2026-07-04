const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const guild = interaction.guild;
    const member = await guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Could not find this member.', ephemeral: true });
    }

    await member.kick(reason);
    const embed = new EmbedBuilder().setColor('#da373c').setTitle('👢 User kicked').setDescription(`${user.tag} was kicked.`).addFields({ name: 'Reason', value: reason });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
