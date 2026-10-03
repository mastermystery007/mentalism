"""Draw and encode ten original instruction sets; no third-party media is used.

Python 3.10+, Pillow and FFmpeg/libx264 are required only for regeneration.
All 50 PNGs and ten MP4s are checked in. The app needs no generator at runtime.
"""
from __future__ import annotations
import argparse
import json
import math
import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'lesson-media'
DEFINITIONS = json.loads((ROOT / 'src/visuals/expanded-lessons.json').read_text(encoding='utf-8'))
W, H, FPS, SECONDS = 960, 720, 12, 8
BG, PANEL, EDGE = '#101419', '#1b2832', '#52646f'
TEXT, MUTED, GOLD, MINT, BLUE, RED = '#f2f4f5', '#bdcbd4', '#f0d18d', '#8cddb0', '#8cbadf', '#f5a597'
FONTS = {}

def font(size, bold=False):
    key = (size, bold)
    if key not in FONTS:
        paths = [Path('C:/Windows/Fonts/seguisb.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf'), Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')]
        file = next((p for p in paths if p.exists()), None)
        if not file:
            raise RuntimeError('Install Segoe UI or DejaVu Sans before regeneration.')
        FONTS[key] = ImageFont.truetype(str(file), size)
    return FONTS[key]

def text(d, xy, value, size=26, color=TEXT, bold=False, anchor='la'):
    d.text(xy, value, font=font(size, bold), fill=color, anchor=anchor)

def wrap(d, value, width, size):
    lines, line = [], ''
    for word in value.split():
        trial = f'{line} {word}'.strip()
        if d.textlength(trial, font=font(size)) > width and line:
            lines.append(line)
            line = word
        else:
            line = trial
    return lines + [line]

def paragraph(d, xy, value, width, size=26, color=TEXT, max_lines=4):
    lines = wrap(d, value, width, size)
    if len(lines) > max_lines:
        raise ValueError(f'Text overflows {max_lines} lines: {value}')
    x, y = xy
    for line in lines:
        text(d, (x, y), line, size, color)
        y += size + 9

def box(d, bounds, color=EDGE, fill=PANEL, width=2):
    d.rounded_rectangle(bounds, radius=15, fill=fill, outline=color, width=width)

def arrow(d, start, end, color=GOLD, width=4):
    d.line([start, end], fill=color, width=width)
    angle = math.atan2(end[1]-start[1], end[0]-start[0])
    x, y = end
    d.polygon([(x, y), (x-15*math.cos(angle-.5), y-15*math.sin(angle-.5)), (x-15*math.cos(angle+.5), y-15*math.sin(angle+.5))], fill=color)

def person(d, x, y, color=BLUE):
    d.ellipse((x-18, y-18, x+18, y+18), outline=color, width=4)
    d.arc((x-40, y+15, x+40, y+70), 180, 360, fill=color, width=4)

def symbol(d, index, x, y, size=34, color=BLUE):
    if index == 0:
        d.ellipse((x-size, y-size, x+size, y+size), outline=color, width=5)
    elif index == 1:
        d.line([(x, y-size), (x+size, y+size), (x-size, y+size), (x, y-size)], fill=color, width=5)
    elif index == 2:
        d.line((x-13, y-size, x-13, y+size), fill=color, width=6)
        d.line((x+13, y-size, x+13, y+size), fill=color, width=6)
    elif index == 3:
        for dx in (-22, 0, 22):
            d.ellipse((x+dx-6, y-6, x+dx+6, y+6), fill=color)
    else:
        points = [(x-size+i, y+math.sin(i/size*math.pi)*17) for i in range(size*2+1)]
        d.line(points, fill=color, width=5)

def scene(d, kind, step):
    if kind == 'observation':
        person(d, 126, 177); person(d, 823, 177)
        box(d, (208, 145, 744, 234), GOLD if step in (0, 1) else EDGE)
        text(d, (476, 168), 'Neutral reply → later pause: 4 s', 28, anchor='ma')
        labels = [('FACT', 'Paused for 4 seconds'), ('HYPOTHESES', 'Memory? Uncertainty?'), ('FOLLOW-UP', 'Was the choice difficult?')]
        for i, (label, detail) in enumerate(labels):
            x = 38+i*300
            box(d, (x, 280, x+284, 441), GOLD if i == min(max(step-1, 0), 2) else EDGE)
            text(d, (x+16, 298), label, 24, MINT, True)
            paragraph(d, (x+16, 339), detail, 251, 26, max_lines=2)
            if i < 2: arrow(d, (x+285, 356), (x+299, 356), BLUE, 3)
    elif kind == 'forces':
        for i, name in enumerate(['Circle', 'Triangle', 'Square']):
            x=182+i*296
            box(d, (x-112, 145, x+112, 319), GOLD if i == 0 else EDGE)
            if i < 2: symbol(d, i, x, 206, 35, GOLD if i == 0 else BLUE)
            else: d.rectangle((x-33, 173, x+33, 239), outline=BLUE, width=5)
            text(d, (x, 266), name, 28, anchor='ma')
        text(d, (66, 342), 'EXAMPLE DATA · 12 hits / 20 trials', 24, MUTED)
        box(d, (66, 385, 894, 419)); d.rounded_rectangle((66, 385, 563, 419), radius=10, fill=MINT)
        text(d, (480, 434), 'Hit → planned reveal     Miss → accept + transition', 24, GOLD, anchor='ma')
    elif kind == 'drawing':
        x, y = 262, 230
        d.rectangle((x-115, y+4, x+115, y+150), outline=GOLD if step >= 1 else EDGE, width=5)
        d.line([(x-140,y+4),(x,y-95),(x+140,y+4)],fill=GOLD if step >= 2 else EDGE,width=6)
        if step >= 3: d.rectangle((x-26,y+72,x+26,y+150),outline=MINT,width=5)
        d.line((100, 423, 421, 423), fill=BLUE, width=3)
        text(d, (260, 434), 'Openly known sample: House', 24, MUTED, anchor='ma')
        labels=['Orientation','Geometry','Category','Distinctive feature','Exact identity']
        active=[0,0,1,3,4][step]
        for i, label in enumerate(labels):
            box(d,(495,142+i*59,914,191+i*59),GOLD if i==active else EDGE)
            text(d,(516,152+i*59),f'{i+1} · {label}',25,MINT if i<=active else MUTED)
    elif kind == 'prediction':
        for i, name in enumerate(['Key','Coin','Stone']):
            x=58+i*298
            color=GOLD if i==1 and step in (2,3) else EDGE
            box(d,(x,150,x+248,306),color)
            d.line([(x,154),(x+124,228),(x+248,154)],fill=color,width=3)
            text(d,(x+124,257),f'{chr(65+i)} · {name}',28,anchor='ma')
        box(d,(145,350,815,436),MINT)
        text(d,(480,367),'Coin choice → route B → prepared Coin card',27,MINT,anchor='ma')
        arrow(d,(480,350),(480,310),GOLD)
        text(d,(480,443),'Training index visible · contents fixed before choice',23,MUTED,anchor='ma')
    elif kind == 'book':
        box(d,(42,146,529,444)); d.line((285,146,285,444),fill=EDGE,width=3)
        paragraph(d,(64,169),'A lantern lit the path. Beyond the forest,',200,27,max_lines=5)
        paragraph(d,(305,169),'a rocket traced a bright arc across the evening sky.',200,27,max_lines=6)
        word_x=64+d.textlength('A ',font=font(27))
        word_width=d.textlength('lantern',font=font(27))
        d.rounded_rectangle((word_x-3,168,word_x+word_width+3,202),radius=6,outline=GOLD,width=3)
        box(d,(585,152,910,437),GOLD)
        d.arc((705,180,789,244),180,360,fill=BLUE,width=5)
        d.rectangle((687,227,807,343),outline=BLUE,width=5)
        d.ellipse((724,254,770,323),fill=GOLD)
        text(d,(747,363),'Lantern',28,GOLD,anchor='ma')
        text(d,(747,404),'Image → category → detail',22,MUTED,anchor='ma')
    elif kind == 'effect':
        labels=['COMMIT','CHOOSE','REVEAL']
        for i,label in enumerate(labels):
            x=54+i*300
            box(d,(x,163,x+252,285),GOLD if i==min(step//2,2) else EDGE)
            text(d,(x+126,206),label,30,GOLD,True,anchor='ma')
            if i<2: arrow(d,(x+254,224),(x+298,224),BLUE)
        for i,label in enumerate(['Repeat display','Inspect again','Repeat rules']):
            x=54+i*300; box(d,(x,340,x+252,415),EDGE)
            text(d,(x+126,355),label,25,MUTED,anchor='ma')
            if step>=3: d.line((x+12,349,x+240,404),fill=RED,width=4)
        text(d,(480,440),'Keep actions that establish a meaningful condition.',25,MINT,anchor='ma')
    elif kind == 'attention':
        person(d,190,163); person(d,765,163)
        box(d,(50,287,910,414))
        focus=[(205,320),(765,180),(740,338)][0 if step<2 else 1 if step==2 else 2]
        for x in (190,765): arrow(d,(x,204),focus,GOLD,3)
        d.rectangle((156,315,252,376),outline=BLUE,width=4)
        d.line((403,355,519,355),fill=MINT,width=6)
        d.rectangle((685,312,813,376),outline=MINT,width=4)
        for x,label in [(202,'Display'),(463,'Pen handover'),(747,'Reveal')]: text(d,(x,423),label,25,anchor='ma')
        text(d,(480,247),'QUESTION BEAT' if step==2 else 'INTEREST IS A MODEL, NOT A GAZE MEASUREMENT',23,MUTED,anchor='ma')
    elif kind == 'symbols':
        names=['Circle','Triangle','Twin bars','Three dots','Wave']
        row=[0,1,2,3,4] if step in (0,1,4) else [0,2,1,4,3]
        text(d,(36,139),'PERFORMER',23,MUTED); text(d,(36,294),'PARTICIPANT',23,MUTED)
        for i,name in enumerate(names):
            x=116+i*181
            symbol(d,i,x,210,28); text(d,(x,252),name,22,anchor='ma')
            symbol(d,row[i],x,354,28)
            if step==3 and row[i]==i: arrow(d,(x,248),(x,316),MINT,3)
        text(d,(480,416),'Same symbol + same position = one visible match',26,MINT,anchor='ma')
        text(d,(480,452),'Arrangement rehearsal · no ESP claim',23,MUTED,anchor='ma')
    elif kind == 'hypnosis-model':
        person(d,124,178,MINT)
        box(d,(58,281,190,362),RED); text(d,(124,303),'STOP',27,RED,True,anchor='ma')
        for i,label in enumerate(['Attention','Imagination','Suggestion']):
            x=244+i*230
            box(d,(x,160,x+202,279),GOLD if i==min(step,2) else EDGE)
            text(d,(x+101,201),label,26,anchor='ma')
        if step==2:
            for i,(label,length) in enumerate([('No change',0),('Small change',150),('Noticeable change',320)]):
                y=323+i*37
                text(d,(248,y),label,23,MUTED)
                d.rounded_rectangle((490,y+3,895,y+23),radius=6,fill=PANEL)
                if length: d.rounded_rectangle((490,y+3,490+length,y+23),radius=6,fill=MINT)
            text(d,(560,438),'Schematic examples · no assessment',23,MUTED,anchor='ma')
        else:
            box(d,(245,323,913,432),MINT)
            paragraph(d,(267,343),'Agency remains visible. Responses vary. No guarantee of obedience or truth.',622,28,max_lines=2)
    elif kind == 'pretalk':
        labels=['Explain the activity','Confirm agency','Accept variation','Check consent']
        for i,label in enumerate(labels):
            x=48+(i%2)*444; y=150+(i//2)*146
            box(d,(x,y,x+420,y+117),GOLD if i==min(max(step-1,0),3) else EDGE)
            text(d,(x+20,y+20),f'{i+1} · {label}',27,MINT if step>=i else MUTED,True)
            text(d,(x+20,y+65),['Limited demonstration','Stop at any time','Honest feedback is welcome','Yes, no or uncertain'][i],24)
        text(d,(480,453),'Conversation rehearsal · no induction is performed',24,MUTED,anchor='ma')

def diagram(lesson, step):
    info=lesson['steps'][step]
    image=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(image)
    d.rectangle((0,0,W,6),fill=GOLD)
    text(d,(32,22),lesson['title'],36,GOLD,True)
    text(d,(32,77),f"{step+1} / 5 · {info['title']}",26,MUTED)
    scene(d,lesson['kind'],step)
    box(d,(32,488,928,653),GOLD)
    paragraph(d,(54,512),info['caption'],850,31,max_lines=3)
    d.line((32,671,928,671),fill=EDGE,width=2)
    text(d,(32,684),'Original coaching visual · conceptual demonstration · silent',23,MUTED)
    return image

def motion(d, kind, step, progress):
    p=max(0,min(1,(progress*SECONDS-3)/3))
    if kind=='observation' and step in (2,3):
        x=178+600*p
        d.ellipse((x-8,350,x+8,366),fill=GOLD)
    elif kind=='forces' and step in (2,4):
        # Twenty fixed example outcomes: twelve target hits and eight misses.
        for i in range(min(20,int(p*20)+1)):
            x=92+i*39
            color=MINT if i%5 in (0,1,2) else RED
            d.ellipse((x-7,363,x+7,377),fill=color)
    elif kind=='drawing':
        paths=[[(100,423),(421,423)],[(147,234),(377,234)],[(122,234),(262,135),(402,234)],[(236,302),(236,380),(288,380),(288,302)],[(147,234),(147,380),(377,380),(377,234)]]
        path=paths[step]; segment=min(len(path)-2,int(p*(len(path)-1)))
        t=min(1,p*(len(path)-1)-segment)
        x=path[segment][0]+(path[segment+1][0]-path[segment][0])*t
        y=path[segment][1]+(path[segment+1][1]-path[segment][1])*t
        d.ellipse((x-8,y-8,x+8,y+8),fill=MINT)
    elif kind=='prediction' and step in (2,3):
        y=345-35*p
        d.ellipse((472,y-8,488,y+8),fill=GOLD)
    elif kind=='book':
        d.ellipse((717-5*p,248-5*p,777+5*p,329+5*p),outline=MINT,width=3)
    elif kind=='effect':
        x=180+600*p
        d.ellipse((x-8,292,x+8,308),fill=MINT)
    elif kind=='attention':
        destination=[(205,320),(765,180),(740,338)][0 if step<2 else 1 if step==2 else 2]
        for start in [(190,204),(765,204)]:
            x=start[0]+(destination[0]-start[0])*p; y=start[1]+(destination[1]-start[1])*p
            d.ellipse((x-7,y-7,x+7,y+7),fill=MINT)
    elif kind=='symbols' and step==2:
        d.rectangle((55,318,908,389),fill=BG)
        destinations=[0,2,1,4,3]
        for symbol_id in range(5):
            destination=destinations.index(symbol_id)
            x=116+181*(symbol_id+(destination-symbol_id)*p)
            y=354+(math.sin(p*math.pi)*28*(1 if symbol_id%2 else -1) if destination!=symbol_id else 0)
            symbol(d,symbol_id,x,y,28)
    elif kind=='hypnosis-model':
        radius=24+int(p*8)
        d.ellipse((124-radius,178-radius,124+radius,178+radius),outline=GOLD,width=2)
    elif kind=='pretalk':
        active=min(max(step-1,0),3); x=48+(active%2)*444; y=150+(active//2)*146
        d.line((x+18,y+107,x+18+int(384*p),y+107),fill=MINT,width=4)

def registry():
    lines=['// Generated by scripts/build-expanded-media.py; keep static requires for Metro.', 'export const expandedAssets: Record<string, { frames: number[]; video: number }> = {']
    for lesson in DEFINITIONS:
        slug=lesson['slug']
        frames=', '.join(f"require('../../assets/lesson-media/{slug}-{i+1}.png')" for i in range(5))
        lines.append(f"  '{slug}': {{ frames: [{frames}], video: require('../../assets/lesson-media/{slug}.mp4') }},")
    lines.append('};\n')
    (ROOT/'src/visuals/expandedAssets.ts').write_text('\n'.join(lines),encoding='utf-8')

def encode(lesson, frames, ffmpeg):
    slug=lesson['slug']
    command=[ffmpeg,'-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/f'{slug}.mp4')]
    process=subprocess.Popen(command,stdin=subprocess.PIPE)
    try:
        for step,frame in enumerate(frames):
            for tick in range(FPS*SECONDS):
                image=frame.copy(); d=ImageDraw.Draw(image)
                progress=tick/(FPS*SECONDS-1)
                motion(d,lesson['kind'],step,progress)
                d.rounded_rectangle((32,660,32+int(896*progress),666),radius=3,fill=MINT)
                process.stdin.write(image.tobytes())
        process.stdin.close()
        if process.wait()!=0: raise RuntimeError(f'FFmpeg failed for {slug}')
    except BaseException:
        process.kill(); process.wait(); raise

def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--skip-video',action='store_true'); parser.add_argument('--preview',type=Path)
    args=parser.parse_args(); OUT.mkdir(parents=True,exist_ok=True)
    ffmpeg=shutil.which('ffmpeg')
    if not args.skip_video and not ffmpeg: raise RuntimeError('FFmpeg/libx264 is required for MP4 generation.')
    preview=[]
    for lesson in DEFINITIONS:
        frames=[diagram(lesson,i) for i in range(5)]
        for i,frame in enumerate(frames): frame.save(OUT/f"{lesson['slug']}-{i+1}.png",optimize=True)
        if not args.skip_video: encode(lesson,frames,ffmpeg)
        preview.append(frames[2]); print(f"Generated {lesson['slug']}",flush=True)
    registry()
    if args.preview:
        sheet=Image.new('RGB',(960,1800),BG)
        for i,frame in enumerate(preview): sheet.paste(frame.resize((480,360)),((i%2)*480,(i//2)*360))
        args.preview.parent.mkdir(parents=True,exist_ok=True); sheet.save(args.preview)

if __name__=='__main__': main()
