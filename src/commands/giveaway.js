const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Verwalte Giveaways')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Starte ein Giveaway')
        .addStringOption(option =>
          option.setName('prize').setDescription('Der Preis').setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('duration').setDescription('Dauer in Minuten').setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('winners').setDescription('Anzahl der Gewinner').setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'start') {
      const prize = interaction.options.getString('prize');
      const duration = interaction.options.getInteger('duration');
      const winners = interaction.options.getInteger('winners');

      const endTime = Date.now() + duration * 60 * 1000;

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('🎉 GIVEAWAY 🎉')
        .setDescription(`**Preis:** ${prize}\n\n**Ende:** <t:${Math.floor(endTime / 1000)}:R>`)
        .addFields(
          { name: 'Gewinner', value: `${winners}`, inline: true },
          { name: 'Verwalter', value: `${interaction.user}`, inline: true }
        )
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('enter_giveaway')
            .setLabel('Teilnehmen')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✨')
        );

      const message = await interaction.channel.send({ embeds: [embed], components: [row] });

      // Auto-finish nach der angegebenen Zeit
      setTimeout(async () => {
        try {
          const fullMessage = await interaction.channel.messages.fetch(message.id);
          const reactions = fullMessage.reactions.cache.first();

          if (!reactions) {
            await interaction.channel.send('❌ Keine Teilnehmer für das Giveaway!');
            return;
          }

          const users = await reactions.users.fetch();
          const participants = users.filter(user => !user.bot).map(user => user);

          if (participants.length === 0) {
            await interaction.channel.send('❌ Keine gültigen Teilnehmer!');
            return;
          }

          const selectedWinners = [];
          for (let i = 0; i < Math.min(winners, participants.length); i++) {
            const randomIndex = Math.floor(Math.random() * participants.length);
            selectedWinners.push(participants[randomIndex]);
            participants.splice(randomIndex, 1);
          }

          const winnerText = selectedWinners.map(user => user.toString()).join(', ');

          const winnerEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🏆 Giveaway Gewinner!')
            .setDescription(`**Preis:** ${prize}\n**Gewinner:** ${winnerText}`)
            .setTimestamp();

          await interaction.channel.send({ embeds: [winnerEmbed] });
        } catch (error) {
          console.error('Giveaway Error:', error);
        }
      }, duration * 60 * 1000);

      const replyOpts = { content: `✅ Giveaway for **${prize}** started!`, flags: 64 };
      if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
      else await interaction.reply(replyOpts);
    }
  },
};
