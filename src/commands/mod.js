const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('../utils/moderationStore');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('Moderation commands for warns and bans')
    .addSubcommand(subcommand =>
      subcommand
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Duration').setChoices(
          { name: 'Permanent', value: 'Permanent' },
          { name: '1 Tag', value: '1 Tag' },
          { name: '3 Tage', value: '3 Tage' },
          { name: '7 Tage', value: '7 Tage' },
          { name: '14 Tage', value: '14 Tage' },
          { name: '30 Tage', value: '30 Tage' },
        ))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('log')
        .setDescription('Show moderation log for this server')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (subcommand === 'warn') {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      const entry = store.createWarn({
        guildId,
        targetId: user.id,
        targetName: user.tag,
        modId: interaction.user.id,
        modName: interaction.user.tag,
        reason,
      });

      const embed = new EmbedBuilder()
        .setColor('#f0b232')
        .setTitle('⚠️ Warning issued')
        .setDescription(`${user.tag} was warned for: ${reason}`)
        .addFields({ name: 'Moderator', value: interaction.user.tag }, { name: 'Status', value: entry.active ? 'Active' : 'Revoked' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (subcommand === 'ban') {
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      const duration = interaction.options.getString('duration') || 'Permanent';
      const entry = store.createBan({
        guildId,
        targetId: user.id,
        targetName: user.tag,
        modId: interaction.user.id,
        modName: interaction.user.tag,
        reason,
        duration,
      });

      const embed = new EmbedBuilder()
        .setColor('#da373c')
        .setTitle('🔨 Ban issued')
        .setDescription(`${user.tag} was banned for: ${reason}`)
        .addFields({ name: 'Moderator', value: interaction.user.tag }, { name: 'Duration', value: duration }, { name: 'Status', value: entry.active ? 'Active' : 'Revoked' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (subcommand === 'log') {
      const entries = store.getEntries(guildId);
      const embed = new EmbedBuilder()
        .setColor('#5865f2')
        .setTitle('📋 Moderation Log')
        .setDescription(entries.length ? 'Latest moderation actions for this server' : 'No moderation actions yet.')
        .setTimestamp();

      if (entries.length) {
        const lines = entries.slice(0, 10).map(entry => {
          const label = entry.type === 'warn' ? 'WARN' : 'BAN';
          return `**${label}** ${entry.targetName} · ${entry.reason} · ${entry.modName}`;
        });
        embed.addFields({ name: 'Recent entries', value: lines.join('\n') });
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
