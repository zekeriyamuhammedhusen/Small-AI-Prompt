require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.5-flash-lite";

function findErrorCode(error) {
  for (let current = error; current; current = current.cause) {
    if (current.code) return current.code;
  }
  return undefined;
}

app.get("/", (req, res) => {
  res.send("Gemini AI Server is running!");
});

app.post("/api", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const answer = response.text;

    res.json({ answer });
  } catch (err) {
    const code = findErrorCode(err);
    const unreachable = ["ENOTFOUND", "EAI_AGAIN", "UND_ERR_CONNECT_TIMEOUT", "ETIMEDOUT"].includes(code);
    console.error("Gemini API Error:", err.message, code ? `(${code})` : "");

    res.status(unreachable ? 503 : 500).json({
      error: unreachable
        ? "Cannot reach Google Gemini. Check this computer's internet/DNS connection, VPN, or firewall, then try again."
        : "Gemini could not generate a response. Check the server configuration and try again.",
      code,
    });
  }
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
