function containsDiscordInvite(text) {
  const invitePattern = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com\/invite)|discordapp\.com\/invite)\/[a-zA-Z0-9-]+/i;
  return invitePattern.test(text || '');
}

function getModerationReason(text) {
  return text && text.trim() ? text.trim() : 'No reason provided';
}

module.exports = {
  containsDiscordInvite,
  getModerationReason,
};
