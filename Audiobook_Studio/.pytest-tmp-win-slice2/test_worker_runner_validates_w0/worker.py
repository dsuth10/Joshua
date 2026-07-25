import argparse
import json
import wave
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--request", type=Path, required=True)
parser.add_argument("--response", type=Path, required=True)
args = parser.parse_args()
request = json.loads(args.request.read_text(encoding="utf-8"))
output = Path(request["output_path"])
output.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(output), "wb") as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(24000)
    wav.writeframes(b"\x00\x00" * 2400)
args.response.write_text(
    json.dumps(
        {
            "schema_version": 1,
            "request_id": request["request_id"],
            "status": "success",
            "warnings": [],
        }
    ),
    encoding="utf-8",
)
