import { PDFParse } from "pdf-parse";
import Chunk from "../models/chunk.js";
import { generateEmbeddings } from "../services/aiServices.js";
import { chunkText } from "../utils/chunkText.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const parser = new PDFParse({ data: req.file.buffer });

    const data = await parser.getText();

    const text = data.text;

    const chunks = chunkText(text);

    for (let chunk of chunks) {
      const embedding = await generateEmbeddings(chunk);
      await Chunk.create({ text: chunk, embedding });
    }

    res.json({ message: "File uploaded and processed successfully" });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file" });
  }
};
