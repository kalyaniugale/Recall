import {
  spawn,
} from "child_process";

import path from "path";

import {
  fileURLToPath,
} from "url";


const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );


const WORKER_PATH =
  path.join(
    __dirname,
    "workers",
    "transcribe.py"
  );


const runWhisperWorker = (
  audioPath
) => {

  return new Promise(
    (resolve, reject) => {

      const child =
        spawn(
          "py",
          [
            WORKER_PATH,
            audioPath,
          ],
          {
            shell: false,

            env: {
              ...process.env,

              PYTHONIOENCODING:
                "utf-8",
            },
          }
        );


      let stdout = "";
      let stderr = "";


      child.stdout.on(
        "data",
        (data) => {
          stdout +=
            data.toString();
        }
      );


      child.stderr.on(
        "data",
        (data) => {
          stderr +=
            data.toString();
        }
      );


      child.on(
        "error",
        (error) => {

          reject(
            new Error(
              `Could not start Whisper worker: ${error.message}`
            )
          );

        }
      );


      child.on(
        "close",
        (code) => {

          if (code !== 0) {

            reject(
              new Error(
                `Whisper worker exited with code ${code}\n${stderr}\n${stdout}`
              )
            );

            return;
          }


          try {

            const result =
              JSON.parse(
                stdout.trim()
              );


            if (!result.success) {

              reject(
                new Error(
                  result.error ||
                  "Transcription failed"
                )
              );

              return;
            }


            resolve(result);


          } catch (error) {

            reject(
              new Error(
                `Could not parse Whisper output: ${error.message}\n${stdout}`
              )
            );
          }
        }
      );
    }
  );
};


export const transcribeReelAudio =
  async (audioPath) => {

    console.log(
      "Starting Reel transcription..."
    );


    const result =
      await runWhisperWorker(
        audioPath
      );


    console.log(
      `Transcription completed (${result.language})`
    );


    return result;
  };