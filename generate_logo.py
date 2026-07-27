import os
from PIL import Image, ImageDraw, ImageFont

def create_kensei_logo():
    size = (1024, 1024)
    # Dark obsidian background (#1E2022)
    img = Image.new("RGBA", size, (30, 32, 34, 255))
    draw = ImageDraw.Draw(img)

    # 1. Outer subtle border pill
    border_margin = 40
    corner_radius = 240
    rect_box = [border_margin, border_margin, size[0] - border_margin, size[1] - border_margin]
    
    # Draw dark charcoal rounded rectangle container
    draw.rounded_rectangle(rect_box, radius=corner_radius, fill=(26, 28, 30, 255), outline=(232, 141, 159, 100), width=6)

    # 2. Main Geometric "K" Icon
    # Rose Gold (#E88D9F) -> RGB (232, 141, 159)
    # Sage Green (#8A9A86) -> RGB (138, 154, 134)
    rose_color = (232, 141, 159, 255)
    sage_color = (138, 154, 134, 255)

    # Vertical Spine Line (Left bar of K)
    spine_x1, spine_y1 = 340, 240
    spine_x2, spine_y2 = 340, 780
    draw.line([spine_x1, spine_y1, spine_x2, spine_y2], fill=rose_color, width=90)
    # Rounded line caps
    draw.ellipse([spine_x1 - 45, spine_y1 - 45, spine_x1 + 45, spine_y1 + 45], fill=rose_color)
    draw.ellipse([spine_x2 - 45, spine_y2 - 45, spine_x2 + 45, spine_y2 + 45], fill=rose_color)

    # Top Blade Slash (Upper arm of K)
    top_x1, top_y1 = 340, 510
    top_x2, top_y2 = 700, 240
    draw.line([top_x1, top_y1, top_x2, top_y2], fill=rose_color, width=90)
    draw.ellipse([top_x2 - 45, top_y2 - 45, top_x2 + 45, top_y2 + 45], fill=rose_color)

    # Bottom Hardware Slash (Lower arm of K)
    bot_x1, bot_y1 = 340, 510
    bot_x2, bot_y2 = 700, 780
    draw.line([bot_x1, bot_y1, bot_x2, bot_y2], fill=sage_color, width=90)
    draw.ellipse([bot_x2 - 45, bot_y2 - 45, bot_x2 + 45, bot_y2 + 45], fill=sage_color)

    # Ensure output directories exist
    os.makedirs("public", exist_ok=True)
    os.makedirs("dist", exist_ok=True)

    # Save clean PNG and JPG files in root, public, and dist folders
    img_rgb = img.convert("RGB")
    
    img.save("kensei_logo.png", "PNG")
    img_rgb.save("kensei_logo.jpg", "JPEG", quality=95)

    img.save("public/kensei_logo.png", "PNG")
    img_rgb.save("public/kensei_logo.jpg", "JPEG", quality=95)

    img.save("dist/kensei_logo.png", "PNG")
    img_rgb.save("dist/kensei_logo.jpg", "JPEG", quality=95)

    print("Successfully generated clean corporate logo PNG/JPG files!")

if __name__ == "__main__":
    create_kensei_logo()
