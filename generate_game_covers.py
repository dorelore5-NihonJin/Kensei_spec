import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_game_cover(filename, title, subtitle, bg_color1, bg_color2, accent_color, badge_text="100% VERIFIED SPEC"):
    width, height = 800, 800
    img = Image.new("RGB", (width, height), bg_color1)
    draw = ImageDraw.Draw(img)

    # Gradient background
    for y in range(height):
        r = int(bg_color1[0] + (bg_color2[0] - bg_color1[0]) * (y / height))
        g = int(bg_color1[1] + (bg_color2[1] - bg_color1[1]) * (y / height))
        b = int(bg_color1[2] + (bg_color2[2] - bg_color1[2]) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Abstract atmospheric geometric art shapes
    draw.ellipse([width//4 - 50, height//4 - 50, width//4 + 350, height//4 + 350], outline=accent_color, width=4)
    draw.polygon([(width - 150, 80), (width - 50, 250), (width - 250, 300)], fill=(accent_color[0], accent_color[1], accent_color[2]))

    # Dark overlay vignette for cinematic depth
    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    v_draw.rectangle([0, height - 320, width, height], fill=(0, 0, 0, 220))
    v_draw.rectangle([0, 0, width, 180], fill=(0, 0, 0, 160))
    img = Image.alpha_composite(img.convert("RGBA"), vignette).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Accent Top Bar
    draw.rectangle([0, 0, width, 16], fill=accent_color)
    draw.rectangle([0, height - 16, width, height], fill=accent_color)

    # Fonts
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 52)
        font_sub = ImageFont.truetype("arialbd.ttf", 26)
        font_badge = ImageFont.truetype("arial.ttf", 20)
    except:
        font_title = font_sub = font_badge = ImageFont.load_default()

    # Top Badge Tag
    draw.rectangle([40, 40, 320, 85], fill=accent_color)
    draw.text((55, 50), badge_text, fill=(255, 255, 255), font=font_badge)

    # Title & Subtitle text rendering
    draw.text((40, height - 180), title.upper(), fill=(255, 255, 255), font=font_title)
    draw.text((42, height - 105), subtitle, fill=(200, 200, 200), font=font_sub)

    # Save outputs to both public/games/ and dist/games/
    for folder in ["public/games", "dist/games"]:
        os.makedirs(folder, exist_ok=True)
        out_path = os.path.join(folder, filename)
        img.save(out_path, quality=95)
        print(f"Generated cover: {out_path}")

games_meta = [
    ("alanwake2.jpg", "ALAN WAKE 2", "SURVIVAL HORROR • RT ULTRA", (20, 5, 10), (80, 10, 20), (232, 141, 159)),
    ("wukong.jpg", "BLACK MYTH WUKONG", "UNREAL ENGINE 5.5 • ACTION RPG", (30, 20, 5), (100, 70, 15), (245, 185, 65)),
    ("dota2.jpg", "DOTA 2", "MOBA • ESPORTS HIGH-FPS", (40, 10, 10), (120, 30, 30), (220, 60, 60)),
    ("apex.jpg", "APEX LEGENDS", "BATTLE ROYALE • 240FPS COMP", (40, 15, 5), (130, 50, 15), (245, 130, 32)),
    ("forza5.jpg", "FORZA HORIZON 5", "RACING SIMULATOR • 4K ULTRA", (5, 30, 40), (15, 90, 110), (45, 210, 190)),
    ("minecraft.jpg", "MINECRAFT SHADERS", "SANDBOX • LUMEN RT SHADERS", (10, 40, 15), (25, 110, 40), (46, 204, 113)),
    ("rdr2.jpg", "RED DEAD REDEMPTION 2", "OPEN WORLD • ULTRA 4K", (45, 20, 10), (140, 50, 15), (230, 110, 40)),
    ("codwarzone.jpg", "COD WARZONE", "TACTICAL FPS • LOW LATENCY", (25, 35, 20), (70, 90, 45), (160, 210, 60)),
    ("hogwarts.jpg", "HOGWARTS LEGACY", "OPEN WORLD RPG • RAY TRACING", (15, 15, 45), (45, 45, 120), (165, 140, 245)),
    ("spider2.jpg", "MARVEL'S SPIDER-MAN 2", "ACTION ADVENTURE • RT REFLECTIONS", (45, 10, 20), (130, 25, 40), (235, 55, 75)),
    ("helldivers2.jpg", "HELLDIVERS 2", "CO-OP SHOOTER • 1440P VERIFIED", (35, 35, 10), (110, 100, 20), (250, 220, 40)),
    ("starfield.jpg", "STARFIELD", "SPACE RPG • 4K ULTRA BENCHMARK", (10, 20, 45), (30, 60, 130), (60, 150, 240)),
    ("sims4.jpg", "THE SIMS 4", "SIMULATION • HIGH FPS VALUE", (10, 40, 30), (20, 120, 90), (50, 225, 140)),
]

for item in games_meta:
    create_game_cover(*item)

print("All missing game covers generated successfully!")
