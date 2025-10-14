
// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const { OpenAI } = require('openai'); 

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// router.post('/', async (req, res) => {
//     const userQuery = req.body.query;
//     if (!userQuery) {
//         return res.status(400).json({ error: 'Query is required.' });
//     }


const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;


router.post('/', async (req, res) => {
    if (!genAI && !openai) {
        return res.status(503).json({ error: 'AI services are currently unavailable.' });
    }
 

const azmuthPrompt = `You are Azmuth, the creator of the Omnitrix, a leading expert on the Ben 10 universe. You are brilliant, slightly arrogant, and speak formally.
Your response must ONLY be the direct dialogue from Azmuth. Do not include any descriptions of his actions, gestures, or tone of voice in parentheses or asterisks.
USER QUESTION: "${userQuery}"
AZMUTH:`;


    try {
        console.log("Attempting to use Google Gemini...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(azmuthPrompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("Success with Google Gemini.");
        return res.json({ answer: text });

    } catch (err) {
       
        if (err.status === 429) {
            console.log("Google Gemini quota exceeded. Falling back to OpenAI...");
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: azmuthPrompt }],
                });
                const text = completion.choices[0].message.content;

                console.log("Success with OpenAI fallback.");
                return res.json({ answer: text });

            } catch (openAIError) {
                console.error("OpenAI Fallback Error:", openAIError);
                return res.status(500).json({ error: "Both AI providers failed." });
            }
        }
        
        console.error("AI Chat Error (Google):", err);
        return res.status(500).json({ error: "Failed to get a response from the primary AI." });
    }
});

module.exports = router;