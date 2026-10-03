"""Regenerate original offline lesson diagrams and captioned MP4 explainers.

Requirements: Python, Pillow and ffmpeg on PATH. Run from the repository root:
    python scripts/build-lesson-media.py
All illustrations are drawn here; no external images, video or audio are used.
The clips explain concepts, rather than claiming to show physical performance.
"""
from __future__ import annotations

import argparse
import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "lesson-media"
W, H, FPS = 960, 720, 15
BG = "#101419"
PANEL = "#1b242b"
EDGE = "#3e515b"
TEXT = "#f2f3f3"
MUTED = "#bdc8cb"
GOLD = "#f0d18d"
MINT = "#8cddb0"
CYAN = "#8cbadf"
RED = "#f5a597"


def font(size: int, bold: bool = False):
    paths = [Path("C:/Windows/Fonts/seguisb.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
             Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")]
    for path in paths:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    raise RuntimeError("Install Segoe UI or DejaVu Sans before generating lesson media.")


FONTS = {(s, b): font(s, b) for s in (28, 30, 32, 34, 36, 40, 42, 46, 48) for b in (False, True)}


def txt(d, xy, value, size=30, color=TEXT, bold=False, anchor="la"):
    d.text(xy, value, font=FONTS[size, bold], fill=color, anchor=anchor)


def rounded(d, box, fill=PANEL, outline=EDGE, width=2, radius=20):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def arrow(d, start, end, color=MINT, width=5, head=14):
    d.line([start, end], fill=color, width=width)
    a = math.atan2(end[1] - start[1], end[0] - start[0])
    points = [end, (end[0] - head * math.cos(a - .55), end[1] - head * math.sin(a - .55)),
              (end[0] - head * math.cos(a + .55), end[1] - head * math.sin(a + .55))]
    d.polygon(points, fill=color)


def base(title, subtitle):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 7), fill=GOLD)
    txt(d, (40, 32), title, 46, GOLD, True)
    txt(d, (40, 94), subtitle, 28, MUTED)
    return im, d


def footer(d, text):
    d.line((40, 668, 920, 668), fill=EDGE, width=2)
    txt(d, (480, 681), text, 28, MUTED, anchor="ma")


def star(d, x, y, r=38, color=GOLD):
    pts = []
    for i in range(10):
        a = -math.pi/2 + i*math.pi/5
        rr = r if i % 2 == 0 else r*.45
        pts.append((x+math.cos(a)*rr, y+math.sin(a)*rr))
    d.polygon(pts, fill=color)


def object_icon(d, name, x, y, scale=1):
    s = scale
    if name == "Coin":
        r = 34*s
        d.ellipse((x-r, y-r, x+r, y+r), fill=GOLD, outline="#fff0c4", width=max(2, int(3*s)))
        d.ellipse((x-r+8*s, y-r+8*s, x+r-8*s, y+r-8*s), outline="#9e7841", width=max(2, int(3*s)))
        d.line((x, y-14*s, x, y+14*s), fill="#9e7841", width=max(3, int(5*s)))
    elif name == "Key":
        d.ellipse((x-38*s, y-24*s, x+6*s, y+20*s), outline=CYAN, width=max(3, int(8*s)))
        d.line((x+3*s, y-2*s, x+42*s, y-2*s), fill=CYAN, width=max(4, int(9*s)))
        d.line((x+27*s, y, x+27*s, y+16*s), fill=CYAN, width=max(4, int(8*s)))
        d.line((x+40*s, y, x+40*s, y+16*s), fill=CYAN, width=max(4, int(8*s)))
    elif name == "Star":
        star(d, x, y, 40*s, MINT)
    elif name == "Ring":
        d.ellipse((x-31*s, y-25*s, x+31*s, y+37*s), outline="#c0a9dc", width=max(4, int(9*s)))
        d.polygon([(x-15*s, y-23*s), (x, y-43*s), (x+15*s, y-23*s), (x, y-9*s)], fill="#d3c2e8")
    elif name == "Stone":
        d.polygon([(x-42*s,y+5*s),(x-26*s,y-28*s),(x+6*s,y-36*s),
                   (x+36*s,y-17*s),(x+42*s,y+16*s),(x+12*s,y+36*s),(x-24*s,y+29*s)],fill="#a4b2bf")
        d.line([(x-26*s,y-28*s),(x-3*s,y-6*s),(x+36*s,y-17*s)],fill="#d3dbe2",width=3)
        d.line([(x-3*s,y-6*s),(x+12*s,y+36*s)],fill="#718798",width=3)


