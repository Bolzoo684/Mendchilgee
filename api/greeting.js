export const config = {
  api: {
    bodyParser: true,
  },
};

let greetings = [];

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json(greetings);
  } else if (req.method === 'POST') {
    if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'message талбарыг заавал илгээнэ үү' });
    }
    const newGreeting = { ...req.body, id: Date.now().toString() };
    greetings.push(newGreeting);
    res.status(200).json(newGreeting);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 