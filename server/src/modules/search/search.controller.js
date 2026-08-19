import {
  searchMemories,
} from "./search.service.js";


export const search =
  async (
    req,
    res
  ) => {

    try {

      const query =
        req.query.q;


      if (
        !query ||
        !query.trim()
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Search query is required",
          });

      }


      const results =
        await searchMemories(
          query.trim(),

          req.user._id,

          5
        );


      return res
        .status(200)
        .json({
          success: true,

          query,

          count:
            results.length,

          data:
            results,
        });


    } catch (error) {

      console.error(
        "Search failed:",
        error
      );


      return res
        .status(500)
        .json({
          success: false,

          message:
            "Search failed",
        });

    }
  };