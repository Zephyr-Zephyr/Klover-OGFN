const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to a channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel for the announcement').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('Announcement title').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Announcement message').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Optional role to mention').setRequired(false))
    .addBooleanOption(option => option.setName('ping_everyone').setDescription('Mention @everyone (use with caution)').setRequired(false))
    .addStringOption(option => option.setName('image').setDescription('Optional image URL for the embed').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const role = interaction.options.getRole('role');
    const pingEveryone = interaction.options.getBoolean('ping_everyone');
    const image = interaction.options.getString('image');

    if (!channel?.isTextBased?.()) {
      return interaction.reply({ content: '⚠️ Bitte wähle einen Textkanal aus.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .setTimestamp();

    if (image) {
      try {
        embed.setImage(image);
      } catch (err) {
        // ignore invalid image URLs
      }
    }

    // Build content and allowed mentions
    let content = undefined;
    const allowedMentions = { parse: [], roles: [] };

    if (role) {
      content = `${role}`;
      allowedMentions.roles.push(role.id);
    } else if (pingEveryone) {
      content = '@everyone';
      allowedMentions.parse.push('everyone');
    }

    await channel.send({ content, embeds: [embed], allowedMentions: Object.keys(allowedMentions).length ? allowedMentions : undefined });
    await interaction.reply({ content: `✅ Ankündigung gesendet in ${channel}.`, ephemeral: true });
  },
};
