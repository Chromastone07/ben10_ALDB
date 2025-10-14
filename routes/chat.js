const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const handleAiError = (res, err, context) => {
  console.error(`AI Error in ${context}:`, err.message);
  let statusCode = 500;
  let message = 'AI service error. Please try again later.';

  if (err.status === 429) {
    statusCode = 429;
    message = 'AI quota exceeded. Try again later.';
  } else if (err.status === 404) {
    statusCode = 503;
    message = 'AI model not found or temporarily unavailable.';
  }

  res.status(statusCode).json({ error: message });
};

router.get('/details/:type/:name', async (req, res) => {
  const { type, name } = req.params;
  try {
    if (!genAI) throw new Error('Gemini AI not configured.');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `
      You are an expert on the Ben 10 universe.
      Provide a detailed summary for the Ben 10 ${type} named "${name}".
      Include:
      - Appearance (<h3>Appearance</h3>)
      - Personality (<h3>Personality</h3>)
      - Powers & Abilities (<h3>Powers and Abilities</h3>)
      Format the output in pure HTML using <ul><li> for lists.
      Do NOT include markdown fences or <html>/<body> tags.
    `;

    const result = await model.generateContent(prompt);
    const htmlContent = result.response.text();
    res.send(htmlContent);

  } catch (err) {
    handleAiError(res, err, `GET /details/${req.params.type}/${req.params.name}`);
  }
});

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
    res.json({ answer: text });

  } catch (err) {
    handleAiError(res, err, "POST /chat");
  }
});

module.exports = router;
