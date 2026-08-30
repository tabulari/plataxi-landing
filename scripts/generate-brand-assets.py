#!/usr/bin/env python3
"""
Plataxi Brand Asset Generator
Generates full SVG and transparent PNG assets for all branding scenarios:
- Dark (#151515) on transparent
- White (#FFFFFF) on transparent
- Brand Yellow (#FFDD00) accent
- Lockup with tagline ("LIQUIDEZ PARA TU DÍA A DÍA")
- Horizontal lockup (Navbar)
- Isotype only (Favicon, app icon)
- Solid background avatars (1:1 square for social media)
"""

import os
from PIL import Image, ImageDraw, ImageFont

BRAND_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "brand")
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(BRAND_DIR, exist_ok=True)

# Brand Color Constants
COLOR_DARK = "#151515"
COLOR_WHITE = "#FFFFFF"
COLOR_YELLOW = "#FFDD00"
COLOR_YELLOW_BRIGHT = "#FFE600"

# Best available bold sans font
FONT_PATH = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
if not os.path.exists(FONT_PATH):
    FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

# Normalized Isotype Path Definition (ViewBox 370 x 200)
ISOTYPE_PATHS = """
  <!-- Top Roof / Hood Trapezoid -->
  <polygon points="97,0 273,0 317,77 53,77" fill="{fill_isotype}" />
  <!-- Left Wing -->
  <polygon points="0,98 62,98 95,148 28,148" fill="{fill_isotype}" />
  <!-- Right Wing -->
  <polygon points="308,98 370,98 342,148 275,148" fill="{fill_isotype}" />
  <!-- Bottom Center Trapezoid -->
  <polygon points="95,148 275,148 242,198 128,198" fill="{fill_isotype}" />
"""

def generate_svg_isotype(filename, fill_color):
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 200" width="370" height="200" fill="none">
{ISOTYPE_PATHS.format(fill_isotype=fill_color)}
</svg>"""
    with open(os.path.join(BRAND_DIR, filename), "w") as f:
        f.write(svg_content.strip())
    print(f"Generated: {filename}")

def generate_svg_horizontal(filename, fill_isotype, fill_text):
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 200" width="1050" height="200" fill="none">
  <!-- Isotype (x: 0..370, y: 0..200) -->
  <g transform="translate(0, 0)">
{ISOTYPE_PATHS.format(fill_isotype=fill_isotype)}
  </g>
  <!-- Wordmark PLATAXI -->
  <text x="420" y="148" font-family="'Montserrat', 'Roboto', 'Arial Black', sans-serif" font-weight="900" font-size="150" letter-spacing="4" fill="{fill_text}">PLATAXI</text>
</svg>"""
    with open(os.path.join(BRAND_DIR, filename), "w") as f:
        f.write(svg_content.strip())
    print(f"Generated: {filename}")

def generate_svg_with_tagline(filename, fill_isotype, fill_text, fill_tagline=None):
    if fill_tagline is None:
        fill_tagline = fill_text
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 230" width="1280" height="230" fill="none">
  <!-- Isotype (x: 0..370, y: 15..215) -->
  <g transform="translate(0, 15)">
{ISOTYPE_PATHS.format(fill_isotype=fill_isotype)}
  </g>
  <!-- Wordmark PLATAXI -->
  <text x="420" y="132" font-family="'Montserrat', 'Roboto', 'Arial Black', sans-serif" font-weight="900" font-size="138" letter-spacing="3" fill="{fill_text}">PLATAXI</text>
  <!-- Tagline LIQUIDEZ PARA TU DÍA A DÍA -->
  <text x="422" y="196" font-family="'Montserrat', 'Roboto', 'Arial Black', sans-serif" font-weight="800" font-size="44" letter-spacing="5.5" fill="{fill_tagline}">LIQUIDEZ PARA TU DÍA A DÍA</text>
