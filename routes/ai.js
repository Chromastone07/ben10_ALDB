const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


function getOfflineBattle(heroName, villainName) {
    const actions = ["launches an energy blast!", "dodges and counters!", "unleashes a combo!"];
    const rounds = [];
    let heroHp = 100, villainHp = 100;

    for(let i=1; i<=3; i++) {
        const dmgToHero = Math.floor(Math.random() * 20);
        const dmgToVillain = Math.floor(Math.random() * 25);
        heroHp -= dmgToHero;
        villainHp -= dmgToVillain;
        rounds.push({
            message: `Round ${i}: ${heroName} ${actions[Math.floor(Math.random() * actions.length)]}`,
            damageToHero: dmgToHero,
            damageToVillain: dmgToVillain
        });
    }
    const outcome = (heroHp > villainHp) ? "VICTORY" : "DEFEAT";
    return { heroName, villainName, rounds, outcome, finalComment: "Data stream unstable." };
}

async function generateWithFallback(prompt, type, contextData = null) {
    try {
       
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (geminiError) {
        console.warn(`Gemini Error: ${geminiError.message}. Switching to OpenAI...`);
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });
            return completion.choices[0].message.content;
        } catch (openAiError) {
            console.error(`All AI Services Failed.`);
            if (type === 'battle') return JSON.stringify(getOfflineBattle(contextData.hero, contextData.villain));
            return "System Offline.";
        }
    }
}

const cleanJSON = (text) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};


router.get('/details/:type/:name', async (req, res) => {
    try {
        const { type, name } = req.params;
        const prompt = `Provide a detailed summary for the Ben 10 ${type} "${name}". Use simple HTML (<h3>, <ul>, <li>).`;
        const htmlContent = await generateWithFallback(prompt, 'details');
        res.send(htmlContent);
    } catch (err) {
        res.status(500).send("Unable to retrieve details.");
    }
});

router.post('/battle', async (req, res) => {
    const { customHero, customVillain } = req.body;
    const hero = customHero || "Ben 10";
    const villain = customVillain || "Vilgax";

    const prompt = `Act as a Ben 10 Battle Simulator. 
    Battle: ${hero} vs ${villain}. 
    Return ONLY a JSON object with this structure: 
    {"heroName": "", "villainName": "", "rounds": [{"message": "", "damageToHero": 0, "damageToVillain": 0}], "outcome": "VICTORY/DEFEAT", "finalComment": ""}`;

    try {
        const rawText = await generateWithFallback(prompt, 'battle', { hero, villain });
        const battleData = JSON.parse(cleanJSON(rawText));
        res.json(battleData);
    } catch (err) {
        res.json(getOfflineBattle(hero, villain));
    }
});

module.exports = router;