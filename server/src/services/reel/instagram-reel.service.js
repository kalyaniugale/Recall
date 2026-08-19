import {
  execFile,
} from "node:child_process";

import {
  promisify,
} from "node:util";

const execFileAsync =
  promisify(execFile);


// ----------------------------------------------
// Normalize Instagram Reel URL
// ----------------------------------------------

const normalizeInstagramUrl = (inputUrl) => {

  const match = inputUrl.match(
    /instagram\.com\/(?:reel|reels)\/([^/?#]+)/
  );

  if (!match) {
    throw new Error(
      "Invalid Instagram Reel URL"
    );
  }

  const shortcode = match[1];

  return {
    shortcode,

    url:
      `https://www.instagram.com/reel/${shortcode}/`,
  };
};


// ----------------------------------------------
// Resolve Reel metadata using yt-dlp
// ----------------------------------------------

export const resolveInstagramReel = async (
  inputUrl
) => {

  const {
    shortcode,
    url,
  } = normalizeInstagramUrl(inputUrl);


  console.log(
    "Resolving Instagram Reel:",
    shortcode
  );


  try {

    /*
      --dump-single-json

      Tells yt-dlp:
      Don't download anything.
      Just inspect the Reel and return
      all extracted metadata as JSON.
    */

    const {
      stdout,
    } = await execFileAsync(
      "yt-dlp",
      [
        "--dump-single-json",
        "--no-playlist",
        "--no-warnings",
        url,
      ],
      {
        maxBuffer:
          10 * 1024 * 1024,
      }
    );


    const data =
      JSON.parse(stdout);


    // ------------------------------------------
    // Extract useful metadata
    // ------------------------------------------

    const metadata = {

      platform:
        "instagram",

      originalUrl:
        url,

      shortcode,

      username:
        data.uploader ||
        data.channel ||
        "",

      caption:
        data.description ||
        data.title ||
        "",

      thumbnailUrl:
        data.thumbnail ||
        "",

      duration:
        typeof data.duration === "number"
          ? data.duration
          : null,
    };


    console.log(
      "Instagram metadata resolved:"
    );

    console.log({
      shortcode:
        metadata.shortcode,

      username:
        metadata.username,

      caption:
        metadata.caption
          ? "FOUND"
          : "NOT FOUND",

      thumbnailUrl:
        metadata.thumbnailUrl
          ? "FOUND"
          : "NOT FOUND",

      duration:
        metadata.duration,
    });


    return metadata;

  } catch (error) {

    console.error(
      "Failed to resolve Instagram Reel metadata:",
      error.message
    );

    /*
      Metadata failure should not necessarily
      kill the entire Recall pipeline.

      We can still download/analyse the Reel.
    */

    return {
      platform:
        "instagram",

      originalUrl:
        url,

      shortcode,

      username:
        "",

      caption:
        "",

      thumbnailUrl:
        "",

      duration:
        null,
    };
  }
};