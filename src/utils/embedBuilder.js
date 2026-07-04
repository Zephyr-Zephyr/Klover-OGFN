const { EmbedBuilder } = require('discord.js');

function createSuccessEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function createErrorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function createInfoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

function createWarnEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#ffff00')
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

module.exports = {
  createSuccessEmbed,
  createErrorEmbed,
  createInfoEmbed,
  createWarnEmbed,
};
