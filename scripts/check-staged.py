"""Refuse environment files, generated dependencies and Mapbox token literals."""
import subprocess
from pathlib import PurePosixPath

names = subprocess.check_output(["git", "diff", "--cached", "--name-only", "--diff-filter=ACM", "-z"]).decode().split("\0")
for name in filter(None, names):
    assert not any((part.startswith(".env") and part != ".env.example") or part.startswith(".venv") or part in {"node_modules", "node_modules.nosync"} for part in PurePosixPath(name).parts), name
    blob = subprocess.check_output(["git", "show", f":{name}"])
    assert b"pk." + b"eyJ" not in blob, name
print("Staged files checked: no environment files, virtual environments or Mapbox literals")
