const express = require('express');
const router = express.Router();

let stats = {
  totalScans: 2847,
  scamsDetected: 1205,
  linksScanned: 891,
  messagesAnalyzed: 634,
  lastUpdated: new Date().toISOString()
};

const incrementStat = (type) => {
  if (type === 'scan') stats.totalScans++;
  if (type === 'scam') stats.scamsDetected++;
  if (type === 'link') stats.linksScanned++;
  if (type === 'message') stats.messagesAnalyzed++;
  stats.lastUpdated = new Date().toISOString();
};

router.get('/', (req, res) => {
  res.json(stats);
});

module.exports = { stats, incrementStat, router };
