# Slice 0 operations

The canonical production runtime is Ubuntu 24.04 under WSL2. Until that environment is installed,
the coordinator may be developed and tested with the available Windows Python as a documented
fallback.

Slice 0 deliberately stops before speech-model installation. Its purpose is to prove exact,
repeatable source selection.

The `doctor` command is expected to fail the production gate when FFmpeg, FFprobe, WSL Ubuntu, or
GPU access is missing. A failed doctor report does not invalidate the extraction tests; it records
the remaining environment work required for Gate G0.

