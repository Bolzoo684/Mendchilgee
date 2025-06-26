import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.resolve(process.cwd(), 'mendchilgee-a5529-firebase-adminsdk-fbsvc-2dad8f01c7.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newGreeting = { ...req.body, createdAt: Date.now() };
      const docRef = await db.collection('greetings').add(newGreeting);
      res.status(200).json({ id: docRef.id, ...newGreeting });
    } catch (err) {
      res.status(500).json({ error: 'Firestore-д хадгалах үед алдаа гарлаа', details: err.message });
    }
  } else if (req.method === 'GET') {
    try {
      const snapshot = await db.collection('greetings').get();
      const greetings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(greetings);
    } catch (err) {
      res.status(500).json({ error: 'Firestore-оос унших үед алдаа гарлаа', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 