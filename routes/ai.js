


const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.get('/details/:type/:name', async (req, res) => {
    console.log('AI details route reached!');
    console.log('Type:', req.params.type);
    console.log('Name:', req.params.name);

    try {
        const { type, name } = req.params;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // const prompt = `
        //     You are an expert on the Ben 10 universe.
        //     Provide a detailed summary for the Ben 10 ${type} named "${name}".
        //     Include the following sections: a detailed Appearance, their core Personality, and a comprehensive list of their Powers and Abilities.
        //     Format your entire response in simple HTML. Use <h3> for section titles and <ul><li> for lists of abilities. Do not include <html>, <head>, or <body> tags.
        // `;



        const prompt = `
    You are an expert on the Ben 10 universe.
    Provide a detailed summary for the Ben 10 ${type} named "${name}".
    Include the following sections: a detailed Appearance, their core Personality, and a comprehensive list of their Powers and Abilities.
    Format your entire response in simple HTML. Use <h3> for section titles and <ul><li> for lists of abilities.
    Provide only the HTML content, do not include any markdown code block delimiters like \`\`\`html. Do not include <html>, <head>, or <body> tags.
`;



        const result = await model.generateContent(prompt);
        const response = await result.response;
        const htmlContent = response.text();

        res.send(htmlContent);

    } catch (err) {
        console.error("AI Details Error:", err);
        res.status(500).send('<p>Error fetching details from the AI.</p>');
    }
});


router.post('/', async (req, res) => {
    const userQuery = req.body.query;
    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    const azmuthPrompt = `You are Azmuth, the creator of the Omnitrix, a leading expert on the Ben 10 universe. You are brilliant, slightly arrogant, and speak formally.
    Your response must ONLY be the direct dialogue from Azmuth. Do not include any descriptions of his actions, gestures, or tone of voice in parentheses or asterisks.
    USER QUESTION: "${userQuery}"
    AZMUTH:`;


    try {
        console.log("Attempting to use Google Gemini...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
