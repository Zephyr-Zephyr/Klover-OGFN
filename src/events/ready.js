const { registerCommands } = require('../utils/commandRegistrar');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Bot ist online als ${client.user.tag}`);
    console.log(`📊 Bot ist auf ${client.guilds.cache.size} Servern aktiv`);

    try {
      const rawCommands = client.commands && typeof client.commands.values === 'function'
        ? Array.from(client.commands.values())
        : client.commands
          ? Object.values(client.commands)
          : [];

      const result = await registerCommands(client, rawCommands);
      console.log(`🧩 Slash-Commands registriert (${result.scope}, ${result.registered} Befehle)`);
    } catch (error) {
      console.error('Fehler beim Registrieren der Commands:', error);
    }

    client.user.setActivity('Lunaris Ticket Bot', { type: 'WATCHING' });
  },
};
