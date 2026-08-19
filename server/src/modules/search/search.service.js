import mongoose from "mongoose";

import Memory from "../memory/memory.model.js";

import {
  generateEmbedding,
} from "../../services/embedding/embedding.service.js";

import {
  searchMemoryVectors,
} from "../../services/vector/vector.service.js";


const MAX_DISTANCE =
  Number(
    process.env.SEARCH_MAX_DISTANCE
  ) || 0.75;


// ==========================================
// SEARCH
// ==========================================

export const searchMemories =
  async (
    query,
    userId,
    limit = 5
  ) => {

    if (
      !query ||
      !query.trim()
    ) {
      throw new Error(
        "Search query is required"
      );
    }


    // ------------------------------------------
    // 1. Embed user's query
    // ------------------------------------------

    const queryEmbedding =
      await generateEmbedding(
        query.trim()
      );


    // ------------------------------------------
    // 2. Search ONLY this user's Chroma vectors
    // ------------------------------------------

    const vectorResults =
      await searchMemoryVectors({
        queryEmbedding,

        userId,

        limit,
      });


    const ids =
      vectorResults.ids?.[0] ||
      [];


    const distances =
      vectorResults
        .distances?.[0] ||
      [];


    if (
      ids.length === 0
    ) {
      return [];
    }


    console.log(
      "Chroma raw results:"
    );


    ids.forEach(
      (id, index) => {

        console.log({
          id,

          distance:
            distances[index],
        });

      }
    );


    // ------------------------------------------
    // 3. Relevance threshold
    // ------------------------------------------

    const relevantResults =
      ids
        .map(
          (id, index) => ({
            id,

            distance:
              distances[index],
          })
        )
        .filter(
          (result) =>
            result.distance !==
              undefined &&

            result.distance <=
              MAX_DISTANCE &&

            mongoose.Types
              .ObjectId
              .isValid(
                result.id
              )
        );


    if (
      relevantResults.length ===
      0
    ) {
      return [];
    }


    const validIds =
      relevantResults.map(
        (result) =>
          result.id
      );


    // ------------------------------------------
    // 4. MongoDB authorization check AGAIN
    // ------------------------------------------
    //
    // Even though Chroma is already filtered,
    // MongoDB also verifies ownership.
    // ------------------------------------------

    const memories =
      await Memory.find({
        _id: {
          $in: validIds,
        },

        userId:
          userId,
      }).lean();


    // ------------------------------------------
    // 5. Lookup map
    // ------------------------------------------

    const memoryMap =
      new Map(
        memories.map(
          (memory) => [
            memory._id.toString(),
            memory,
          ]
        )
      );


    // ------------------------------------------
    // 6. Preserve semantic ranking
    // ------------------------------------------

    const rankedResults =
      relevantResults
        .map(
          (result) => {

            const memory =
              memoryMap.get(
                result.id
              );


            if (!memory) {
              return null;
            }


            return {
              memory,

              distance:
                result.distance,
            };

          }
        )
        .filter(Boolean);


    return rankedResults;
  };