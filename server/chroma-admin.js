import "dotenv/config";

import {
  getMemoryCollection,
} from "./src/services/vector/vector.service.js";

const run = async () => {
  try {
    const collection = await getMemoryCollection();
   
    const data = await collection.get();
    
    console.log("\n===== CHROMA MEMORIES =====\n");

    data.ids.forEach((id, index) => {
      console.log(`#${index + 1}`);
      console.log("ID:", id);

      console.log(
        "Document:",
        data.documents?.[index]?.slice(0, 150)
      );

      console.log("------------------------");
    });

    console.log(
      `\nTotal vectors: ${data.ids.length}`
    );

  } catch (error) {
    console.error(error);
  }
};

run();