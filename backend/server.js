import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

// ✅ CORS (ONLY ONCE)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ Groq client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ✅ Route
app.post("/chat", async (req, res) => {
  console.log("🔥 Request hit backend");
  console.log("Message:", req.body);

  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

// ✅ Use dynamic port (VERY IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});