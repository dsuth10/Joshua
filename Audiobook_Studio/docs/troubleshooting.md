# Audiobook Studio troubleshooting

## CUDA out of memory

Stop Ollama before TTS, close other GPU-heavy applications, and verify only one worker is
active. Resume the render; accepted chunks are content-addressed and will be reused.

## Ollama cannot be reached from WSL

Windows Ollama may bind only to Windows localhost. Planning safely falls back to
deterministic annotations and records a warning. Run planning from the Windows
coordinator when local structured annotations are required, then reuse the validated plan
inside WSL.

## FFmpeg or FFprobe is missing

Install Ubuntu's `ffmpeg` package and rerun `audiobook doctor`. Assembly and packaging
fail without modifying accepted raw chunks.

## Whisper reports missing CUDA libraries

Rerun `scripts/bootstrap-slice2.sh`. The isolated Whisper environment includes the CUDA
12 cuBLAS and cuDNN wheels and supplies their library paths only to the worker process.

## DOCX page selection is rejected

DOCX pagination depends on fonts and renderer. Select the embedded chapter heading. If a
physical page is mandatory, render with a pinned LibreOffice version and manually verify
the page-to-paragraph boundaries.

## PDF says OCR is required

The PDF contains a page with too little extractable text. Run local OCR such as Tesseract,
create a searchable PDF, inspect the selected pages, and retry. The extractor never
silently returns empty narration.

## Interrupted run

Run `audiobook recover --project <project.yaml>`. It removes only incomplete
`*.partial.wav` files under that project's chunk and output directories. Rerun the failed
stage; valid cached chunks remain untouched.

## WSL and Windows environment separation

Use `.venv` for Windows and set `UV_PROJECT_ENVIRONMENT=.venv-wsl` when syncing the WSL
coordinator. Speech and Whisper workers retain their own environments under `workers/`.
