const fs = require('node:fs');
const path = require('node:path');

const dataPath = process.env.PULSE_DATA_PATH || path.join(__dirname, '../../data/moderation.json');

function ensureStore() {
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({ warns: [], bans: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(dataPath, JSON.stringify(store, null, 2));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createWarn(payload) {
  const store = readStore();
  const entry = {
    id: createId(),
    guildId: payload.guildId,
    targetId: payload.targetId,
    targetName: payload.targetName,
    modId: payload.modId,
    modName: payload.modName,
    reason: payload.reason,
    active: true,
    date: new Date().toISOString(),
    type: 'warn',
  };
  store.warns.unshift(entry);
  writeStore(store);
  return entry;
}

function createBan(payload) {
  const store = readStore();
  const entry = {
    id: createId(),
    guildId: payload.guildId,
    targetId: payload.targetId,
    targetName: payload.targetName,
    modId: payload.modId,
    modName: payload.modName,
    reason: payload.reason,
    duration: payload.duration || 'Permanent',
    active: true,
    date: new Date().toISOString(),
    type: 'ban',
  };
  store.bans.unshift(entry);
  writeStore(store);
  return entry;
}

function getEntries(guildId) {
  const store = readStore();
  const warns = (store.warns || []).filter(entry => entry.guildId === guildId);
  const bans = (store.bans || []).filter(entry => entry.guildId === guildId);
  return [...warns, ...bans].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getSummary(guildId) {
  const entries = getEntries(guildId);
  return {
    warns: {
      total: (entries || []).filter(entry => entry.type === 'warn').length,
      active: (entries || []).filter(entry => entry.type === 'warn' && entry.active).length,
    },
    bans: {
      total: (entries || []).filter(entry => entry.type === 'ban').length,
      active: (entries || []).filter(entry => entry.type === 'ban' && entry.active).length,
    },
  };
}

function toggleWarn(id, guildId) {
  const store = readStore();
  const entry = (store.warns || []).find(item => item.id === id && item.guildId === guildId);
  if (!entry) return null;
  entry.active = !entry.active;
  writeStore(store);
  return entry;
}

function toggleBan(id, guildId) {
  const store = readStore();
  const entry = (store.bans || []).find(item => item.id === id && item.guildId === guildId);
  if (!entry) return null;
  entry.active = !entry.active;
  writeStore(store);
  return entry;
}

function deleteEntry(type, id, guildId) {
  const store = readStore();
  const target = type === 'warn' ? 'warns' : 'bans';
  const updated = (store[target] || []).filter(item => !(item.id === id && item.guildId === guildId));
  store[target] = updated;
  writeStore(store);
  return true;
}

module.exports = {
  createWarn,
  createBan,
  getEntries,
  getSummary,
  toggleWarn,
  toggleBan,
  deleteEntry,
};
