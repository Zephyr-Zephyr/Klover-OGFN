const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a simple poll')
    .addStringOption(option => option.setName('question').setDescription('Poll question').setRequired(true))
    .addStringOption(option => option.setName('options').setDescription('Comma-separated answers').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = interaction.options.getString('options').split(',').map(item => item.trim()).filter(Boolean);

    if (options.length < 2) {
      return interaction.reply({ content: '⚠️ Please provide at least 2 options separated by commas.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle('📊 Poll')
      .setDescription(question)
      .addFields(options.map((option, index) => ({ name: `${index + 1}.`, value: option, inline: false })));

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('poll_yes').setLabel('Yes').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId('poll_no').setLabel('No').setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
