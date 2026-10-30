"""Make the read-aloud mp3 files for Tordenborgen.

Runs the story table from tordenborgen.html in a small JavaScript engine, collects every paragraph
in every variant (flags, pony names, endings), and records each one with Microsoft's free
neural Norwegian voice through the edge-tts package. Files are named by the same hash the page
uses, so only new or changed paragraphs are recorded; unused files are removed.

    python -m pip install edge-tts mini-racer
    python tools/lag_lyd.py
"""
import asyncio
import json
import pathlib

import edge_tts
from py_mini_racer import MiniRacer

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "lyd"
VOICE = "nb-NO-PernilleNeural"
RATE = "-8%"

ENUMERATE = r"""
function allParagraphs(){
  const out=new Set();
  const flags=['sang','tree','plank','blanket','rope','promise','askbro'];
  const ponies=['','Kanel','Månelys','Tusenfryd'];
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
  }
  return JSON.stringify([...out]);
}
allParagraphs()
"""


def story_paragraphs():
    html = (ROOT / "tordenborgen.html").read_text(encoding="utf-8")
    start = html.index("const P={")
    end = html.index("\n};\n", start) + 3
    js = "const S={v:0,m:0,k:0,F:{}};\n" + html[start:end] + ENUMERATE
    return json.loads(MiniRacer().eval(js))


def hash_of(text):
    """FNV-1a over UTF-16 code units, the same as hashOf() in the page."""
    h = 0x811C9DC5
    data = text.encode("utf-16-le")
    for i in range(0, len(data), 2):
        h ^= data[i] | (data[i + 1] << 8)
        h = (h * 16777619) & 0xFFFFFFFF
    return f"{h:08x}"


async def main():
    OUT.mkdir(exist_ok=True)
    paragraphs = story_paragraphs()
    wanted = {hash_of(p): p for p in paragraphs}
    made = 0
    for name, text in wanted.items():
        path = OUT / f"{name}.mp3"
        if path.exists():
            continue
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(path))
        made += 1
    removed = 0
    for path in OUT.glob("*.mp3"):
        if path.stem not in wanted:
            path.unlink()
            removed += 1
    print(f"{len(wanted)} avsnitt, {made} nye lydfiler, {removed} fjernet")


if __name__ == "__main__":
    asyncio.run(main())
