import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

// ✅ IMPORTANT: Groq base URL
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/chat", async (req, res) => {
  console.log("🔥 Request hit backend");
  console.log("Message:", req.body);

  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create({
     model: "llama-3.1-8b-instant", // ✅ Groq model
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});