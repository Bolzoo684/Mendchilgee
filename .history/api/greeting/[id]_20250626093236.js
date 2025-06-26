import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'greetings.json');

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      if (!fs.existsSync(DATA_FILE)) {
        res.status(404).json({ error: 'Мэндчилгээ олдсонгүй' });
        return;
      }
      
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 