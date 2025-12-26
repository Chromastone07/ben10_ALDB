const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const handleAiError = (res, err, context) => {
    console.error(`AI Error in ${context}:`, err);
    let statusCode = 500;
    let message = 'An unexpected error occurred with the AI service.';

    if (err.status === 429) {
        statusCode = 429;
        message = 'AI service quota exceeded. Please try again later.';
    } else if (err.message && err.message.includes('fetch')) {
        statusCode = 503; 
        message = 'Could not connect to the AI service. Please check the connection.';
    }

    res.status(statusCode).json({ error: message });
};

// Details Route
router.get('/details/:type/:name', async (req, res) => {
    try {
        const { type, name } = req.params;
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

        const prompt = `
            You are an expert on the Ben 10 universe.
            Provide a detailed summary for the Ben 10 ${type} named "${name}".
            Include: Appearance, Personality, and Powers/Abilities.
            Format response in simple HTML (<h3> for titles, <ul><li> for lists).
            Do not include markdown (\`\`\`html) or body tags.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const htmlContent = response.text();

        res.send(htmlContent);

    } catch (err) {
        handleAiError(res, err, `GET /details/${req.params.type}/${req.params.name}`);
    }
});

// Chat Route
router.post('/', async (req, res) => {
    const userQuery = req.body.query;
    if (!userQuery) return res.status(400).json({ error: 'Query is required.' });

    const azmuthPrompt = `You are Azmuth, creator of the Omnitrix. Brilliant, arrogant, formal.
    Respond only with dialogue.
    USER: "${userQuery}"
    AZMUTH:`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const result = await model.generateContent(azmuthPrompt);
        const response = await result.response;
        const text = response.text();
        return res.json({ answer: text });
    } catch (err) {
        return handleAiError(res, err, "Google Gemini Chat");
    }
});

// --- UPDATED BATTLE ROUTE ---
router.post('/battle', async (req, res) => {
    try {
        const { team } = req.body; 

        if (!team || team.length === 0) {
            return res.status(400).json({ error: "No aliens in your playlist!" });
        }

        console.log("Battle Team sent to AI:", team);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Roleplay as the Omnitrix AI. 
            My active playlist contains: ${team.join(', ')}.
            
            1. Select a random villain from the Ben 10 universe.
            2. Simulate a short battle (3-4 sentences).
            3. Decide outcome (VICTORY or DEFEAT).
            
            Strictly return a valid JSON object with this format:
            {
                "villain": "Villain Name",
                "scenario": "Scenario text...",
                "outcome": "VICTORY"
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Raw AI Response:", text);

        // ROBUST JSON CLEANING (Fixes the "undefined" bug)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("AI did not return a valid JSON object");
        }

        const battleData = JSON.parse(jsonMatch[0]);
        res.json(battleData);

    } catch (err) {
        console.error("AI Battle Error:", err);
        res.status(500).json({ 
            villain: "Glitch", 
            scenario: "The Codon Stream is interrupted. Simulation failed.", 
            outcome: "ERROR" 
        });
    }
});

module.exports = router;