OBJECTS = ("Key", "Coin", "Stone")


def object_row(d, y=165, selected=(), removed=(), target=True, pulse=0):
    for i, name in enumerate(OBJECTS):
        x = 40+i*300
        outline = MINT if name in selected else GOLD if name == "Coin" and target else EDGE
        rounded(d, (x, y, x+280, y+174), outline=outline, width=4 if name in selected else 2)
        object_icon(d, name, x+140, y+60, 1+(.04*math.sin(pulse) if name in selected else 0))
        txt(d, (x+140, y+102), name, 32, anchor="ma", bold=True)
        if name in removed:
            d.line((x+72, y+25, x+210, y+146), fill=RED, width=6)
        if name == "Coin" and target:
            txt(d, (x+140, y+140), "TARGET", 28, GOLD, anchor="ma")


def equivoque_overview():
    im, d = base("Equivoque: map every choice", "Teaching example: Coin is the predetermined target.")
    object_row(d, 142)
    arrow(d, (260, 330), (260, 360), GOLD)
    arrow(d, (705, 330), (705, 360), CYAN)
    rounded(d, (40, 365, 475, 632), outline=GOLD)
    rounded(d, (495, 365, 920, 632), outline=CYAN)
    txt(d, (60, 382), "Pair includes Coin", 32, GOLD, True)
    txt(d, (60, 429), "Keep the selected pair.", 30)
    txt(d, (60, 470), "Then select one:", 30, MUTED)
    txt(d, (60, 518), "Coin → keep Coin", 30, MINT)
    txt(d, (60, 565), "Other → remove other", 30, MINT)
    txt(d, (515, 382), "Pair excludes Coin", 32, CYAN, True)
    txt(d, (515, 429), "Selected: Key + Stone", 30)
    txt(d, (515, 470), "Remove both.", 30, MUTED)
    txt(d, (515, 518), "Coin remains.", 30, MINT)
    txt(d, (515, 565), "Finish immediately.", 30, MINT)
    footer(d, "Different interpretations lead to Coin. Entertainment only.")
    return im


EQUI_STAGES = [
    ("Choose a target before starting.", "Here, the target is Coin.", (), ()),
    ("Example 1: choose Coin + Key.", "The selected pair contains the target.", ("Coin", "Key"), ()),
    ("Keep the selected pair.", "Remove Stone.", ("Coin", "Key"), ("Stone",)),
    ("Now choose Coin: keep Coin.", "The target remains.", ("Coin",), ("Key", "Stone")),
    ("Example 2: choose Coin + Stone.", "Keep this pair; remove Key.", ("Coin", "Stone"), ("Key",)),
    ("Now choose Stone: remove Stone.", "The target remains through elimination.", ("Coin",), ("Key", "Stone")),
    ("Example 3: choose Key + Stone.", "The selected pair excludes the target.", ("Key", "Stone"), ()),
    ("Remove the selected pair.", "Discard Key + Stone. Only Coin remains.", ("Coin",), ("Key", "Stone")),
    ("Finish immediately at Coin.", "No second choice is needed on this path.", ("Coin",), ("Key", "Stone")),
    ("Rehearse every branch and physical action.", "Do not present this as a truly free outcome.", ("Coin",), ("Key", "Stone")),
]


def equivoque_frame(t):
    stage = min(int(t/3), len(EQUI_STAGES)-1)
    a, b, selected, removed = EQUI_STAGES[stage]
    im, d = base("Equivoque: three possible paths", "An illustrated branch rehearsal • target: Coin")
    object_row(d, 183, selected, removed, pulse=t*4)
    rounded(d, (40, 396, 920, 612), outline=MINT)
    txt(d, (60, 424), a, 32, MINT, True)
    txt(d, (60, 480), b, 30)
    txt(d, (60, 550), f"Stage {stage+1} / {len(EQUI_STAGES)}", 28, MUTED)
    progress(d, t, 30)
    footer(d, "Flexible interpretation, rehearsed in advance. Entertainment only.")
    return im


