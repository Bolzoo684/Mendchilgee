import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'greetings.json');

// Файл байхгүй бол үүсгэх
function ensureDataFile() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }
}

export default function handler(req, res) {
  ensureDataFile();
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const greetings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      const greeting = greetings.find(g => g.id === id);
      if (greeting) {
        res.status(200).json(greeting);
      } else {
        res.status(404).json({ error: 'Мэндчилгээ олдсонгүй' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Серверийн алдаа' });
    }
  } else if (req.method === 'POST') {
    try {
      const greetings = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      const newGreeting = { ...req.body, id: Date.now().toString() };
      greetings.push(newGreeting);
      fs.writeFileSync(DATA_FILE, JSON.stringify(greetings, null, 2));
      res.status(200).json(newGreeting);
    } catch (error) {
      res.status(500).json({ error: 'Серверийн алдаа' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 