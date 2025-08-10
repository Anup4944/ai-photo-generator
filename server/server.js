import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors({}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get(/^[^.]+$/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.post("/dream", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = response.data[0].url;
    res.send({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send({ error: "Failed to generate image" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export default app;