def letter_card(d, x, y, letter, color, pulse=0):
    rounded(d, (x-38, y-39, x+38, y+39), outline=color, width=3+int(pulse), radius=12)
    txt(d, (x, y-30), letter, 46, color, True, anchor="ma")


ONE_STAGES = [
    ("Start", "Nothing revealed", "Know A first", "Create a reliable source for the first known item."),
    ("Beat 1", "Reveal A", "Acquire B", "While revealing A, acquire the information for B."),
    ("Beat 2", "Reveal B", "Acquire C", "While revealing B, acquire the information for C."),
    ("Close", "Reveal C", "Use planned ending", "A prepared or independent closing beat ends the chain."),
]


def one_ahead_diagram(d, active=None, pulse=0):
    txt(d, (275, 157), "AUDIENCE SEES", 28, CYAN, True)
    txt(d, (612, 157), "PERFORMER TRACKS", 28, MINT, True)
    for i, (beat, audience, knowledge, _) in enumerate(ONE_STAGES):
        y = 217 + i*102
        col = GOLD if active == i else EDGE
        rounded(d, (40, y-18, 920, y+72), outline=col, width=4 if active == i else 2)
        txt(d, (62, y+4), beat, 30, GOLD, True)
        txt(d, (270, y+9), audience, 28, CYAN)
        txt(d, (605, y+9), knowledge, 28, MINT)
        if i > 0:
            letter_card(d, 221, y+26, "ABC"[i-1], CYAN, pulse if active == i else 0)
        else:
            d.ellipse((210, y+14, 230, y+34), outline=CYAN, width=3)
        if i < 3:
            letter_card(d, 560, y+26, "ABC"[i], MINT, pulse if active == i else 0)
        else:
            d.line((545, y+26, 556, y+38, 578, y+11), fill=MINT, width=5)
        if i < 3:
            arrow(d, (120, y+75), (120, y+84), GOLD, 3, 9)
    d.line((496, 201, 496, 597), fill=EDGE, width=2)


def one_ahead_overview():
    im, d = base("One-ahead: the information chain", "Conceptual information flow • plan the beginning and ending.")
    one_ahead_diagram(d)
    footer(d, "Each reveal supports the next. Plan an independent closing beat.")
    return im


def one_ahead_frame(t):
    stage = min(int(t/5), 3)
    im, d = base("One-ahead: the information chain", "Concept animation; this is not footage of a physical method.")
    one_ahead_diagram(d, stage, .5 + .5*math.sin(t*4))
    txt(d, (480, 615), ONE_STAGES[stage][3], 28, GOLD, anchor="ma")
    progress(d, t, 20)
    footer(d, "Audience and performer have different information at each beat.")
    return im


STOPS = [("Door", "Umbrella", (142, 513)), ("Sofa", "Tiger", (143, 316)),
         ("Lamp", "Orange", (330, 229)), ("Desk", "Drum", (525, 315)),
         ("Window", "Cloud", (526, 512))]


