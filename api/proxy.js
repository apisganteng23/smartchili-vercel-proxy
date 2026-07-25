export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method === 'GET') { res.status(200).send('SmartChili proxy aktif.'); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    // Model sama dengan yang dipakai di Testing Tool
    const model = 'gemini-3.1-flash-lite-preview';
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const googleRes = await fetch(googleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await googleRes.json();
    res.status(googleRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
}
