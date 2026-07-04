const express = require('express');
const store = require('./moderationStore');

function createApi(client) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.get('/api/moderation/:guildId', (req, res) => {
    res.json({
      guildId: req.params.guildId,
      entries: store.getEntries(req.params.guildId),
      summary: store.getSummary(req.params.guildId),
    });
  });

  app.post('/api/moderation/:guildId/warn', (req, res) => {
    const entry = store.createWarn({
      guildId: req.params.guildId,
      targetId: req.body.targetId,
      targetName: req.body.targetName,
      modId: req.body.modId,
      modName: req.body.modName,
      reason: req.body.reason,
    });
    res.json(entry);
  });

  app.post('/api/moderation/:guildId/ban', (req, res) => {
    const entry = store.createBan({
      guildId: req.params.guildId,
      targetId: req.body.targetId,
      targetName: req.body.targetName,
      modId: req.body.modId,
      modName: req.body.modName,
      reason: req.body.reason,
      duration: req.body.duration,
    });
    res.json(entry);
  });

  app.post('/api/moderation/:guildId/toggle/:type', (req, res) => {
    const { type } = req.params;
    const { id } = req.body;
    if (type === 'warn') {
      return res.json(store.toggleWarn(id, req.params.guildId));
    }
    if (type === 'ban') {
      return res.json(store.toggleBan(id, req.params.guildId));
    }
    res.status(400).json({ error: 'Unknown type' });
  });

  app.delete('/api/moderation/:guildId/:type/:id', (req, res) => {
    const { type, id } = req.params;
    store.deleteEntry(type === 'warn' ? 'warn' : 'ban', id, req.params.guildId);
    res.json({ success: true });
  });

  return app;
}

module.exports = { createApi }; 
