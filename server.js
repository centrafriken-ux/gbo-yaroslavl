const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname)); // отдаём HTML, CSS, JS

const DATA_FILE = path.join(__dirname, 'data', 'requests.json');

// создаём файл, если его нет
if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

app.post('/submit', (req, res) => {
  const { name, phone, carModel, message } = req.body;
  if (!name || !phone) return res.status(400).json({ ok:false, error: 'Заполните имя и телефон' });

  const newRequest = { name, phone, carModel, message, date: new Date().toISOString() };

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(newRequest);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