def mnemonic_icon(d, name, x, y, s=.8):
    if name == "Umbrella":
        d.pieslice((x-40*s, y-40*s, x+40*s, y+40*s), 180, 360, fill=CYAN)
        d.line((x, y, x, y+38*s), fill=TEXT, width=4)
        d.arc((x, y+27*s, x+19*s, y+48*s), 0, 180, fill=TEXT, width=4)
    elif name == "Tiger":
        d.ellipse((x-37*s, y-31*s, x+37*s, y+31*s), fill="#e8a85d")
        for side in (-1, 1):
            d.ellipse((x+side*26*s-9*s, y-40*s, x+side*26*s+9*s, y-20*s), fill="#e8a85d")
            d.line((x+side*24*s, y-14*s, x+side*13*s, y-8*s), fill=BG, width=4)
            d.line((x+side*28*s, y+4*s, x+side*16*s, y+10*s), fill=BG, width=4)
            d.ellipse((x+side*12*s-3*s, y-10*s, x+side*12*s+3*s, y-4*s), fill=BG)
        d.polygon([(x-5*s,y+6*s),(x+5*s,y+6*s),(x,y+12*s)], fill=BG)
        d.line((x,y-29*s,x,y-15*s),fill=BG,width=4)
    elif name == "Orange":
        d.ellipse((x-30*s,y-28*s,x+30*s,y+32*s),fill="#f2a754",outline=GOLD,width=2)
        d.ellipse((x+1*s,y-37*s,x+23*s,y-24*s),fill=MINT)
        d.arc((x-21*s,y-18*s,x+21*s,y+21*s),190,270,fill="#ffe0a8",width=3)
    elif name == "Drum":
        d.rectangle((x-32*s,y-16*s,x+32*s,y+27*s),fill="#b97e83",outline=TEXT,width=2)
        d.ellipse((x-32*s,y+14*s,x+32*s,y+35*s),fill="#b97e83",outline=TEXT,width=2)
        d.ellipse((x-32*s,y-27*s,x+32*s,y-6*s),fill=GOLD,outline=TEXT,width=2)
        for off in (-18,0,18):
            d.line((x+off*s,y-5*s,x+(off+9)*s,y+24*s),fill=TEXT,width=2)
        d.line((x-24*s,y-34*s,x+12*s,y-11*s),fill=TEXT,width=4)
        d.line((x+27*s,y-35*s,x-7*s,y-11*s),fill=TEXT,width=4)
    elif name == "Cloud":
        for a,b,r in [(-24,4,20),(-5,-12,25),(22,0,23)]:
            d.ellipse((x+(a-r)*s,y+(b-r)*s,x+(a+r)*s,y+(b+r)*s),fill=CYAN)
        rounded(d,(x-38*s,y+2*s,x+39*s,y+26*s),fill=CYAN,outline=CYAN,radius=8)


def furniture(d, index, x, y):
    col = "#668492"
    if index == 0:
        d.rectangle((x-35,y-43,x+35,y+43),outline=col,width=5)
        d.polygon([(x-30,y-37),(x+12,y-24),(x+12,y+47),(x-30,y+37)],fill="#416074",outline=col)
        d.ellipse((x+1,y+1,x+8,y+8),fill=GOLD)
    elif index == 1:
        rounded(d,(x-57,y-39,x+57,y+36),fill="#574962",outline="#b49cca",radius=14)
        rounded(d,(x-48,y-21,x+48,y+20),fill="#786786",outline="#b49cca",radius=8)
        d.line((x,y-20,x,y+18),fill="#c5b3d5",width=3)
        d.rectangle((x-48,y+37,x-39,y+45),fill="#b49cca")
        d.rectangle((x+39,y+37,x+48,y+45),fill="#b49cca")
    elif index == 2:
        d.polygon([(x-25,y-42),(x+25,y-42),(x+41,y-3),(x-41,y-3)],fill=GOLD)
        d.line((x,y,x,y+38),fill=col,width=6)
        d.ellipse((x-26,y+32,x+26,y+44),fill=col)
    elif index == 3:
        rounded(d,(x-59,y-30,x+59,y+22),fill="#71624b",outline=GOLD,radius=8)
        d.line((x-46,y+22,x-46,y+43),fill=GOLD,width=6)
        d.line((x+46,y+22,x+46,y+43),fill=GOLD,width=6)
    else:
        rounded(d,(x-53,y-38,x+53,y+38),fill="#304c60",outline=CYAN,radius=5,width=5)
        d.line((x,y-35,x,y+35),fill=CYAN,width=4)
        d.line((x-50,y,x+50,y),fill=CYAN,width=4)


