"""Create six original Equivoque coaching diagrams and a silent walkthrough.

Run with Python + Pillow and ffmpeg from the repository root. This is an
illustrated coaching animation, not filmed performance. All artwork is drawn
by code. Source helpers and the visual palette live in build-lesson-media.py.
"""
from __future__ import annotations

import argparse
import importlib.util
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "lesson-media"
spec = importlib.util.spec_from_file_location("lesson_media", Path(__file__).with_name("build-lesson-media.py"))
media = importlib.util.module_from_spec(spec)
spec.loader.exec_module(media)
W, H, FPS, DURATION = 960, 720, 15, 36
BG, PANEL, EDGE = media.BG, media.PANEL, media.EDGE
TEXT, MUTED, GOLD, MINT, CYAN = media.TEXT, media.MUTED, media.GOLD, media.MINT, media.CYAN
txt, rounded, arrow, object_icon = media.txt, media.rounded, media.arrow, media.object_icon

START = {"Key": (170, 340), "Coin": (350, 340), "Stone": (530, 340)}
PARK = {"Key": (767, 350), "Stone": (862, 416)}
TITLES = ["Step 1 · Set up the table", "Step 2 · Choose your target", "Step 3 · Keep the selected pair",
          "Step 4 · Set selected Key aside", "Step 5 · Replay an alternative", "Step 6 · Rehearse all five paths"]
SUBTITLES = ["Participant at the far side; performer at the near side.",
             "Teaching view: the target highlight is not part of the real table.",
             "Example A: participant touches Key + Coin.",
             "Continue Example A: participant now touches Key.",
             "NEW ATTEMPT: reset all three, then touch Key + Stone.",
             "Start with all three objects again before each practice attempt."]
CAPTIONS = [
    ("Key left · Coin centre · Stone right.", "Clear a parking area outside play."),
    ("Choose Coin as the target before beginning.", "Say: “Touch two objects.”"),
    ("“We will work with those two.", "Set the other object aside.”"),
    ("“Set that one aside.", "We will keep the object that remains.”"),
    ("“Set those two aside.", "Let us focus on the object that remains.”"),
    ("Rehearse each branch, wording and movement.", "Use the interactive lab to try every path."),
]


def ease(p):
    p = max(0, min(1, p))
    return p*p*(3-2*p)


def mix(a, b, p):
    return a[0]+(b[0]-a[0])*p, a[1]+(b[1]-a[1])*p


def object_position(name, p):
    if name != "Key" or p <= 0:
        return mix(START[name],PARK.get(name,START[name]),p)
    # Follow the visible arrow above Coin, rather than passing through it.
    points = [START["Key"], (170,272), (767,272), PARK["Key"]]
    lengths = [math.dist(a,b) for a,b in zip(points,points[1:])]
    distance = sum(lengths)*p
    for a,b,length in zip(points,points[1:],lengths):
        if distance <= length:return mix(a,b,distance/length)
        distance -= length
    return points[-1]


def person(d, x, y, label, far=True):
    # Simple symbolic orientation markers, not a physical handling claim.
    d.ellipse((x-12,y-16,x+12,y+8),fill=CYAN if far else GOLD)
    d.arc((x-30,y+2,x+30,y+38),180,360,fill=CYAN if far else GOLD,width=5)
    if far:
        txt(d,(x,y-54),label,28,CYAN,True,anchor="ma")
    else:
        txt(d,(x+72,y-10),label,28,GOLD,True)


def pointer(d, x, y):
    # A downward index finger and palm; used only to mark a touched object.
    rounded(d,(x-7,y-4,x+7,y+46),fill=CYAN,outline=CYAN,radius=7)
    rounded(d,(x-22,y-30,x+19,y+7),fill=CYAN,outline=CYAN,radius=12)
    d.line((x-16,y-3,x-29,y+15),fill=CYAN,width=9)
    d.ellipse((x-4,y+41,x+4,y+49),fill=TEXT)


def path_arrow(d, name):
    if name == "Key":
        # Route the Key above Coin so the two motions remain distinct.
        d.line([(170,315),(170,272),(767,272),(767,300)],fill=MINT,width=4)
        arrow(d,(767,300),(767,317),MINT,4,12)
    else:
        arrow(d,(577,366),(828,405),MINT,4,13)


def draw_object(d, name, position, parked=0, selected=False, target=False):
    x,y = position
    scale = 1.12-.32*parked
    r = 58-15*parked
    if selected:
        d.ellipse((x-r,y-r,x+r,y+r),outline=MINT,width=4)
    if target:
        d.ellipse((x-r-6,y-r-6,x+r+6,y+r+6),outline=GOLD,width=3)
    object_icon(d,name,x,y,scale)
    txt(d,(x,y+70-36*parked),name,30,TEXT,True,anchor="ma")


