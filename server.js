const express = require('express');
const db = require('./db');
const osu = require('node-os-utils');
const path = require('path');

let container;
db.connect().then(c => container = c);

setInterval(async() => {
  const info = await osu.mem.info();
  await container.putRow(info.freeMemPercentage);
}, 1000);

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();
app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/data', async (req, res) => {
  const rows = await container.getLatestRows();
  res.send(rows);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
