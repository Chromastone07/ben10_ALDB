const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { OpenAI } = require('openai');

// Initialize Clients
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- OFFLINE FALLBACK GENERATORS (The "Safety Net") ---

function getOfflineBattle(heroName, villainName) {
    const actions = [
        "launches a powerful energy blast!",
        "dodges the attack and counters!",
        "uses the environment to strike!",
        "unleashes a combo attack!",
        "tanks the hit and keeps moving!",
        "exploits a weakness!"
    ];

    const rounds = [];
    let heroHp = 100;
    let villainHp = 100;

    for(let i=1; i<=3; i++) {
        // Random damage
        const dmgToHero = Math.floor(Math.random() * 30);
        const dmgToVillain = Math.floor(Math.random() * 35); 
        
        heroHp -= dmgToHero;
        villainHp -= dmgToVillain;

        rounds.push({
            message: `Round ${i}: ${heroName} ${actions[Math.floor(Math.random() * actions.length)]} ${villainName} takes ${dmgToVillain} damage!`,
            damageToHero: dmgToHero,
            damageToVillain: dmgToVillain
        });
    }

    // Determine Winner based on remaining HP
    const outcome = (villainHp <= 0 || heroHp > villainHp) ? "VICTORY" : "DEFEAT";
    
    return JSON.stringify({
        heroName: heroName,
        villainName: villainName,
        rounds: rounds,
        outcome: outcome,
        finalComment: outcome === "VICTORY" ? "Target neutralized. Well done, Tennyson." : "Mission failed. Retreat immediately."
    });
}

function getOfflineDetails(name, type) {
    return `
        <h3>${name} (Offline Mode)</h3>
        <p><strong>Note:</strong> The Galvanic Mechamorphs are currently repairing the AI uplink. Detailed stats are unavailable.</p>
        <p>This entry exists in the local Plumber Database.</p>
        <ul>
            <li><strong>Type:</strong> ${type}</li>
            <li><strong>Status:</strong> Recognized</li>
            <li><strong>Data:</strong> Retrieve online for full bio.</li>
        </ul>
    `;
}

function getOfflineChat() {
    return "The Sub-Energy transmission is down. I cannot access the Codon Stream right now. (AI Quota Exceeded)";
}

// --- SMART GENERATION FUNCTION ---
async function generateWithFallback(prompt, type, contextData = null) {
    // 1. Try Gemini
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (geminiError) {
        console.warn(`Gemini Failed. Switching to OpenAI...`);
        // 2. Try OpenAI
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });
            return completion.choices[0].message.content;
        } catch (openAiError) {
            console.error(`All AI Services Failed. Using Offline Mode.`);
            
            // 3. Offline Mode
            if (type === 'battle') return getOfflineBattle(contextData.hero, contextData.villain);
            // ... (other offline fallbacks) ...
            return "System Offline.";
        }
    }
}

// const cleanJSON = (text) => text.replace(/```json/g, '').replace(/```/g, '').trim();

// --- HELPER: JSON CLEANER ---
const cleanJSON = (text) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// ================= ROUTES =================

// 1. Details Route
router.get('/details/:type/:name', async (req, res) => {
    try {
        const { type, name } = req.params;
        const prompt = `
            You are an expert on the Ben 10 universe.
            Provide a detailed summary for the Ben 10 ${type} named "${name}".
            Include: Appearance, Personality, and Powers/Abilities.
            Format response in simple HTML (<h3> for titles, <ul><li> for lists).
            Do not include markdown or body tags.
        `;

        // Pass context data for offline mode
        const htmlContent = await generateWithFallback(prompt, 'details', { name, type });
        res.send(htmlContent);

    } catch (err) {
        console.error("Details Route Error:", err);
        res.send(getOfflineDetails(req.params.name, req.params.type));
    }
});

// 2. Chat Route
router.post('/', async (req, res) => {
    const userQuery = req.body.query;
    if (!userQuery) return res.status(400).json({ error: 'Query is required.' });

    const prompt = `You are Azmuth. Respond to: "${userQuery}"`;
    
    try {
        const text = await generateWithFallback(prompt, 'chat');
        return res.json({ answer: text });
    } catch (err) {
        res.json({ answer: getOfflineChat() });
    }
});

// 3. Battle Route
router.post('/battle', async (req, res) => {
    let { team, customHero, customVillain } = req.body;
    
    // Default logic: Pick random if custom not provided
    const heroName = customHero || (team && team.length > 0 ? team[Math.floor(Math.random() * team.length)] : "Ben 10");
    const villainName = customVillain || "Vilgax"; // Default fallback if random fails

    try {
        const prompt = `
            Act as a Battle Simulator for Ben 10.
            Hero: ${heroName}
            Villain: ${villainName}
            
            Generate a 3-round battle script.
            
            Return JSON in this EXACT format:
            {
                "heroName": "${heroName}",
                "villainName": "${villainName}",
                "rounds": [
                    { "message": "Round 1 action description...", "damageToHero": 10, "damageToVillain": 20 },
                    { "message": "Round 2 action description...", "damageToHero": 0, "damageToVillain": 30 },
                    { "message": "Round 3 action description...", "damageToHero": 20, "damageToVillain": 10 }
                ],
                "outcome": "VICTORY" or "DEFEAT",
                "finalComment": "Azmuth's comment."
            }
        `;

        const rawText = await generateWithFallback(prompt, 'battle', { hero: heroName, villain: villainName });
        const jsonMatch = cleanJSON(rawText).match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) throw new Error("Invalid Output");

        const battleData = JSON.parse(jsonMatch[0]);
        res.json(battleData);

    } catch (err) {
        console.error("Battle Error:", err);
        const offlineData = JSON.parse(getOfflineBattle(heroName, villainName));
        res.json(offlineData);
    }
});

module.exports = router;