def table_scene(d, step, p=1):
    rounded(d,(40,226,680,491),fill="#213039",outline="#6d858d",width=3,radius=24)
    rounded(d,(710,226,920,491),fill="#152027",outline=CYAN,width=3,radius=20)
    txt(d,(815,151),"PARKING",28,CYAN,True,anchor="ma")
    txt(d,(815,184),"Outside play",28,MUTED,anchor="ma")
    txt(d,(65,184),"IN PLAY",28,MUTED,True)
    person(d,350,205,"Participant",True)
    person(d,350,519,"Performer",False)
    parked = {"Key": 0, "Coin": 0, "Stone": 0}
    if step==2:
        parked["Stone"] = p
        if p>0:path_arrow(d,"Stone")
    elif step==3:
        parked["Stone"] = 1
        parked["Key"] = p
        if p>0:path_arrow(d,"Key")
    elif step==4:
        parked["Key"] = parked["Stone"] = p
        if p>0:
            path_arrow(d,"Key")
            path_arrow(d,"Stone")
    selected = ("Key","Coin") if step==2 else ("Key",) if step==3 else ("Key","Stone") if step==4 else ()
    for name in ("Key","Coin","Stone"):
        pp = parked[name]
        pos = object_position(name,pp)
        draw_object(d,name,pos,pp,name in selected and pp <.05,step>=1 and name=="Coin")
    # Show touch gestures during the steady selection beat before moving.
    if step in (2,3,4) and p<.05:
        for name in selected:
            x,y = START[name]
            pointer(d,x,y-91)
    if all(v==0 for v in parked.values()):
        txt(d,(815,372),"Clear space",28,MUTED,anchor="ma")
    if step>=1 and not (step in (3,4) and p>=.99):
        txt(d,(350,444),"Target: Coin",28,GOLD,anchor="ma")
    if step in (3,4) and p>=.99:
        rounded(d,(265,449,436,488),fill="#264c3d",outline=MINT,radius=12)
        txt(d,(350,451),"Coin remains",28,MINT,True,anchor="ma")


PATHS = [("Key + Coin", "Key", "Set Key aside → Coin"),
         ("Key + Coin", "Coin", "Keep Coin"),
         ("Coin + Stone", "Stone", "Set Stone aside → Coin"),
         ("Coin + Stone", "Coin", "Keep Coin"),
         ("Key + Stone", "No next touch", "Set both aside → Coin")]


def rehearsal(d, active=None):
    txt(d,(65,164),"First pair",28,CYAN,True)
    txt(d,(351,164),"Next touch",28,CYAN,True)
    txt(d,(588,164),"Action and result",28,MINT,True)
    for i,(pair,touch,result) in enumerate(PATHS):
        y = 219+i*65
        rounded(d,(40,y-9,920,y+46),outline=GOLD if active==i else EDGE,width=3 if active==i else 2,radius=14)
        txt(d,(64,y),pair,28,TEXT,True)
        txt(d,(351,y),touch,28,TEXT)
        txt(d,(588,y),result,28,MINT)
    d.line((325,153,325,529),fill=EDGE,width=2)
    d.line((560,153,560,529),fill=EDGE,width=2)


def render(step, p=1, t=None):
    im,d = media.base(TITLES[step],SUBTITLES[step])
    if step==5:
        rehearsal(d,None if t is None else min(4,int((t%6)/1.2)))
    else:
        table_scene(d,step,p)
    rounded(d,(40,563,920,650),outline=GOLD,radius=16)
    txt(d,(480,570),CAPTIONS[step][0],30,GOLD,True,anchor="ma")
    txt(d,(480,611),CAPTIONS[step][1],30,TEXT,anchor="ma")
    if t is not None:
        media.progress(d,t,DURATION)
    media.footer(d,"Original coaching diagram • entertainment practice • not filmed footage")
    return im


def frame(t):
    step = min(5,int(t/6))
    local = t-step*6
    # Two seconds to read the selection, two to move, two to study the result.
    p = ease((local-2)/2) if step in (2,3,4) else 1
    return render(step,p,t)


def encode(path):
    cmd=["ffmpeg","-hide_banner","-loglevel","error","-y","-f","rawvideo","-vcodec","rawvideo",
         "-pixel_format","rgb24","-video_size",f"{W}x{H}","-framerate",str(FPS),"-i","pipe:0",
         "-an","-c:v","libx264","-preset","fast","-crf","24","-pix_fmt","yuv420p",
         "-movflags","+faststart",str(path)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(DURATION*FPS):proc.stdin.write(frame(i/FPS).tobytes())
    finally:
        proc.stdin.close()
    if proc.wait()!=0:raise RuntimeError("Walkthrough MP4 generation failed")


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--images-only",action="store_true")
    parser.add_argument("--contact-sheet",type=Path)
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    images=[]
    for step in range(6):
        im=render(step)
        im.save(OUT/f"equivoque-setup-{step+1}.png",optimize=True)
        images.append(im)
        print(f"Created equivoque-setup-{step+1}.png",flush=True)
    if not args.images_only:
        encode(OUT/"equivoque-walkthrough.mp4")
        print(f"Created equivoque-walkthrough.mp4 ({DURATION}s)",flush=True)
    if args.contact_sheet:
        sheet=Image.new("RGB",(W*2,H*3),BG)
        for i,im in enumerate(images):sheet.paste(im,((i%2)*W,(i//2)*H))
        args.contact_sheet.parent.mkdir(parents=True,exist_ok=True)
        sheet.save(args.contact_sheet)


if __name__=="__main__":main()
