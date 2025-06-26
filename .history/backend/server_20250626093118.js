const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './greetings.json';

// Мэндчилгээ авах
app.get('/api/greeting/:id', (req, res) => {
  const greetings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const greeting = greetings.find(g => g.id === req.params.id);
  if (greeting) {
    res.json(greeting);
  } else {
    res.status(404).json({ error: 'Мэндчилгээ олдсонгүй' });
  }
});

// Мэндчилгээ үүсгэх
app.post('/api/greeting', (req, res) => {
  const greetings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const newGreeting = { ...req.body, id: Date.now().toString() };
  greetings.push(newGreeting);
  fs.writeFileSync(DATA_FILE, JSON.stringify(greetings, null, 2));
  res.json(newGreeting);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}); 