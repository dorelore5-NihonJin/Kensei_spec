import os
import urllib.request
from PIL import Image

# Map of game filenames to high-resolution official Steam / IGDB keyart URLs
GAME_ART_MAP = {
    "cs2.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/730/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg"
    ],
    "valorant.jpg": [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
        "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg"
    ],
    "cyberpunk.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg"
    ],
    "witcher3.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/292030/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg"
    ],
    "gtav.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/271590/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg"
    ],
    "alanwake2.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/108710/header.jpg",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"
    ],
    "gtavi.jpg": [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80"
    ],
    "wukong.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/2358720/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/2358720/header.jpg"
    ],
    "dota2.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/570/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg"
    ],
    "apex.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1172470/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg"
    ],
    "eldenring.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg"
    ],
    "forza5.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1551360/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg"
    ],
    "fortnite.jpg": [
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80"
    ],
    "minecraft.jpg": [
        "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&q=80"
    ],
    "rdr2.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg"
    ],
    "codwarzone.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1962663/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1962663/header.jpg"
    ],
    "hogwarts.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/990080/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg"
    ],
    "spider2.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1817070/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg"
    ],
    "helldivers2.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/553850/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg"
    ],
    "starfield.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1716750/header.jpg",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
    ],
    "sims4.jpg": [
        "https://cdn.akamai.steamstatic.com/steam/apps/1222670/library_600x900_2x.jpg",
        "https://cdn.akamai.steamstatic.com/steam/apps/1222670/header.jpg"
    ]
}

req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for filename, urls in GAME_ART_MAP.items():
    success = False
    for url in urls:
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
                
                tmp_file = "temp_art.jpg"
                with open(tmp_file, "wb") as f:
                    f.write(data)
                
                img = Image.open(tmp_file).convert("RGB")
                
                for folder in ["public/games", "dist/games"]:
                    os.makedirs(folder, exist_ok=True)
                    out_path = os.path.join(folder, filename)
                    img.save(out_path, quality=95)
                
                print(f"SUCCESS: Fetched official HD art for {filename}")
                success = True
                break
        except Exception as e:
            print(f"Failed {filename} via {url}: {e}")

print("Official game key-art processing complete!")
