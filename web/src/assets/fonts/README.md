# Noto Sans SC UI font

Official source: https://github.com/google/fonts/tree/main/ofl/notosanssc

License: SIL Open Font License 1.1, see OFL.txt. Font name Noto Sans SC is retained; the reserved name Source is not used for this derivative.

`noto-sans-sc-ui.woff2` is generated entirely offline from the official variable font, instantiated at weight 400 and subset to static dictionary and fictional seed characters. `next/font/local` loads it; full Noto Sans SC via `next/font/google` remains the fallback for other characters. Inter handles English and numbers.

To regenerate, download the public source font and OFL.txt into `web/.cache.nosync/font-source/` as `source.ttf` and `OFL.txt`, then install the explicitly approved tools with `api/.venv/bin/python -m pip install -e './api[fonts]'` and run `api/.venv/bin/python scripts/subset_ui_font.py` from the repository root. No project text, address or token is transmitted.
