"""Offline Noto Sans SC subset from static copy; never transmits project data.

Requires developer-only fonttools and brotli in api/.venv. Source font and
OFL.txt must already exist in web/.cache.nosync/font-source.
"""
import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]


def strings(value):
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return "".join(strings(item) for item in value)
    if isinstance(value, dict):
        return "".join(strings(item) for item in value.values())
    return ""


copy = [json.loads(path.read_text()) for path in [
    root / "web/src/messages/zh-CN.json", root / "api/seed/restaurants.json"]]
text = "".join(sorted(set(strings(copy))))
source = root / "web/.cache.nosync/font-source"
target = root / "web/src/assets/fonts"
target.mkdir(parents=True, exist_ok=True)
font = TTFont(source / "source.ttf")
options = subset.Options()
options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
font = instantiateVariableFont(font, {"wght": 400}, inplace=True)
font.flavor = "woff2"
font.save(target / "noto-sans-sc-ui.woff2")
license_text = (source / "OFL.txt").read_text()
(target / "OFL.txt").write_text("\n".join(line.rstrip() for line in license_text.splitlines()) + "\n")
(target / "ui-characters.txt").write_text(text + "\n")
print(f"Offline UI font: {(target / 'noto-sans-sc-ui.woff2').stat().st_size} bytes")
