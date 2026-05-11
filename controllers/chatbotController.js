const prisma = require("../prisma/client");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 helper function (safe AI call)
async function getAIResponse(modelName, prompt) {
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

exports.chatbot = async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const userId = req.user?.id;

    // 🔹 1. Get DB data
    const restaurants = await prisma.restaurant.findMany({
      include: { menuItems: true }
    });

    // 🔹 2. Last order (if logged in)
    let lastOrder = null;

    if (userId) {
      lastOrder = await prisma.order.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { menuItem: true } },
          restaurant: true
        }
      });
    }

    // 🔹 3. Build AI prompt
    const prompt = `
You are QuickBite AI assistant.

RULES:
- Be short and friendly
- Use ONLY given data
- If user says "hw", respond normally
- Help with food, orders, prices

DATA:
Restaurants: ${JSON.stringify(restaurants)}
LastOrder: ${JSON.stringify(lastOrder)}

User: ${userMessage}
`;

    // 🔥 4. MODEL FALLBACK SYSTEM (IMPORTANT)
    const models = [
      
      "models/gemini-2.5-flash-lite"
    ];

    let reply = null;

    for (let m of models) {
      try {
        reply = await getAIResponse(m, prompt);
        break; // success → exit loop
      } catch (err) {
        console.log("❌ Model failed:", m);
      }
    }

    // 🔥 5. FINAL FALLBACK (no crash ever)
    if (!reply) {
      return res.json({
        reply: "AI busy hai 😢 thodi der baad try karo"
      });
    }

    // 🔹 6. return response
    return res.json({ reply });

  } catch (err) {
    console.error("🔥 CHATBOT ERROR:", err);

    return res.status(500).json({
      reply: "Something went wrong 😢"
    });
  }
};
