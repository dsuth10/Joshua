import os
from PIL import Image, ImageDraw, ImageFont

def create_images():
    output_dir = r"c:\Users\dsuth\Documents\Joshua\Homework\Term 3\Week_02\images"
    os.makedirs(output_dir, exist_ok=True)
    
    # Try to load a standard system font, fallback to default
    try:
        font = ImageFont.truetype("arial.ttf", 16)
        font_bold = ImageFont.truetype("arialbd.ttf", 18)
    except IOError:
        font = ImageFont.load_default()
        font_bold = ImageFont.load_default()

    # Draw Helper: Draw dimension lines
    def draw_dim_line(draw, p1, p2, text, offset=(0,0), text_pos="mid"):
        # Draw dimension line
        draw.line([p1, p2], fill="#555555", width=1)
        # Draw ticks at ends
        x1, y1 = p1
        x2, y2 = p2
        tick_size = 5
        if x1 == x2: # Vertical
            draw.line([(x1 - tick_size, y1), (x1 + tick_size, y1)], fill="#555555", width=1)
            draw.line([(x2 - tick_size, y2), (x2 + tick_size, y2)], fill="#555555", width=1)
            # Text position
            tx = x1 + offset[0]
            ty = (y1 + y2) // 2 + offset[1]
        else: # Horizontal
            draw.line([(x1, y1 - tick_size), (x1, y1 + tick_size)], fill="#555555", width=1)
            draw.line([(x2, y2 - tick_size), (x2, y2 + tick_size)], fill="#555555", width=1)
            # Text position
            tx = (x1 + x2) // 2 + offset[0]
            ty = y1 + offset[1]
        
        draw.text((tx, ty), text, fill="black", font=font, anchor="mm")

    # ==========================================
    # 1. q21_l_shape_perimeter.png (Year 5 Q21)
    # Bounding: 10m (left) x 8m (bottom). Cutout: top-right.
    # Left: 10m, Bottom: 8m, Right vertical: 4m, Inner horizontal: 3m, Inner vertical: 6m, Top horizontal: 5m
    # ==========================================
    img = Image.new("RGBA", (400, 300), "white")
    draw = ImageDraw.Draw(img)
    
    # Outer coordinates
    # Left: 80, Right: 280 (width=200, so 8m -> 25px per metre)
    # Bottom: 240, Top: 40 (height=200, so 10m -> 20px per metre)
    p_left_top = (80, 40)
    p_inner_top = (205, 40)  # 5m horizontal
    p_inner_corner = (205, 160)  # 6m vertical down (6 * 20 = 120px down)
    p_inner_right = (280, 160)  # 3m horizontal
    p_bottom_right = (280, 240)  # 4m vertical down
    p_bottom_left = (80, 240)
    
    # Draw L-shape fill and outline
    shape_pts = [p_left_top, p_inner_top, p_inner_corner, p_inner_right, p_bottom_right, p_bottom_left]
    draw.polygon(shape_pts, fill="#E8F0FE", outline="#2A52BE", width=3)
    
    # Dimension labels
    draw_dim_line(draw, (55, 40), (55, 240), "10 m", offset=(-20, 0)) # Left vertical
    draw_dim_line(draw, (80, 265), (280, 265), "8 m", offset=(0, 15)) # Bottom horizontal
    draw_dim_line(draw, (295, 160), (295, 240), "4 m", offset=(20, 0)) # Right vertical
    draw_dim_line(draw, (205, 145), (280, 145), "3 m", offset=(0, -15)) # Inner horizontal
    draw_dim_line(draw, (80, 20), (205, 20), "5 m", offset=(0, -15)) # Top horizontal
    # Inner vertical label (not strictly needed, but let's show all or some)
    # The question is: "What is the perimeter... bounding box is 10m x 8m". The sides are 10, 8, 4, 3, 6, 5. Let's label the 6m too.
    draw_dim_line(draw, (190, 40), (190, 160), "6 m", offset=(-15, 0))
    
    # Title
    draw.text((200, 15), "Question 21: L-Shape Perimeter", fill="#333333", font=font_bold, anchor="ma")
    img.save(os.path.join(output_dir, "q21_l_shape_perimeter.png"))

    # ==========================================
    # 2. q24_t_shape_area.png (Year 5 Q24)
    # Top: 12m wide x 3m tall. Stem: 4m wide x 6m tall.
    # Scale: 1m = 15px
    # ==========================================
    img = Image.new("RGBA", (400, 300), "white")
    draw = ImageDraw.Draw(img)
    
    # Top bar: 12m * 15 = 180px wide. Centered at X=200 -> X from 110 to 290
    # Top bar height: 3m * 15 = 45px. Y from 50 to 95
    # Stem: 4m * 15 = 60px wide. Centered -> X from 170 to 230
    # Stem height: 6m * 15 = 90px. Y from 95 to 185
    
    # Draw T-shape polygon
    t_pts = [
        (110, 50), (290, 50), (290, 95), (230, 95), 
        (230, 185), (170, 185), (170, 95), (110, 95)
    ]
    draw.polygon(t_pts, fill="#E8F0FE", outline="#2A52BE", width=3)
    
    # Dimension labels
    draw_dim_line(draw, (110, 30), (290, 30), "12 m", offset=(0, -15)) # Top horizontal
    draw_dim_line(draw, (305, 50), (305, 95), "3 m", offset=(20, 0)) # Top bar vertical
    draw_dim_line(draw, (170, 200), (230, 200), "4 m", offset=(0, 15)) # Stem horizontal width
    draw_dim_line(draw, (245, 95), (245, 185), "6 m", offset=(20, 0)) # Stem vertical height
    
    draw.text((200, 15), "Question 24: T-Shape Area", fill="#333333", font=font_bold, anchor="ma")
    img.save(os.path.join(output_dir, "q24_t_shape_area.png"))

    # ==========================================
    # 3. q27_cutout_area.png (Year 5 Q27)
    # Bounding: 10m (horizontal) x 8m (vertical).
    # Cutout: 3m x 2m at top right.
    # Scale: 1m = 20px
    # ==========================================
    img = Image.new("RGBA", (400, 300), "white")
    draw = ImageDraw.Draw(img)
    
    # Box: 10m * 20 = 200px wide. Left=100, Right=300
    # Height: 8m * 20 = 160px high. Bottom=220, Top=60
    # Cutout: 3m * 20 = 60px wide from top-right. X from 240 to 300.
    # Cutout height: 2m * 20 = 40px deep. Y from 60 to 100.
    
    pts = [
        (100, 60), (240, 60), (240, 100), (300, 100),
        (300, 220), (100, 220)
    ]
    draw.polygon(pts, fill="#E8F0FE", outline="#2A52BE", width=3)
    
    # Label outer dimensions
    draw_dim_line(draw, (100, 240), (300, 240), "10 m", offset=(0, 15)) # Bottom
    draw_dim_line(draw, (75, 60), (75, 220), "8 m", offset=(-20, 0)) # Left
    draw_dim_line(draw, (100, 40), (240, 40), "7 m", offset=(0, -15)) # Top left
    draw_dim_line(draw, (240, 40), (300, 40), "3 m", offset=(0, -15)) # Top cutout width
    draw_dim_line(draw, (315, 100), (315, 220), "6 m", offset=(20, 0)) # Right vertical
    draw_dim_line(draw, (315, 60), (315, 100), "2 m", offset=(20, 0)) # Cutout height
    
    draw.text((200, 15), "Question 27: Remaining Area", fill="#333333", font=font_bold, anchor="ma")
    img.save(os.path.join(output_dir, "q27_cutout_area.png"))

    # ==========================================
    # 4. q21_green_l_shape_area.png (Year 3/4 Q21)
    # L-shape: Plot 1 is 5m x 4m rectangle, Plot 2 is 3m x 2m.
    # Scale: 1m = 25px
    # Bottom horizontal: 8m. Left vertical: 4m.
    # ==========================================
    img = Image.new("RGBA", (400, 300), "white")
    draw = ImageDraw.Draw(img)
    
    # Left: 100, Bottom: 220
    # Left height = 4m * 25 = 100px. Y from 120 to 220.
    # Bottom width = 8m * 25 = 200px. X from 100 to 300.
    # Right height = 2m * 25 = 50px. Y from 170 to 220.
    # Top horizontal width = 5m * 25 = 125px. X from 100 to 225.
    
    l_pts = [
        (100, 120), (225, 120), (225, 170), (300, 170),
        (300, 220), (100, 220)
    ]
    draw.polygon(l_pts, fill="#E8F0FE", outline="#2A52BE", width=3)
    
    # Labels
    draw_dim_line(draw, (100, 100), (225, 100), "5 m", offset=(0, -15)) # Top
    draw_dim_line(draw, (75, 120), (75, 220), "4 m", offset=(-20, 0)) # Left
    draw_dim_line(draw, (315, 170), (315, 220), "2 m", offset=(20, 0)) # Right
    draw_dim_line(draw, (225, 185), (300, 185), "3 m", offset=(0, 15)) # Right extension top
    draw_dim_line(draw, (100, 245), (300, 245), "8 m", offset=(0, 15)) # Bottom
    
    draw.text((200, 15), "Question 21: L-Shape Garden Area", fill="#333333", font=font_bold, anchor="ma")
    img.save(os.path.join(output_dir, "q21_green_l_shape_area.png"))

    # ==========================================
    # 5. q24_green_compound_perimeter.png (Year 3/4 Q24)
    # Combined rectangle: 4m by 5m. Rectangle A (4m x 3m) and Rectangle B (4m x 2m) adjacent.
    # Scale: 1m = 35px
    # ==========================================
    img = Image.new("RGBA", (400, 300), "white")
    draw = ImageDraw.Draw(img)
    
    # Width = 5m * 35 = 175px. X from 110 to 285.
    # Height = 4m * 35 = 140px. Y from 70 to 210.
    # Divider at 3m * 35 = 105px. X = 110 + 105 = 215.
    
    # Outer rectangle
    draw.rectangle([(110, 70), (285, 210)], fill="#E8F0FE", outline="#2A52BE", width=3)
    # Dashed divider line
    draw.line([(215, 70), (215, 210)], fill="#2A52BE", width=2, joint=None)
    
    # Labels for Rectangle A and B
    draw.text((162, 140), "A", fill="#444444", font=font_bold, anchor="mm")
    draw.text((250, 140), "B", fill="#444444", font=font_bold, anchor="mm")
    
    # Dimension labels
    draw_dim_line(draw, (110, 230), (215, 230), "3 m", offset=(0, 15)) # A width
    draw_dim_line(draw, (215, 230), (285, 230), "2 m", offset=(0, 15)) # B width
    draw_dim_line(draw, (85, 70), (85, 210), "4 m", offset=(-20, 0)) # Height
    
    draw.text((200, 15), "Question 24: Combined Perimeter", fill="#333333", font=font_bold, anchor="ma")
    img.save(os.path.join(output_dir, "q24_green_compound_perimeter.png"))

    # ==========================================
    # 6. q27_green_cutout_perimeter.png (Year 3/4 Q27)
    # Rectangle 6cm by 4cm with a 2cm by 2cm square cut out.
    # Scale: 1cm = 30px
    # Bounding: 6cm (180px) x 4cm (120px)
    # ==========================================
    img = Image.new("RGBA", (400, 300), "white")
    draw = ImageDraw.Draw(img)
    
    # Left = 110, Bottom = 210. Width = 180, Height = 120. Top=90, Right=290
    # Cutout of 2cm (60px) at top right.
    # X from 230 to 290. Y from 90 to 150.
    
    c_pts = [
        (110, 90), (230, 90), (230, 150), (290, 150),
        (290, 210), (110, 210)
    ]
    draw.polygon(c_pts, fill="#E8F0FE", outline="#2A52BE", width=3)
    
    # Labels
    draw_dim_line(draw, (110, 230), (290, 230), "6 cm", offset=(0, 15)) # Bottom
    draw_dim_line(draw, (85, 90), (85, 210), "4 cm", offset=(-20, 0)) # Left
    draw_dim_line(draw, (110, 70), (230, 70), "4 cm", offset=(0, -15)) # Top left
    draw_dim_line(draw, (230, 70), (290, 70), "2 cm", offset=(0, -15)) # Cutout top width
    draw_dim_line(draw, (305, 90), (305, 150), "2 cm", offset=(20, 0)) # Cutout right height
    draw_dim_line(draw, (305, 150), (305, 210), "2 cm", offset=(20, 0)) # Right lower vertical
    
    draw.text((200, 15), "Question 27: Block Perimeter", fill="#333333", font=font_bold, anchor="ma")
    img.save(os.path.join(output_dir, "q27_green_cutout_perimeter.png"))

    print("All maths diagrams successfully drawn and saved.")

if __name__ == "__main__":
    create_images()
