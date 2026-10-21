"""Build the bundled, offline Albania place picker from GeoNames AL.zip.

Source: https://download.geonames.org/export/dump/AL.zip
License: CC BY 4.0, https://www.geonames.org/export/
Only current populated-place features are included. Run deliberately when
updating the snapshot; the app never calls GeoNames at runtime.
"""

import json
import urllib.request
import zipfile
from datetime import date
from io import BytesIO
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
URL = "https://download.geonames.org/export/dump/AL.zip"
OUT = ROOT / "src" / "data" / "albaniaPlaces.json"

with urllib.request.urlopen(URL, timeout=30) as response:
    archive = zipfile.ZipFile(BytesIO(response.read()))
with urllib.request.urlopen("https://download.geonames.org/export/dump/admin1CodesASCII.txt", timeout=30) as response:
    regions = {parts[0]: parts[1] for line in response.read().decode("utf-8").splitlines()
               if len(parts := line.split("\t")) >= 2 and parts[0].startswith("AL.")}

places = []
for line in archive.read("AL.txt").decode("utf-8").splitlines():
    row = line.split("\t")
    if len(row) < 19 or row[6] != "P" or row[7] in {"PPLH", "PPLQ", "PPLW", "PPLR", "PPLF"}:
        continue
    places.append({
        "id": int(row[0]),
        "name": row[1],
        "ascii": row[2],
        "lat": float(row[4]),
        "lon": float(row[5]),
        "region": regions.get(f"AL.{row[10]}", ""),
        "population": int(row[14] or 0),
    })

places.sort(key=lambda place: (-place["population"], place["name"], place["id"]))
OUT.write_text(json.dumps({"source": URL, "retrieved": date.today().isoformat(), "places": places}, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Wrote {len(places)} places to {OUT}")
