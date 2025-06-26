import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';

const DATA_FILE = path.join(process.cwd(), 'data', 'greetings.json');

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
};

let greetings = [];

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // req.body-г шалгах
    if (!req.body || !req.body.message) {
      return res.status(400).json({ error: 'message талбарыг заавал илгээнэ үү' });
    }
    const newGreeting = { ...req.body, id: Date.now().toString() };
    greetings.push(newGreeting);
    res.status(200).json(newGreeting);
  } else if (req.method === 'GET') {
    res.status(200).json(greetings);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 