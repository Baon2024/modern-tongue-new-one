import { CohereClientV2 } from 'cohere-ai';
import dotenv from 'dotenv'

dotenv.config()

function allowCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}


export default async function handler(req, res) {
    allowCors()
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  }

  
    const { text } = req.body.text || {};
    const { apiKey } = req.body.apiKey
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "MISSING_TEXT" });
    }

    const cohere = new CohereClientV2({ token: apiKey });

    // --- your translation logic here ---
    // Example: super simple placeholder
    try {
    const response = await cohere.chat({
    messages: [
      {
        "role": "system",
        "content": "you are a latin to english translator, you translate to a high standard latin you are given to english. *Strictly return the translated text, no additional commentary or explanation*"
      }, 
      {
        "role": "user",
        "content": textToTranslate
      }
    ],
    temperature: 0.3,
    model: "command-a-03-2025"
  });

  //console.log("cohere response is: ", response);
  const translated_result = response.message.content[0].text
  console.log("cohere translated_result should be: ", translated_result)

    res.status(200).json({ result: translated_result })
} catch(e) {
  const status =
      err?.statusCode ||
      err?.response?.status ||
      500;

    const rawMsg =
      err?.message ||
      err?.response?.data?.message ||
      "Unknown error";

    // Handle invalid/expired key
    if (status === 401 || status === 403) {
      return res.status(status).json({
        error: "INVALID_API_KEY",
        message: "Your Cohere API key is invalid, expired, or lacks access.",
        details: rawMsg
      });
    }

    // Rate limits
    if (status === 429) {
      return res.status(429).json({
        error: "RATE_LIMITED",
        message: "Rate limit hit. Please try again shortly.",
        details: rawMsg
      });
    }

    console.error("Cohere error:", err);

    return res.status(status).json({
      error: "COHERE_ERROR",
      message: rawMsg
    });

    

}}


  






