import {
  spawn,
} from "child_process";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";


const TEMP_ROOT = path.resolve(
  process.cwd(),
  "temp"
);


const runYtDlp = (
  url,
  outputPath
) => {
  return new Promise(
    (resolve, reject) => {

      const args = [
        "--no-playlist",

        "-f",
        "bestvideo+bestaudio/best",

        "--merge-output-format",
        "mp4",

        "-o",
        outputPath,

        url,
      ];


      const process =
        spawn(
          "yt-dlp",
          args,
          {
            shell: false,
          }
        );


      let stderr = "";


      process.stdout.on(
        "data",
        (data) => {
          console.log(
            `[yt-dlp] ${data.toString().trim()}`
          );
        }
      );


      process.stderr.on(
        "data",
        (data) => {
          const text =
            data.toString();

          stderr += text;

          console.log(
            `[yt-dlp] ${text.trim()}`
          );
        }
      );


      process.on(
        "error",
        (error) => {
          reject(
            new Error(
              `Could not start yt-dlp: ${error.message}`
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
              `yt-dlp exited with code ${code}\n${stderr}`
            )
          );
        }
      );
    }
  );
};


export const downloadReel = async (
  url
) => {

  const jobId =
    crypto.randomUUID();

  const workspace =
    path.join(
      TEMP_ROOT,
      jobId
    );


  await fs.mkdir(
    workspace,
    {
      recursive: true,
    }
  );


  const videoPath =
    path.join(
      workspace,
      "reel.mp4"
    );


  console.log(
    "Downloading Reel..."
  );

  console.log(
    "Workspace:",
    workspace
  );


  await runYtDlp(
    url,
    videoPath
  );


  console.log(
    "Reel downloaded:",
    videoPath
  );


  return {
    workspace,
    videoPath,
  };
};


export const cleanupReelWorkspace =
  async (workspace) => {

    if (!workspace) {
      return;
    }

    try {

      await fs.rm(
        workspace,
        {
          recursive: true,
          force: true,
        }
      );

      console.log(
        "Temporary Reel files deleted"
      );

    } catch (error) {

      console.error(
        "Failed to clean Reel workspace:",
        error.message
      );
    }
  };