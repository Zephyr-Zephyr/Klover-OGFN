const { REST, Routes } = require('discord.js');

function getCommandsPayload(commands) {
  const seen = new Set();
  return (commands || [])
    .map(command => command.data?.toJSON())
    .filter(Boolean)
    .filter(command => {
      if (!command.name || seen.has(command.name)) return false;
      seen.add(command.name);
      return true;
    });
}

async function registerCommands(client, commands, env = process.env) {
  const commandData = getCommandsPayload(commands);
  if (!commandData.length) {
    return { registered: 0, scope: 'none' };
  }

  const token = env.DISCORD_TOKEN;
  if (!token) {
    throw new Error('DISCORD_TOKEN is not set');
  }

  const clientId = client?.user?.id;
  if (!clientId) {
    throw new Error('Client is not ready yet');
  }

  const rest = new REST({ version: '10' }).setToken(token);

  if (env.GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(clientId, env.GUILD_ID), {
      body: commandData,
    });
    return { registered: commandData.length, scope: `guild:${env.GUILD_ID}` };
  }

  await rest.put(Routes.applicationCommands(clientId), {
    body: commandData,
  });

  return { registered: commandData.length, scope: 'global' };
}

module.exports = {
  getCommandsPayload,
  registerCommands,
};
