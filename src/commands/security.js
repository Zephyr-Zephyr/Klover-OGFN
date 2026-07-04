const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { containsDiscordInvite, getModerationReason } = require('../utils/security');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('Security-related moderation tools')
    .addSubcommand(subcommand =>
      subcommand
        .setName('scan')
        .setDescription('Scan the latest messages for Discord invite links')
        .addIntegerOption(option => option.setName('limit').setDescription('How many messages to inspect').setRequired(false))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const limit = interaction.options.getInteger('limit') || 20;
    const messages = await interaction.channel.messages.fetch({ limit });
    const suspicious = messages.filter(message => containsDiscordInvite(message.content));

    const embed = new EmbedBuilder()
      .setColor('#da373c')
      .setTitle('🛡️ Security Scan')
      .setDescription(suspicious.size ? `Found ${suspicious.size} suspicious message(s).` : 'No suspicious invite links found.');

    if (suspicious.size) {
      const lines = suspicious.map(message => `- ${message.author.tag}: ${getModerationReason(message.content)}`).slice(0, 10);
      embed.addFields({ name: 'Matches', value: lines.join('\n') });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
