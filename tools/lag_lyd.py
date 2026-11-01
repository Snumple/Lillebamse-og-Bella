"""Make the read-aloud mp3 files for the stories (Tordenborgen and Den røde hetta) and the
spoken lines in the games (Kalkunkongen).

Runs each story table in a small JavaScript engine, collects every paragraph in every variant
(flags, pony names, endings), and records each one with Microsoft's free neural Norwegian voice
through the edge-tts package. Game lines live in a <script id="stemmer"> block in the game page,
each with its own voice, and are named by a hash of "who|text". Files are named by the same hash
the pages use, so only new or changed lines are recorded; unused files are removed. Also writes
lyd/liste.json, which the offline app (sw.js) uses to store all the sound files on the device.

    python -m pip install edge-tts mini-racer
    python tools/lag_lyd.py
"""
import asyncio
import json
import pathlib
import re

import edge_tts
from py_mini_racer import MiniRacer

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "lyd"
VOICE = "nb-NO-PernilleNeural"
RATE = "-8%"

# story file, the flags its text depends on, and the pony names (Tordenborgen only)
STORIES = [
    ("tordenborgen.html", ["sang", "tree", "plank", "blanket", "rope", "promise", "askbro"], ["", "Kanel", "Månelys", "Tusenfryd"]),
    ("rodhette.html", ["drawing", "flowers", "told", "secret", "peek", "chores", "pack", "surprise", "lure", "sneak", "unmask"], [""]),
]

# game pages with a <script type="application/json" id="stemmer"> block of voices and lines
GAMES = ["kalkunkongen.html", "skoleveien.html", "lillabilen.html", "bursdag.html", "gjemsel.html", "overnatting.html", "ferie.html"]

ENUMERATE = r"""
function allParagraphs(flags,ponies){
  const out=new Set();
  const stats=[[3,0,0],[0,3,0],[0,0,3]];
  const variants=[];
  for(let mask=0;mask<(1<<flags.length);mask++)for(const pony of ponies){
    const F={};flags.forEach((f,i)=>{if(mask&(1<<i))F[f]=true});if(pony)F.pony=pony;variants.push(F);
  }
  for(const id in P){
    const n=P[id];
    for(const F of (typeof n.text==='function'?variants:[{}]))for(const st of stats){
      S.v=st[0];S.m=st[1];S.k=st[2];
      const t=typeof n.text==='function'?n.text(F):n.text;
      t.forEach(p=>out.add(p.replace(/^– /,'')));
    }
    // every choice and small game must lead to a page that exists
    const ch=typeof n.choices==='function'?n.choices({}):(n.choices||[]);
    for(const c of ch)if(c.go!=='restart'&&c.go!=='home'&&!P[c.go])throw new Error(id+' -> '+c.go);
    if(n.mini&&!P[n.mini.go])throw new Error(id+' -> '+n.mini.go);
  }
  return JSON.stringify([...out]);
}
"""


def story_paragraphs(file, flags, ponies):
    html = (ROOT / file).read_text(encoding="utf-8")
    start = html.index("/* ---------- the story ---------- */")
    end = html.index("\n};\n", start) + 3
    js = "const S={v:0,m:0,k:0,F:{}};\n" + html[start:end] + ENUMERATE
    js += f"allParagraphs({json.dumps(flags)},{json.dumps(ponies, ensure_ascii=False)})"
    return json.loads(MiniRacer().eval(js))


def hash_of(text):
    """FNV-1a over UTF-16 code units, the same as hashOf() in the page."""
    h = 0x811C9DC5
    data = text.encode("utf-16-le")
    for i in range(0, len(data), 2):
        h ^= data[i] | (data[i + 1] << 8)
        h = (h * 16777619) & 0xFFFFFFFF
    return f"{h:08x}"


def game_lines(file):
    html = (ROOT / file).read_text(encoding="utf-8")
    m = re.search(r'<script type="application/json" id="stemmer">(.*?)</script>', html, re.S)
    data = json.loads(m.group(1))
    for who, lines in data["lines"].items():
        voice, rate, pitch = data["voices"][who]
        for text in lines:
            yield f"{who}|{text}", text, (voice, rate, pitch)


async def main():
    OUT.mkdir(exist_ok=True)
    wanted = {}  # file name -> (text, (voice, rate, pitch))
    for file, flags, ponies in STORIES:
        for p in story_paragraphs(file, flags, ponies):
            wanted[hash_of(p)] = (p, (VOICE, RATE, "+0Hz"))
    for file in GAMES:
        for key, text, voice in game_lines(file):
            wanted[hash_of(key)] = (text, voice)
    made = 0
    for name, (text, (voice, rate, pitch)) in wanted.items():
        path = OUT / f"{name}.mp3"
        if path.exists() and path.stat().st_size > 0:
            continue
        try:
            await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(str(path))
        except Exception:
            path.unlink(missing_ok=True)  # never leave an empty file behind that would be skipped next time
            raise
        made += 1
    removed = 0
    for path in OUT.glob("*.mp3"):
        if path.stem not in wanted:
            path.unlink()
            removed += 1
    (OUT / "liste.json").write_text(json.dumps(sorted(f"{n}.mp3" for n in wanted)), encoding="utf-8")
    print(f"{len(wanted)} avsnitt, {made} nye lydfiler, {removed} fjernet")


if __name__ == "__main__":
    asyncio.run(main())
