import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
  host: process.env.CHROMA_HOST || "localhost",
  port: Number(process.env.CHROMA_PORT) || 8000,
  ssl: false,
});

const COLLECTION_NAME = "recall_memories";

let memoryCollection = null;


// ------------------------------------------------
// Get Recall memory collection
// ------------------------------------------------

export const getMemoryCollection = async () => {
  // Reuse already loaded collection
  if (memoryCollection) {
    return memoryCollection;
  }

  memoryCollection =
    await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,

      // Recall generates embeddings using Gemini.
      // Chroma should NOT generate embeddings itself.
      embeddingFunction: null,
    });

  return memoryCollection;
};


// ------------------------------------------------
// Add / update memory vector
// ------------------------------------------------

export const indexMemory = async ({
  memoryId,
  embedding,
  document,
  type,
}) => {
  const collection =
    await getMemoryCollection();

  await collection.upsert({
    ids: [memoryId],

    // We provide our Gemini embedding explicitly.
    embeddings: [embedding],

    documents: [document],

    metadatas: [
      {
        type,
      },
    ],
  });
};


// ------------------------------------------------
// Semantic search
// ------------------------------------------------

export const searchMemoryVectors = async ({
  queryEmbedding,
  limit = 5,
}) => {
  const collection =
    await getMemoryCollection();

  const results =
    await collection.query({
      // Again, Recall provides the embedding.
      queryEmbeddings: [queryEmbedding],

      nResults: limit,
    });

  return results;
};


// ------------------------------------------------
// Delete memory vector
// ------------------------------------------------

export const deleteMemoryVector = async (
  memoryId
) => {
  const collection =
    await getMemoryCollection();

  await collection.delete({
    ids: [memoryId.toString()],
  });
};