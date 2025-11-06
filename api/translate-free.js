// Get your free API key from https://console.groq.com
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // Latest recommended model (replaces 3.1)

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

  if (!GROQ_API_KEY) {
    return res.status(500).json({
      error: 'GROQ_API_KEY not configured. Get one free at https://console.groq.com'
    });
  }

  try {
    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a historical English translator. Translate historical, archaic, or Shakespearean English (pre-20th century) into clear, natural modern English. Preserve the meaning and tone, but use contemporary vocabulary and grammar. Only output the translation, nothing else.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!groqResponse.ok) {
      const details = await groqResponse.text();
      return res.status(groqResponse.status).json({
        error: 'Groq API error.',
        details
      });
    }

    const data = await groqResponse.json();
    const translation = data?.choices?.[0]?.message?.content?.trim();

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
