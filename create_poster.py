from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
import os

def create_poster():
    output_path = r"Units\Maths\Maths_Unit_1\grid-coordinates-1\Grid_Reference_Rules_Poster.pdf"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4
    
    # Background
    c.setFillColorRGB(0.13, 0.16, 0.19) # #222831
    c.rect(0, 0, width, height, fill=1)
    
    # Border
    c.setStrokeColorRGB(0.98, 0.43, 0.0) # #F96D00
    c.setLineWidth(10)
    c.rect(20, 20, width-40, height-40)
    
    # Title
    c.setFont("Helvetica-Bold", 48)
    c.setFillColorRGB(0.98, 0.43, 0.0)
    c.drawCentredString(width/2, height - 1.5*inch, "GRID REFERENCE RULES")
    
    # The Golden Rule
    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(colors.white)
    c.drawCentredString(width/2, height - 3.0*inch, "The Golden Rule:")
    
    c.setFont("Helvetica-Bold", 54)
    c.setFillColorRGB(0.98, 0.43, 0.0)
    c.drawCentredString(width/2, height - 4.2*inch, "RUN before you JUMP!")
    
    # Instructions
    c.setFont("Helvetica", 28)
    c.setFillColor(colors.white)
    c.drawCentredString(width/2, height - 5.5*inch, "1. RUN across the X-axis (Horizontal)")
    c.drawCentredString(width/2, height - 6.2*inch, "2. JUMP up the Y-axis (Vertical)")
    
    # Example Box
    c.setStrokeColorRGB(0.2, 0.51, 0.72) # #3282B8
    c.setLineWidth(5)
    c.rect(1*inch, 1*inch, width-2*inch, 2.5*inch)
    
    c.setFont("Helvetica-Bold", 32)
    c.setFillColorRGB(0.2, 0.51, 0.72)
    c.drawCentredString(width/2, 3.0*inch, "Example: ( 3 , 2 )")
    
    c.setFont("Helvetica", 20)
    c.setFillColor(colors.white)
    c.drawCentredString(width/2, 2.3*inch, "The FIRST number (3) is the X-axis (Across)")
    c.drawCentredString(width/2, 1.8*inch, "The SECOND number (2) is the Y-axis (Up)")
    
    # Footer
    c.setFont("Helvetica-Oblique", 12)
    c.setFillColor(colors.lightgrey)
    c.drawCentredString(width/2, 0.7*inch, "Year 5 Mathematics - Australian Curriculum v9 (AC9M5SP02)")
    
    c.save()
    print(f"Poster created successfully at: {output_path}")

if __name__ == "__main__":
    create_poster()
