function parseDurationToMs(input) {
  const match = /^(\d+)(s|m|h|d|w)$/i.exec((input || '').trim());
  if (!match) return null;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000, w: 7 * 24 * 60 * 60 * 1000 };
  return amount * multipliers[unit];
}

module.exports = { parseDurationToMs };
