const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const configPath = path.join(__dirname, '../../config.json');
    let config = {};

    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    if (!config.welcomeChannel) return;

    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannel);
    if (!welcomeChannel) return;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🌙 Welcome to Lunaris')
      .setDescription(
        config.welcomeMessage
          ? config.welcomeMessage.replace('{user}', `${member}`)
          : `Welcome to our server, ${member}! Please verify to get access.`
      )
      .addFields({ name: '📋 Rules', value: 'Read the rules and stay respectful.' })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `User ID: ${member.id}` })
      .setTimestamp();
    try {
      await welcomeChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  },
};
