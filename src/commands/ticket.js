const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Manage the ticket system')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Richte das Ticket-System ein')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel for the ticket panel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Schließe dieses Ticket')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      const channel = interaction.options.getChannel('channel');

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🎫 Ticket System')
        .setDescription('Choose a ticket category from the menu below to open a new ticket. Our team will assist you as soon as possible.')
        .setTimestamp();

      const select = new StringSelectMenuBuilder()
        .setCustomId('ticket_category_select')
        .setPlaceholder('Choose a category...')
        .addOptions([
          { label: 'Support', description: 'General support', value: 'support', emoji: '🛠️' },
          { label: 'VIP', description: 'VIP requests', value: 'vip', emoji: '👑' },
          { label: 'Bug Report', description: 'Report a bug', value: 'bug', emoji: '🪱' },
          { label: 'Suggestion', description: 'Submit an idea', value: 'suggestion', emoji: '💡' },
          { label: 'Pack Request', description: 'Request a pack', value: 'pack', emoji: '📦' },
        ]);

      const row = new ActionRowBuilder().addComponents(select);

      try {
        await channel.send({ embeds: [embed], components: [row] });
        const replyOpts = { content: `✅ Ticket panel created in ${channel}`, flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      } catch (error) {
        console.error(error);
        const replyOpts = { content: '❌ Failed to create ticket panel!', flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }

    if (subcommand === 'close') {
      if (!interaction.channel.name.startsWith('ticket-')) {
        const replyOpts = { content: '❌ Dies ist kein Ticket-Channel!', flags: 64 };
        if (interaction.replied || interaction.deferred) return interaction.followUp(replyOpts);
        return interaction.reply(replyOpts);
      }

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('confirm_close')
            .setLabel('Bestätigen')
            .setStyle(ButtonStyle.Danger)
        );

      const replyOpts = { content: '⚠️ Möchtest du dieses Ticket wirklich schließen?', components: [row], flags: 64 };
      if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
      else await interaction.reply(replyOpts);
    }
  },
};
