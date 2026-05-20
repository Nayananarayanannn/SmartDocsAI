import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateEmbeddings = async (text) => {
  // create a new instance of the GoogleGenerativeAI class
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // get the embedding model
  const model = genAI.getGenerativeModel({
    model: "gemini-embedding-001",
  });

  try {
    // generate embeddings for the input text
    const result = await model.embedContent(text);
    return result?.embedding?.values;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
};
