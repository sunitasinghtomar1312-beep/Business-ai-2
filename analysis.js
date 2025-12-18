export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });
    
    const { idea } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    const prompt = `Act as a strict business and environmental consultant. Analyze: "${idea}". 
    Return ONLY a JSON object: {"sustainability":1-10,"ecoFriendly":1-10,"profit":1-10,"market":1-10,"isGoodForEnv":boolean,"summary":"A detailed 4-5 sentence analysis."}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const cleanJson = JSON.parse(rawText.replace(/```json|```/g, ""));
        
        return res.status(200).json(cleanJson);
    } catch (error) {
        return res.status(500).json({ error: "AI logic failed. Check API Key in Vercel." });
    }
}
