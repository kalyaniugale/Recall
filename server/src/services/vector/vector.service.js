import {
  ChromaClient,
} from "chromadb";


const chromaClient =
  new ChromaClient({
    host:
      process.env.CHROMA_HOST ||
      "localhost",

    port:
      Number(
        process.env.CHROMA_PORT
      ) || 8000,

    ssl: false,
  });


const COLLECTION_NAME =
  "recall_memories";


let memoryCollection = null;


// ==========================================
// COLLECTION
// ==========================================

export const getMemoryCollection =
  async () => {

    if (memoryCollection) {
      return memoryCollection;
    }

    memoryCollection =
      await chromaClient
        .getOrCreateCollection({
          name:
            COLLECTION_NAME,

          embeddingFunction:
            null,
        });

    return memoryCollection;
  };


// ==========================================
// INDEX MEMORY
// ==========================================

export const indexMemory =
  async ({
    memoryId,
    userId,
    embedding,
    document,
    type,
  }) => {

    const collection =
      await getMemoryCollection();


    await collection.upsert({
      ids: [
        memoryId.toString(),
      ],

      embeddings: [
        embedding,
      ],

      documents: [
        document,
      ],

      metadatas: [
        {
          type,

          // Chroma metadata should
          // use the string ID.

          userId:
            userId.toString(),
        },
      ],
    });
  };


// ==========================================
// SEARCH USER'S VECTORS
// ==========================================

export const searchMemoryVectors =
  async ({
    queryEmbedding,
    userId,
    limit = 5,
  }) => {

    const collection =
      await getMemoryCollection();


    const results =
      await collection.query({
        queryEmbeddings: [
          queryEmbedding,
        ],

        nResults:
          limit,

        // CRITICAL:
        // Chroma searches only
        // this user's vectors.

        where: {
          userId:
            userId.toString(),
        },
      });


    return results;
  };


// ==========================================
// DELETE VECTOR
// ==========================================

export const deleteMemoryVector =
  async (
    memoryId
  ) => {

    const collection =
      await getMemoryCollection();


    await collection.delete({
      ids: [
        memoryId.toString(),
      ],
    });
  };