"""Estimate cold-cache font requests for text: python scripts/font-transfer.py article.txt"""
import argparse
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('text', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'public/fonts/lxgw-subsets/manifest.json').read_text())
points = set(map(ord, args.text.read_text(encoding='utf-8')))
matched, covered = [], set()
for entry in manifest['subsets']:
    ranges = []
    for value in entry['unicodeRange'].split(','):
        ends = value[2:].split('-')
        ranges.append((int(ends[0], 16), int(ends[-1], 16)))
    hits = {p for p in points if any(a <= p <= b for a, b in ranges)}
    covered.update(hits)
    if hits:
        matched.append(dict(name=entry['name'], bytes=entry['bytes'], matchedCharacters=len(hits)))
print(json.dumps(dict(uniqueCharacters=len(points), matchedCharacters=len(covered), packages=len(matched), bytes=sum(e['bytes'] for e in matched), sourceBytes=manifest['sourceBytes'], subsets=matched), ensure_ascii=False, indent=2))
