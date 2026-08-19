import {
  spawn,
} from "child_process";

import fs from "fs/promises";
import path from "path";


const runFFmpeg = (args) => {

  return new Promise(
    (resolve, reject) => {

      const process =
        spawn(
          "ffmpeg",
          args,
          {
            shell: false,
          }
        );


      let errorOutput = "";


      process.stderr.on(
        "data",
        (data) => {
          errorOutput +=
            data.toString();
        }
      );


      process.on(
        "error",
        (error) => {
          reject(
            new Error(
              `Could not start FFmpeg: ${error.message}`
            )
          );
        }
      );


      process.on(
        "close",
        (code) => {

          if (code === 0) {
            resolve();
            return;
          }

          reject(
            new Error(
              `FFmpeg exited with code ${code}\n${errorOutput}`
            )
          );
        }
      );
    }
  );
};


export const extractReelAudio =
  async ({
    videoPath,
    workspace,
  }) => {

    const audioPath =
      path.join(
        workspace,
        "audio.wav"
      );


    console.log(
      "Extracting Reel audio..."
    );


    await runFFmpeg([
      "-y",

      "-i",
      videoPath,

      "-vn",

      "-ac",
      "1",

      "-ar",
      "16000",

      audioPath,
    ]);


    console.log(
      "Audio extracted:",
      audioPath
    );


    return audioPath;
  };


export const extractReelFrames =
  async ({
    videoPath,
    workspace,
  }) => {

    const framesDirectory =
      path.join(
        workspace,
        "frames"
      );


    await fs.mkdir(
      framesDirectory,
      {
        recursive: true,
      }
    );


    const outputPattern =
      path.join(
        framesDirectory,
        "frame-%03d.jpg"
      );


    console.log(
      "Extracting Reel frames..."
    );


    // One representative frame
    // approximately every 20 seconds.

    await runFFmpeg([
      "-y",

      "-i",
      videoPath,

      "-vf",
      "fps=1/20",

      "-q:v",
      "3",

      outputPattern,
    ]);


    const files =
      (
        await fs.readdir(
          framesDirectory
        )
      )
        .filter(
          (file) =>
            file
              .toLowerCase()
              .endsWith(".jpg")
        )
        .sort();


    const framePaths =
      files.map(
        (file) =>
          path.join(
            framesDirectory,
            file
          )
      );


    console.log(
      `Extracted ${framePaths.length} frames`
    );


    return framePaths;
  };