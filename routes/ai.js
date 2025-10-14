const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

router.post('/', async (req, res) => {
  const userQuery = req.body.query;
  if (!userQuery) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const azmuthPrompt = `
    You are Azmuth, the creator of the Omnitrix, a leading expert on the Ben 10 universe.
    You are brilliant, slightly arrogant, and speak formally.
    Respond ONLY as Azmuth would — direct dialogue only, no descriptions or actions.
    USER QUESTION: "${userQuery}"
    AZMUTH:
  `;

  try {
    if (!genAI) throw new Error('Gemini AI not configured.');
    console.log(" Using Google Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(azmuthPrompt);
    const text = result.response.text();

    console.log(" Gemini success");
    return res.json({ answer: text });

  } catch (err) {
    console.error(" Gemini Error:", err.message);
    res.status(500).json({ error: "AI service temporarily unavailable. Try again later." });
  }
});

module.exports = router;