def room(d, active=None, revealed=5, moving=0):
    rounded(d,(40,150,658,618),fill="#182127",outline=EDGE,width=3,radius=24)
    route = [s[2] for s in STOPS]
    for a,b in zip(route,route[1:]):
        arrow(d,a,b,"#405f62",4,14)
    for i,(place,word,(x,y)) in enumerate(STOPS):
        if active == i:
            d.ellipse((x-77,y-73,x+77,y+73),outline=GOLD,width=5)
        furniture(d,i,x,y)
        rounded(d,(x-68,y+51,x+68,y+88),fill=BG,outline=EDGE,radius=9)
        txt(d,(x,y+53),f"{i+1} {place}",28,anchor="ma")
        if i < revealed:
            mnemonic_icon(d,word,x+41,y-37,.7)
    if moving > 0:
        span = min(moving*4,3.999)
        i = int(span)
        frac = span-i
        a,b = route[i],route[i+1]
        x = a[0]+(b[0]-a[0])*frac
        y = a[1]+(b[1]-a[1])*frac
        d.ellipse((x-11,y-11,x+11,y+11),fill=MINT,outline=TEXT,width=3)
    for i,(place,word,_) in enumerate(STOPS):
        y = 150+i*94
        rounded(d,(680,y,920,y+82),outline=GOLD if active == i else EDGE,width=3 if active == i else 2,radius=14)
        txt(d,(698,y+5),f"{i+1}. {place}",28,MUTED)
        txt(d,(698,y+40),word if i < revealed else "Recall?",30,GOLD if active == i else TEXT,True)


def memory_palace_overview():
    im,d = base("Memory palace: a stable route", "Place one vivid image at each familiar location.")
    room(d)
    footer(d,"Door → Sofa → Lamp → Desk → Window. Revisit the route to recall.")
    return im


MEMORY_CAPTIONS = ["First choose a stable five-stop route.","At Door: an Umbrella bursts open.",
                   "At Sofa: a Tiger stretches across the cushions.","At Lamp: an Orange glows like a bulb.",
                   "At Desk: a Drum bounces on the tabletop.","At Window: a Cloud floats through the glass.",
                   "Walk the same route and retrieve each image.","Recall: Umbrella, Tiger, Orange, Drum, Cloud."]


def memory_palace_frame(t):
    stage = min(int(t/3),7)
    im,d = base("Memory palace: encode, then retrieve", "Illustrated associations • a trained memory technique")
    active = stage-1 if 1 <= stage <=5 else None
    room(d,active,0 if stage ==0 else min(stage,5), max(0,min(1,(t-18)/3)) if stage ==6 else 0)
    txt(d,(480,615),MEMORY_CAPTIONS[stage],28,GOLD,anchor="ma")
    progress(d,t,24)
    footer(d,"Keep the locations fixed; make each image specific, active and unusual.")
    return im


CONSENT_STAGES = [
    ("Explain", "Describe the activity and its limits."),
    ("Ask", "Ask for specific, voluntary consent."),
    ("Agree", "Agree a clear stop word or signal."),
    ("Check", "Check a safe seat and suitable setting."),
    ("STOP", 'Fictional participant: “I want to stop.” Stop immediately.'),
    ("Reorient", "Cancel temporary suggestions; reorient and debrief."),
]


def consent_icon(d,i,x,y,active=False):
    color=RED if i==4 else MINT if i==5 else GOLD if active else CYAN
    d.ellipse((x-34,y-34,x+34,y+34),outline=color,width=3)
    if i==0:
        rounded(d,(x-20,y-17,x+20,y+12),fill=BG,outline=color,radius=6)
        d.line((x-8,y+12,x-16,y+23,x-16,y+9),fill=color,width=3)
        for yy in (-8,0,8):d.line((x-11,y+yy,x+11,y+yy),fill=color,width=2)
    elif i==1:
        d.line((x-18,y,x-4,y+15,x+22,y-18),fill=color,width=5)
    elif i==2:
        d.rectangle((x-9,y-12,x+9,y+22),fill=color)
        for j,hh in enumerate((8,15,19,11)):
            d.line((x-12+j*8,y-6,x-12+j*8,y-6-hh),fill=color,width=6)
    elif i==3:
        d.line((x-15,y-22,x-15,y+8,x+20,y+8),fill=color,width=5)
        d.line((x-13,y+10,x-13,y+25),fill=color,width=4)
        d.line((x+17,y+10,x+17,y+25),fill=color,width=4)
    elif i==4:
        pts=[(x+26*math.cos(math.pi/8+j*math.pi/4),y+26*math.sin(math.pi/8+j*math.pi/4))for j in range(8)]
        d.polygon(pts,fill=color)
        d.line((x-11,y,x+11,y),fill=BG,width=5)
    else:
        d.arc((x-19,y-19,x+19,y+19),35,325,fill=color,width=5)
        arrow(d,(x+19,y-1),(x+18,y-13),color,3,10)


