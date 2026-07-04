const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { parseDurationToMs } = require('../utils/time');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user')
    .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration like 10m, 2h, 1d').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const ms = parseDurationToMs(duration);

    if (!ms) {
      return interaction.reply({ content: '⚠️ Use a valid duration like 10m, 2h or 1d.', ephemeral: true });
    }

    const guild = interaction.guild;
    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return interaction.reply({ content: '❌ Could not find this member.', ephemeral: true });
    }

    const timeoutMs = Math.min(ms, 28 * 24 * 60 * 60 * 1000);
    await member.timeout(timeoutMs, reason);

    const embed = new EmbedBuilder()
      .setColor('#f0b232')
      .setTitle('🔇 User muted')
      .setDescription(`${user.tag} was muted for ${duration}.`)
      .addFields({ name: 'Reason', value: reason });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
