const { ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const replyOpts = { content: '❌ Es gab einen Fehler beim Ausführen des Befehls!', flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }

    // Button Interactions
    if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        const replyOpts = { content: 'This ticket menu is legacy; please use the category menu.', flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }

      if (interaction.customId === 'confirm_close') {
        await interaction.channel.delete().catch(err => {
          console.error('Fehler beim Löschen des Channels:', err);
        });
      }

      if (interaction.customId === 'enter_giveaway') {
        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('✨ Giveaway!')
          .setDescription('You have entered the giveaway! Good luck! 🍀')
          .setTimestamp();

        const replyOpts = { embeds: [embed], flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);

        // React to track participation
        await interaction.message.react('✨');
      }

      

      if (interaction.customId === 'open_ticket') {
        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: ['ViewChannel'] },
            { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
          ],
        });

        const embed = new EmbedBuilder()
          .setColor('#5865f2')
          .setTitle('🎫 New support ticket')
          .setDescription(`Hi ${interaction.user}, your ticket is ready. Describe your issue and a staff member will assist shortly.`);

        await ticketChannel.send({ content: `${interaction.user}`, embeds: [embed] });
        const replyOpts = { content: `✅ Your ticket channel was created: ${ticketChannel}`, flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }

    // Select Menu Interactions (ticket category)
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_category_select') {
        const choice = interaction.values[0];
        const categoryMap = {
          support: 'Support',
          vip: 'VIP',
          bug: 'Bug-Report',
          suggestion: 'Suggestion',
          pack: 'Pack-Request',
        };

        const ticketChannel = await interaction.guild.channels.create({
          name: `ticket-${interaction.user.username}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: ['ViewChannel'],
            },
            {
              id: interaction.user.id,
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
            },
          ],
        });

        const embed = new EmbedBuilder()
          .setColor('#00ff00')
          .setTitle(`🎫 ${categoryMap[choice]} Ticket`)
          .setDescription(`Hello ${interaction.user}, your ${categoryMap[choice]} ticket has been created. Our team will be with you shortly.`)
          .setTimestamp();

        await ticketChannel.send({ content: `${interaction.user}`, embeds: [embed] });

        const replyOpts = { content: `✅ Your ${categoryMap[choice]} ticket was created: ${ticketChannel}`, flags: 64 };
        if (interaction.replied || interaction.deferred) await interaction.followUp(replyOpts);
        else await interaction.reply(replyOpts);
      }
    }
  },
};
