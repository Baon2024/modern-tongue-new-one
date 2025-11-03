const HUGGING_FACE_ENDPOINT = 'https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-en';

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

export default async function handler(req, res) {
  allowCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const incomingText = req.body?.text ?? req.body?.inputs ?? '';
  const text = typeof incomingText === 'string' ? incomingText.trim() : '';

  if (!text) {
    return res.status(400).json({ error: 'Missing text to modernise.' });
  }

  try {
    const hfResponse = await fetch(HUGGING_FACE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    });

    if (!hfResponse.ok) {
      const details = await hfResponse.text();
      return res.status(hfResponse.status).json({
        error: 'Upstream translation service error.',
        details
      });
    }

    const data = await hfResponse.json();
    let translation = '';

    if (Array.isArray(data)) {
      const first = data[0];
      translation = first?.translation_text ?? '';
    } else if (data && typeof data === 'object') {
      translation = data.translation_text ?? '';
    }

    if (!translation) {
      return res.status(502).json({ error: 'Unexpected translation response.' });
    }

    return res.status(200).json({ translation });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to reach translation service.',
      details: error.message
    });
  }
}
