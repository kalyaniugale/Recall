import sys
import json
from faster_whisper import WhisperModel


def main():

    if len(sys.argv) < 2:
        print(
            json.dumps({
                "success": False,
                "error": "Audio path is required"
            })
        )

        sys.exit(1)


    audio_path = sys.argv[1]


    try:

        model = WhisperModel(
            "small",
            device="cpu",
            compute_type="int8"
        )


        segments, info = model.transcribe(
            audio_path,
            beam_size=5
        )


        transcript_parts = []
        segment_data = []


        for segment in segments:

            text = segment.text.strip()

            if not text:
                continue


            transcript_parts.append(
                text
            )


            segment_data.append({
                "start":
                    round(segment.start, 2),

                "end":
                    round(segment.end, 2),

                "text":
                    text
            })


        result = {

            "success": True,

            "language":
                info.language,

            "languageProbability":
                round(
                    info.language_probability,
                    4
                ),

            "transcript":
                " ".join(
                    transcript_parts
                ),

            "segments":
                segment_data
        }


        print(
            json.dumps(
                result,
                ensure_ascii=False
            )
        )


    except Exception as error:

        print(
            json.dumps({
                "success": False,
                "error": str(error)
            })
        )

        sys.exit(1)


if __name__ == "__main__":
    main()