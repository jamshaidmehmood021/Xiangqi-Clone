const { GoogleGenerativeAI } = require("@google/generative-ai");

let projectPrompt =
    `I am preparing a gig for a freelance platform. 
    i want best suggession, asthetic description of the gig that will appeal to the customers. 
    Just give me plain text and only include what should be written next and i need response 
    without formatting just plaintext ,
    and i only need the suggesion except from my current text it should not be included in it `;

    const getAiSuggestions = async (req, res) => {
    const { title, budget, type, description, deadline } = req.query;

    try {
        if (!process.env.GEMINI_API_KEY) {
            process.exit(1);
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        if (title) projectPrompt += ` This is my project title: ${title}.`;
        if (budget) projectPrompt += ` This is my project budget: ${budget}.`;
        if (deadline) projectPrompt += ` This is my project deadline: ${deadline}.`;
        if (description) projectPrompt += ` This is the description I've written till now: ${description}.`;

        const result = await model.generateContent(projectPrompt);
        const suggestion = result.response.text();

        res.status(200).json({ suggestion , error: false });
    } catch (e) {
        console.log("Failed to get suggestion", e);
        res.status(500).json({ message: e.message || "An error has occurred.", error: true });
    }
};

module.exports = getAiSuggestions;