</svg>"""
    with open(os.path.join(BRAND_DIR, filename), "w") as f:
        f.write(svg_content.strip())
    print(f"Generated: {filename}")

def generate_svg_vertical(filename, fill_isotype, fill_text, fill_tagline=None):
    if fill_tagline is None:
        fill_tagline = fill_text
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" fill="none">
  <!-- Centered Isotype (x: 215..585, y: 60..260) -->
  <g transform="translate(215, 60)">
{ISOTYPE_PATHS.format(fill_isotype=fill_isotype)}
  </g>
  <!-- Wordmark PLATAXI -->
  <text x="400" y="390" text-anchor="middle" font-family="'Montserrat', 'Roboto', 'Arial Black', sans-serif" font-weight="900" font-size="120" letter-spacing="4" fill="{fill_text}">PLATAXI</text>
  <!-- Tagline LIQUIDEZ PARA TU DÍA A DÍA -->
  <text x="400" y="450" text-anchor="middle" font-family="'Montserrat', 'Roboto', 'Arial Black', sans-serif" font-weight="800" font-size="36" letter-spacing="4.5" fill="{fill_tagline}">LIQUIDEZ PARA TU DÍA A DÍA</text>
</svg>"""
    with open(os.path.join(BRAND_DIR, filename), "w") as f:
        f.write(svg_content.strip())
    print(f"Generated: {filename}")


# Raster PNG Helpers
def draw_isotype(draw, offset_x, offset_y, scale, color):
    p_top = [(offset_x + x * scale, offset_y + y * scale) for x, y in [(97, 0), (273, 0), (317, 77), (53, 77)]]
    p_lw = [(offset_x + x * scale, offset_y + y * scale) for x, y in [(0, 98), (62, 98), (95, 148), (28, 148)]]
    p_rw = [(offset_x + x * scale, offset_y + y * scale) for x, y in [(308, 98), (370, 98), (342, 148), (275, 148)]]
    p_ctr = [(offset_x + x * scale, offset_y + y * scale) for x, y in [(95, 148), (275, 148), (242, 198), (128, 198)]]
    
    draw.polygon(p_top, fill=color)
    draw.polygon(p_lw, fill=color)
    draw.polygon(p_rw, fill=color)
    draw.polygon(p_ctr, fill=color)

def generate_png_isotype(filename, color, width=1024, height=550):
    scale = (width * 0.85) / 370.0
    scaled_h = 200 * scale
    im = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    
    offset_x = (width - 370 * scale) / 2
    offset_y = (height - scaled_h) / 2
    draw_isotype(draw, offset_x, offset_y, scale, color)
    
    im.save(os.path.join(BRAND_DIR, filename), "PNG")
    print(f"Generated PNG: {filename}")

def generate_png_horizontal(filename, isotype_color, text_color, width=1600, height=350):
    im = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    
    scale = (height * 0.72) / 200.0
    offset_x = 40
    offset_y = (height - 200 * scale) / 2
    draw_isotype(draw, offset_x, offset_y, scale, isotype_color)
    
    # Text
    font_size = int(145 * scale)
    font = ImageFont.truetype(FONT_PATH, font_size)
    text_x = offset_x + 370 * scale + (50 * scale)
    text_y = offset_y + (10 * scale)
    draw.text((text_x, text_y), "PLATAXI", fill=text_color, font=font)
    
    im.save(os.path.join(BRAND_DIR, filename), "PNG")
    print(f"Generated PNG: {filename}")

def generate_png_with_tagline(filename, isotype_color, text_color, tagline_color=None, width=1800, height=400):
    if tagline_color is None:
        tagline_color = text_color
    im = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(im)
    
    scale = (height * 0.68) / 200.0
    offset_x = 40
    offset_y = 35
    draw_isotype(draw, offset_x, offset_y, scale, isotype_color)
    
    # Text
    font_size = int(135 * scale)
    font = ImageFont.truetype(FONT_PATH, font_size)
    text_x = offset_x + 370 * scale + (45 * scale)
    text_y = offset_y - (5 * scale)
    draw.text((text_x, text_y), "PLATAXI", fill=text_color, font=font)
    
    # Tagline
    tagline_font_size = int(42 * scale)
    tagline_font = ImageFont.truetype(FONT_PATH, tagline_font_size)
    tagline_y = text_y + int(140 * scale)
    draw.text((text_x, tagline_y), "LIQUIDEZ PARA TU DÍA A DÍA", fill=tagline_color, font=tagline_font)
    
    im.save(os.path.join(BRAND_DIR, filename), "PNG")
    print(f"Generated PNG: {filename}")

