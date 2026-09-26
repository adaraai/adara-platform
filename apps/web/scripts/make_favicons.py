"""Crop Adara mark from logo and write favicon set + title-case light logo."""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
CAPITAL = Path(
    r"C:\Users\njoya\.cursor\projects\c-Users-njoya-Desktop-adara-org\assets\adara-logo-adara-capital.png"
)


def content_mask(arr: np.ndarray) -> np.ndarray:
    rgb = arr[:, :, :3]
    if arr.shape[2] == 4:
        alpha = arr[:, :, 3]
        opaque = alpha > 20
    else:
        opaque = np.ones(rgb.shape[:2], dtype=bool)
    near_white = (rgb[:, :, 0] > 245) & (rgb[:, :, 1] > 245) & (rgb[:, :, 2] > 245)
    near_black = (rgb[:, :, 0] < 12) & (rgb[:, :, 1] < 12) & (rgb[:, :, 2] < 12)
    return opaque & ~near_white & ~near_black


def orange_mask(arr: np.ndarray, mask: np.ndarray) -> np.ndarray:
    rgb = arr[:, :, :3]
    return mask & (rgb[:, :, 0] > 180) & (rgb[:, :, 1] < 150) & (rgb[:, :, 2] < 120)


def crop_mark(img: Image.Image, pad: int = 8) -> Image.Image:
    arr = np.array(img.convert("RGBA"))
    mask = content_mask(arr)
    omask = orange_mask(arr, mask)
    ys, xs = np.where(omask if omask.any() else mask)
    x0, x1 = int(xs.min()), int(xs.max())
    y0, y1 = int(ys.min()), int(ys.max())
    # Mark is the left icon — clip to roughly square from left content
    side = max(x1 - x0, y1 - y0)
    x1 = min(arr.shape[1] - 1, x0 + side)
    y1 = min(arr.shape[0] - 1, y0 + side)
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(arr.shape[1], x1 + pad)
    y1 = min(arr.shape[0], y1 + pad)
    cropped = img.convert("RGBA").crop((x0, y0, x1, y1))
    # Make near-white / near-black backgrounds transparent so mark sits clean
    a = np.array(cropped)
    rgb = a[:, :, :3]
    near_white = (rgb[:, :, 0] > 245) & (rgb[:, :, 1] > 245) & (rgb[:, :, 2] > 245)
    a[near_white, 3] = 0
    return Image.fromarray(a)


def fit_square(mark: Image.Image, size: int, bg=(0, 0, 0, 0)) -> Image.Image:
    mark = mark.convert("RGBA")
    # Trim transparent edges
    bbox = mark.getbbox()
    if bbox:
        mark = mark.crop(bbox)
    canvas = Image.new("RGBA", (size, size), bg)
    # Leave ~12% padding
    target = int(size * 0.78)
    ratio = min(target / mark.width, target / mark.height)
    nw, nh = max(1, int(mark.width * ratio)), max(1, int(mark.height * ratio))
    resized = mark.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    # Prefer official title-case asset for header light logo
    if CAPITAL.exists():
        capital = Image.open(CAPITAL).convert("RGBA")
        capital.save(ASSETS / "adara-logo-light.png", optimize=True)
        print("updated adara-logo-light.png from capital asset")
        source = capital
    else:
        source = Image.open(ASSETS / "adara-logo-light.png").convert("RGBA")

    mark = crop_mark(source)
    mark.save(ASSETS / "adara-mark.png", optimize=True)
    print("wrote adara-mark.png", mark.size)

    # Transparent SVG-friendly PNGs for browser tabs
    for size, name in [(32, "favicon-32.png"), (192, "favicon-192.png"), (180, "apple-touch-icon.png")]:
        out = fit_square(mark, size)
        out.save(PUBLIC / name, optimize=True)
        print("wrote", name)

    # favicon.ico multi-size
    ico_sizes = [16, 32, 48]
    ico_imgs = [fit_square(mark, s).convert("RGBA") for s in ico_sizes]
    ico_imgs[0].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=ico_imgs[1:],
    )
    print("wrote favicon.ico")

    # Simple SVG referencing the brand color + inline path approximation via PNG data URL is heavy;
    # write a solid SVG of the orange A silhouette using the cropped PNG as embedded? Prefer path SVG.
    # For browsers that prefer SVG, point to a clean orange mark on transparent:
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <image href="/assets/adara-mark.png" width="32" height="32" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    # Better: embed mark as data-free by writing a raster-free SVG isn't accurate for Africa cutout.
    # Use PNG-backed approach: many browsers fall back to favicon-32. Still update SVG to orange A block
    # that won't mismatch as badly — actually write SVG that uses the generated 32 as external is fragile.
    # Skip complex SVG; write orange rounded square is wrong. Copy mark into inline via base64.
    import base64
    buf = fit_square(mark, 64)
    from io import BytesIO

    bio = BytesIO()
    buf.save(bio, format="PNG")
    b64 = base64.b64encode(bio.getvalue()).decode("ascii")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <image href="data:image/png;base64,{b64}" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    (PUBLIC / "favicon.svg").write_text(svg, encoding="utf-8")
    print("wrote favicon.svg")


if __name__ == "__main__":
    main()