def consent_diagram(d,active=None):
    for i,(label,body) in enumerate(CONSENT_STAGES):
        y=174+i*75
        col=RED if i==4 else MINT if i==5 else GOLD if active==i else EDGE
        rounded(d,(40,y-15,920,y+50),outline=col,width=4 if active==i else 2,radius=16)
        consent_icon(d,i,89,y+17,active==i)
        txt(d,(140,y-3),label,30,RED if i==4 else MINT if i==5 else GOLD,True)
        # The long stop request is split into a short, explicit instruction.
        short=("Describe the activity and its limits.", "Ask for specific, voluntary consent.",
               "Agree a clear stop word or signal.", "Check a safe seat and setting.",
               "Discomfort / stop request: stop now.", "Cancel suggestions; reorient; debrief.")[i]
        txt(d,(322,y),short,28,TEXT)
        if i<5:arrow(d,(89,y+52),(89,y+57),RED if i>=3 else MINT,3,8)


def consent_overview():
    im,d=base("Consent: the participant stays in control", "A process diagram for a voluntary, nonclinical activity.")
    consent_diagram(d)
    footer(d,"Consent can be withdrawn at any time. Stop and debrief without pressure.")
    return im


def consent_frame(t):
    stage=min(int(t/4),5)
    im,d=base("Consent and stopping: a fictional example", "The activity ends immediately when the participant asks to stop.")
    consent_diagram(d,stage)
    # A direct stop caption appears in the highlighted stop row.
    if stage==4:
        rounded(d,(315,459,908,513),fill="#50312f",outline=RED,width=2,radius=12)
        txt(d,(332,468),'“I want to stop.” → STOP NOW',30,RED,True)
    progress(d,t,24)
    footer(d,"Cancel suggestions, reorient and debrief. Never push through.")
    return im


def progress(d,t,duration):
    d.line((40,658,920,658),fill=EDGE,width=4)
    d.line((40,658,40+880*min(1,t/duration),658),fill=GOLD,width=4)


ASSETS = {
    "equivoque":(equivoque_overview,equivoque_frame,30),
    "one-ahead":(one_ahead_overview,one_ahead_frame,20),
    "memory-palace":(memory_palace_overview,memory_palace_frame,24),
    "consent":(consent_overview,consent_frame,24),
}


def video(path,render,duration):
    cmd=["ffmpeg","-hide_banner","-loglevel","error","-y","-f","rawvideo","-vcodec","rawvideo",
         "-pixel_format","rgb24","-video_size",f"{W}x{H}","-framerate",str(FPS),"-i","pipe:0",
         "-an","-c:v","libx264","-preset","fast","-crf","24","-pix_fmt","yuv420p",
         "-movflags","+faststart",str(path)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for frame in range(duration*FPS):
            proc.stdin.write(render(frame/FPS).tobytes())
    finally:
        proc.stdin.close()
    if proc.wait()!=0:raise RuntimeError(f"ffmpeg failed for {path.name}")


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--images-only",action="store_true")
    parser.add_argument("--only",choices=ASSETS)
    parser.add_argument("--contact-sheet",type=Path)
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    if not args.images_only and not shutil.which("ffmpeg"):
        raise RuntimeError("ffmpeg is required for MP4 generation.")
    selected={args.only:ASSETS[args.only]} if args.only else ASSETS
    images=[]
    for name,(overview,render,duration) in selected.items():
        im=overview()
        im.save(OUT/f"{name}.png",optimize=True)
        images.append(im)
        print(f"Created {name}.png",flush=True)
        if not args.images_only:
            video(OUT/f"{name}.mp4",render,duration)
            print(f"Created {name}.mp4 ({duration}s, {FPS}fps)",flush=True)
    if args.contact_sheet:
        sheet=Image.new("RGB",(W*2,H*2),BG)
        for i,im in enumerate(images):sheet.paste(im,((i%2)*W,(i//2)*H))
        args.contact_sheet.parent.mkdir(parents=True,exist_ok=True)
        sheet.save(args.contact_sheet)


if __name__=="__main__":main()
