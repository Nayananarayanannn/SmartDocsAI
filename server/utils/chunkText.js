const CHUNK_SIZE = 700;
const OVERLAP = 100;

export const chunkText = (text) => {
  try {
    const chunks = [];

    const paragraphs = text.split(/\n\s*\n/);

    let currentChunk = "";

    // loop through each paragraph
    for (let para of paragraphs) {
      // check if adding the current paragraph will exceed the chunk size
      if ((currentChunk + para).length > CHUNK_SIZE) {
        // if so, push the current chunk and start a new one only if it's not empty
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        const overlap = currentChunk.split(" ").slice(-20).join(" ");

        // add the overlap to the new chunk
        currentChunk = overlap + " " + para;
      } else {
        // otherwise, add the paragraph to the current chunk
        currentChunk += " " + para;
      }
    }
    if (currentChunk.trim()) {
      // push the last chunk
      chunks.push(currentChunk.trim());
    }
    return chunks;
  } catch (error) {
    console.error("Error chunking text:", error);
    throw error;
  }
};
