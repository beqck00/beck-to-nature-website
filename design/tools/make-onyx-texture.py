# Polished honey onyx, second approach: many fine laminae following one flowing field, translucent blur, fracture veins.
import numpy as np, sys
from PIL import Image, ImageFilter, ImageDraw
seed = int(sys.argv[1]) if len(sys.argv) > 1 else 7
out = sys.argv[2] if len(sys.argv) > 2 else 'onyx.png'
W, H = 2000, 1500
def vnoise(cx, cy, s):
    r = np.random.default_rng(s).random((cy + 3, cx + 3)).astype(np.float32)
    im = Image.fromarray(r, mode='F').resize((W + 2 * (W // cx), H + 2 * (H // cy)), Image.BICUBIC)
    return np.asarray(im)[H // cy:H // cy + H, W // cx:W // cx + W]
def fbm(cx, cy, s, octaves=4, gain=.5):
    tot = np.zeros((H, W), np.float32); amp = 1; norm = 0
    for o in range(octaves):
        tot += amp * vnoise(cx * 2 ** o, cy * 2 ** o, s + 101 * o); norm += amp; amp *= gain
    return tot / norm
Y, X = np.mgrid[0:H, 0:W].astype(np.float32); X /= W; Y /= H
rng = np.random.default_rng(seed)
# one flowing field: layers run roughly across, folded gently, with a slow swell
fold = fbm(2, 2, seed + 1, 2) - .5
swell = fbm(5, 3, seed + 2, 3) - .5
trem = fbm(26, 20, seed + 3, 3) - .5
ang = rng.uniform(-.35, .35)
field = Y * np.cos(ang) + X * np.sin(ang) + .85 * fold + .16 * swell + .012 * trem
field = (field - field.min()) / (field.max() - field.min())
def lamina(n, s, rough):
    """n layers across the field, each with its own tone; neighbours blend softly or cut sharply."""
    r = np.random.default_rng(s)
    w = r.gamma(2.0, 1.0, n); edges = np.concatenate([[0], np.cumsum(w)]); edges /= edges[-1]
    tone = np.clip(.5 + np.cumsum(r.normal(0, rough, n + 1)), 0, 1)
    tone = .55 * tone + .45 * r.random(n + 1)
    idx = np.clip(np.searchsorted(edges, field, side='right') - 1, 0, n - 1)
    frac = (field - edges[idx]) / (edges[idx + 1] - edges[idx])
    sharp = r.uniform(1.0, 5.0, n)[idx]
    k = np.clip(.5 + (frac - .5) * sharp, 0, 1); k = k * k * (3 - 2 * k)
    return tone[idx] * (1 - k) + tone[idx + 1] * k
broad = lamina(7, seed + 10, .22)
mid = lamina(26, seed + 11, .25)
fine = lamina(90, seed + 12, .3)
hair = lamina(300, seed + 13, .3)
dens = np.clip((fbm(3, 3, seed + 14, 2) - .35) * 2.2, 0, 1)            # where the fine layering is strong
v = .46 * broad + .27 * mid + (.17 * fine + .10 * hair) * (.35 + .65 * dens) + (.27 * .5) * (1 - (.35 + .65 * dens)) * 1.0
# thin dark iron seams and milky calcite layers that follow the bedding
r = np.random.default_rng(seed + 15)
for pos, wdt, amt in zip(r.random(9), r.uniform(.0012, .004, 9), r.uniform(-.5, -.25, 9)):
    v += amt * np.exp(-((field - pos) / wdt) ** 2)
for pos, wdt, amt in zip(r.random(7), r.uniform(.002, .007, 7), r.uniform(.2, .4, 7)):
    v += amt * np.exp(-((field - pos) / wdt) ** 2)
# cloudy translucent zones lift and flatten the tone; deeper zones go richer
cloud = np.clip((fbm(3, 2, seed + 20, 4) - .46) * 3.0, 0, 1)
v = v * (1 - .45 * cloud) + (.68 + .1 * cloud) * .45 * cloud
v += .10 * (fbm(7, 5, seed + 21, 4) - .5)                                 # mottling
v = np.clip((v - .12) / .76, 0, 1)
stops = np.array([0, .14, .32, .5, .68, .84, 1.0])
cols = np.array([[74, 44, 20], [134, 88, 42], [184, 134, 70], [214, 172, 104], [232, 204, 150], [243, 226, 188], [250, 240, 214]], np.float32)
rgb = np.stack([np.interp(v, stops, cols[:, c]) for c in range(3)], -1)
hue = fbm(4, 3, seed + 30, 3) - .5
rgb[..., 0] += 9 * hue; rgb[..., 1] += 2 * hue; rgb[..., 2] -= 16 * hue
img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))
# translucency: light scatters inside the stone, so soften part of the detail
soft = img.filter(ImageFilter.GaussianBlur(7)); img = Image.blend(img, soft, .38)
# fractures: a few long, nearly straight cracks that cut across the layers, healed with pale calcite or stained dark
def crack(draw, r, col, width):
    x, y = r.uniform(0, W), r.uniform(-.1 * H, .4 * H); a = r.uniform(.9, 2.2)
    pts = [(x, y)]
    for _ in range(int(r.uniform(18, 46))):
        a += r.normal(0, .16); step = r.uniform(26, 70)
        x += np.cos(a) * step; y += np.sin(a) * step; pts.append((x, y))
        if r.random() < .12:                                               # a short branch
            bx, by, ba = x, y, a + r.choice([-1, 1]) * r.uniform(.5, .9); bp = [(bx, by)]
            for _ in range(int(r.uniform(3, 9))):
                ba += r.normal(0, .2); bx += np.cos(ba) * 30; by += np.sin(ba) * 30; bp.append((bx, by))
            draw.line(bp, fill=col, width=max(1, width - 1), joint='curve')
    draw.line(pts, fill=col, width=width, joint='curve')
r = np.random.default_rng(seed + 40)
pale = Image.new('L', (W, H), 0); d = ImageDraw.Draw(pale)
for _ in range(4): crack(d, r, 255, int(r.choice([2, 3, 4])))
dark = Image.new('L', (W, H), 0); d = ImageDraw.Draw(dark)
for _ in range(3): crack(d, r, 255, int(r.choice([1, 2])))
a = np.asarray(img).astype(np.float32)
pm = np.asarray(pale.filter(ImageFilter.GaussianBlur(1.4))).astype(np.float32) / 255
ph = np.asarray(pale.filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255
dm = np.asarray(dark.filter(ImageFilter.GaussianBlur(1.1))).astype(np.float32) / 255
breakup = np.clip((fbm(8, 6, seed + 41, 3) - .3) * 2.4, 0, 1)             # cracks fade in and out
a = a * (1 - (.62 * pm * breakup)[..., None]) + np.array([252, 245, 226], np.float32) * (.62 * pm * breakup)[..., None]
a += (28 * ph * breakup)[..., None]
a = a * (1 - (.55 * dm * breakup)[..., None]) + np.array([66, 38, 18], np.float32) * (.55 * dm * breakup)[..., None]
# crystal grain and a soft polish falloff
gr = np.random.default_rng(seed + 50)
g1 = gr.normal(0, 1, (H, W)).astype(np.float32)
g2 = np.asarray(Image.fromarray(gr.normal(0, 1, (H // 4, W // 4)).astype(np.float32), mode='F').resize((W, H), Image.BICUBIC))
a += (g1 * 1.3 + g2 * 2.4)[..., None]
a *= (1.04 - .09 * ((X - .3) ** 2 + (Y - .25) ** 2) ** .5)[..., None]
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).resize((1600, 1200), Image.LANCZOS).save(out)
print('saved', out)
