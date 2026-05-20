import { GoogleGenerativeAI } from "@google/generative-ai";
import Chunk from "../models/chunk.js";
import { generateEmbeddings } from "../services/aiServices.js";

export const chatQuestion = async (req, res) => {
  try {
    const { query } = req.body;

    const queryEmbedding = await generateEmbeddings(query);

    const data = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 5,
        },
      },
    ]);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const prompt = `
    Answer using only the context below
    Context:${data?.map((d) => d.text).join(` `)}

    Question: ${query}
    If answer is not in the context, say "I don't know"`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const { response } = await model.generateContent(prompt);

    res.status(200).json({ answer: response.text() });
  } catch (err) {
    console.error("Error in chatQuestion", err);
    throw err;
  }
};