def generate_avatar_png(filename, bg_color, isotype_color, size=1024):
    im = Image.new("RGBA", (size, size), bg_color)
    draw = ImageDraw.Draw(im)
    
    target_w = size * 0.58
    scale = target_w / 370.0
    scaled_h = 200 * scale
    
    offset_x = (size - 370 * scale) / 2
    offset_y = (size - scaled_h) / 2
    draw_isotype(draw, offset_x, offset_y, scale, isotype_color)
    
    im.save(os.path.join(BRAND_DIR, filename), "PNG")
    if "yellow" in filename:
        im.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG")
        im.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(PUBLIC_DIR, "favicon-32.png"), "PNG")
        im.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(PUBLIC_DIR, "favicon.ico"), "ICO")
    print(f"Generated Avatar PNG: {filename}")

if __name__ == "__main__":
    print("Generating Plataxi brand assets...")
    
    # 1. SVGs
    generate_svg_isotype("plataxi-isotype-dark.svg", COLOR_DARK)
    generate_svg_isotype("plataxi-isotype-white.svg", COLOR_WHITE)
    generate_svg_isotype("plataxi-isotype-yellow.svg", COLOR_YELLOW)
    
    generate_svg_horizontal("plataxi-logo-horizontal-dark.svg", COLOR_DARK, COLOR_DARK)
    generate_svg_horizontal("plataxi-logo-horizontal-white.svg", COLOR_WHITE, COLOR_WHITE)
    generate_svg_horizontal("plataxi-logo-horizontal-color.svg", COLOR_YELLOW, COLOR_DARK)
    generate_svg_horizontal("plataxi-logo-horizontal-yellow-white.svg", COLOR_YELLOW, COLOR_WHITE)
    
    generate_svg_with_tagline("plataxi-logo-dark.svg", COLOR_DARK, COLOR_DARK)
    generate_svg_with_tagline("plataxi-logo-white.svg", COLOR_WHITE, COLOR_WHITE)
    generate_svg_with_tagline("plataxi-logo-color.svg", COLOR_YELLOW, COLOR_DARK)
    generate_svg_with_tagline("plataxi-logo-yellow-white.svg", COLOR_YELLOW, COLOR_WHITE)
    
    generate_svg_vertical("plataxi-logo-vertical-dark.svg", COLOR_DARK, COLOR_DARK)
    generate_svg_vertical("plataxi-logo-vertical-white.svg", COLOR_WHITE, COLOR_WHITE)
    generate_svg_vertical("plataxi-logo-vertical-color.svg", COLOR_YELLOW, COLOR_DARK)

    # 2. Transparent High-Res PNGs
    generate_png_isotype("plataxi-isotype-dark.png", COLOR_DARK)
    generate_png_isotype("plataxi-isotype-white.png", COLOR_WHITE)
    generate_png_isotype("plataxi-isotype-yellow.png", COLOR_YELLOW)
    
    generate_png_horizontal("plataxi-logo-horizontal-dark.png", COLOR_DARK, COLOR_DARK)
    generate_png_horizontal("plataxi-logo-horizontal-white.png", COLOR_WHITE, COLOR_WHITE)
    generate_png_horizontal("plataxi-logo-horizontal-color.png", COLOR_YELLOW, COLOR_DARK)
    
    generate_png_with_tagline("plataxi-logo-dark.png", COLOR_DARK, COLOR_DARK)
    generate_png_with_tagline("plataxi-logo-white.png", COLOR_WHITE, COLOR_WHITE)
    generate_png_with_tagline("plataxi-logo-color.png", COLOR_YELLOW, COLOR_DARK)
    
    # 3. Social Avatars (1:1 Solid Backgrounds)
    generate_avatar_png("plataxi-avatar-yellow.png", COLOR_YELLOW, COLOR_DARK, 1024)
    generate_avatar_png("plataxi-avatar-dark.png", COLOR_DARK, COLOR_YELLOW, 1024)
    generate_avatar_png("plataxi-avatar-white.png", COLOR_WHITE, COLOR_DARK, 1024)
    
    print("\nAll brand assets generated successfully in public/brand/!")
