"""
Cyclone Archive — Print-Friendly PDF Generator
================================================
Generates one compact, attractive PDF per cyclone from the HTML source content.
Uses ReportLab with Noto Serif font approximation (Times-Roman) and a tight
editorial layout designed for zero wasted space.
"""
import os
import html
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    KeepTogether, HRFlowable, PageBreak, Flowable
)
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage

# ─── Colour palette ──────────────────────────────────────────────────────────
PRIMARY    = HexColor("#195de6")
DARK       = HexColor("#111621")
SLATE_900  = HexColor("#0f172a")
SLATE_800  = HexColor("#1e293b")
SLATE_700  = HexColor("#334155")
SLATE_600  = HexColor("#475569")
SLATE_500  = HexColor("#64748b")
SLATE_400  = HexColor("#94a3b8")
SLATE_200  = HexColor("#e2e8f0")
SLATE_100  = HexColor("#f1f5f9")
PAPER      = HexColor("#fdfbf7")
AMBER_950  = HexColor("#451a03")
AMBER_500  = HexColor("#f59e0b")
AMBER_400  = HexColor("#fbbf24")
EMERALD_950= HexColor("#022c22")
EMERALD_400= HexColor("#34d399")
SKY_400    = HexColor("#38bdf8")
BLUE_950   = HexColor("#172554")
ORANGE_400 = HexColor("#fb923c")

# ─── Page setup ──────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4  # 210mm x 297mm
MARGIN_L = 15*mm
MARGIN_R = 15*mm
MARGIN_T = 15*mm
MARGIN_B = 15*mm
USABLE_W = PAGE_W - MARGIN_L - MARGIN_R

# ─── Styles ──────────────────────────────────────────────────────────────────
def make_styles():
    s = {}
    s['title'] = ParagraphStyle('Title',
        fontName='Times-Bold', fontSize=28, leading=30,
        textColor=SLATE_900, spaceAfter=2*mm, alignment=TA_LEFT)
    s['subtitle'] = ParagraphStyle('Subtitle',
        fontName='Times-Italic', fontSize=12, leading=15,
        textColor=SLATE_600, spaceAfter=3*mm, alignment=TA_LEFT)
    s['eyebrow'] = ParagraphStyle('Eyebrow',
        fontName='Helvetica-Bold', fontSize=7, leading=9,
        textColor=PRIMARY, spaceAfter=2*mm, alignment=TA_LEFT,
        tracking=2)
    s['h2'] = ParagraphStyle('H2',
        fontName='Times-Bold', fontSize=15, leading=17,
        textColor=SLATE_900, spaceBefore=5*mm, spaceAfter=2*mm)
    s['body'] = ParagraphStyle('Body',
        fontName='Times-Roman', fontSize=9.5, leading=13,
        textColor=SLATE_700, alignment=TA_JUSTIFY, spaceAfter=2*mm)
    s['body_light'] = ParagraphStyle('BodyLight',
        fontName='Times-Roman', fontSize=9, leading=12.5,
        textColor=SLATE_600, alignment=TA_JUSTIFY, spaceAfter=2*mm)
    s['dropcap'] = ParagraphStyle('DropCap',
        fontName='Times-Roman', fontSize=10, leading=14,
        textColor=SLATE_800, alignment=TA_JUSTIFY, spaceAfter=3*mm)
    s['quote'] = ParagraphStyle('Quote',
        fontName='Times-Italic', fontSize=11, leading=15,
        textColor=SLATE_800, leftIndent=8*mm, rightIndent=4*mm,
        spaceAfter=1*mm, alignment=TA_LEFT)
    s['quote_attr'] = ParagraphStyle('QuoteAttr',
        fontName='Helvetica-Bold', fontSize=6.5, leading=8,
        textColor=PRIMARY, leftIndent=8*mm, spaceAfter=3*mm)
    s['fact_label'] = ParagraphStyle('FactLabel',
        fontName='Helvetica', fontSize=6, leading=7,
        textColor=SLATE_500)
    s['fact_value'] = ParagraphStyle('FactValue',
        fontName='Times-Bold', fontSize=16, leading=18,
        textColor=SLATE_900)
    s['caption'] = ParagraphStyle('Caption',
        fontName='Helvetica', fontSize=7, leading=9,
        textColor=SLATE_500, alignment=TA_LEFT, spaceAfter=2*mm)
    s['timeline_date'] = ParagraphStyle('TimelineDate',
        fontName='Helvetica-Bold', fontSize=6.5, leading=8,
        textColor=SLATE_500)
    s['timeline_text'] = ParagraphStyle('TimelineText',
        fontName='Times-Roman', fontSize=7.5, leading=10,
        textColor=SLATE_700, spaceAfter=1.5*mm)
    s['section_header'] = ParagraphStyle('SectionHeader',
        fontName='Helvetica-Bold', fontSize=7, leading=9,
        textColor=PRIMARY, spaceAfter=2*mm)
    s['impact_title'] = ParagraphStyle('ImpactTitle',
        fontName='Times-Bold', fontSize=14, leading=16,
        textColor=white, spaceAfter=2*mm)
    s['impact_body'] = ParagraphStyle('ImpactBody',
        fontName='Times-Roman', fontSize=8.5, leading=12,
        textColor=HexColor("#cbd5e1"), alignment=TA_JUSTIFY, spaceAfter=2*mm)
    s['impact_quote'] = ParagraphStyle('ImpactQuote',
        fontName='Times-Italic', fontSize=10, leading=13.5,
        textColor=white, leftIndent=6*mm, spaceAfter=1*mm)
    s['impact_attr'] = ParagraphStyle('ImpactAttr',
        fontName='Helvetica-Bold', fontSize=6.5, leading=8,
        textColor=AMBER_400, leftIndent=6*mm, spaceAfter=3*mm)
    s['learning_title'] = ParagraphStyle('LearningTitle',
        fontName='Helvetica-Bold', fontSize=8, leading=10,
        textColor=white, spaceAfter=1.5*mm)
    s['learning_body'] = ParagraphStyle('LearningBody',
        fontName='Times-Roman', fontSize=8, leading=11,
        textColor=HexColor("#e2e8f0"), alignment=TA_JUSTIFY, spaceAfter=1.5*mm)
    s['learning_bullet'] = ParagraphStyle('LearningBullet',
        fontName='Times-Roman', fontSize=7.5, leading=10.5,
        textColor=HexColor("#e2e8f0"), leftIndent=4*mm,
        bulletIndent=0, spaceAfter=1.5*mm, alignment=TA_JUSTIFY)
    s['press_source'] = ParagraphStyle('PressSource',
        fontName='Helvetica-Bold', fontSize=6, leading=8,
        textColor=PRIMARY, spaceAfter=1*mm)
    s['press_headline'] = ParagraphStyle('PressHeadline',
        fontName='Times-Bold', fontSize=10, leading=12,
        textColor=SLATE_900, spaceAfter=1*mm, alignment=TA_CENTER)
    s['press_desc'] = ParagraphStyle('PressDesc',
        fontName='Times-Roman', fontSize=7, leading=9.5,
        textColor=SLATE_500, alignment=TA_CENTER, spaceAfter=1*mm)
    s['footer'] = ParagraphStyle('Footer',
        fontName='Helvetica', fontSize=6, leading=8,
        textColor=SLATE_400, alignment=TA_CENTER)
    return s

STYLES = make_styles()


# ─── Custom Flowables ────────────────────────────────────────────────────────

class ColourBlock(Flowable):
    """A full-width coloured background box containing flowable content."""
    def __init__(self, elements, bg_colour, padding=4*mm, corner_radius=2*mm):
        Flowable.__init__(self)
        self.elements = elements
        self.bg_colour = bg_colour
        self.padding = padding
        self.corner_radius = corner_radius
        self._calculated = False

    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        inner_w = availWidth - 2 * self.padding
        total_h = 0
        for el in self.elements:
            w, h = el.wrap(inner_w, availHeight)
            total_h += h
        self.height = total_h + 2 * self.padding
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        c.setFillColor(self.bg_colour)
        c.roundRect(0, 0, self.width, self.height,
                    self.corner_radius, stroke=0, fill=1)
        # Draw elements top-down
        y = self.height - self.padding
        inner_w = self.width - 2 * self.padding
        for el in self.elements:
            w, h = el.wrap(inner_w, self.height)
            y -= h
            el.drawOn(c, self.padding, y)
        c.restoreState()


class QuoteBar(Flowable):
    """A blockquote with a coloured left bar."""
    def __init__(self, quote_text, attribution, bar_colour=PRIMARY,
                 bg_colour=white):
        Flowable.__init__(self)
        self.q = Paragraph(f'\u201c{quote_text}\u201d', STYLES['quote'])
        self.a = Paragraph(f'\u2014 {attribution}', STYLES['quote_attr'])
        self.bar_colour = bar_colour
        self.bg_colour = bg_colour

    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        inner_w = availWidth - 12*mm
        _, qh = self.q.wrap(inner_w, availHeight)
        _, ah = self.a.wrap(inner_w, availHeight)
        self.height = qh + ah + 6*mm
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        # Background
        c.setFillColor(self.bg_colour)
        c.roundRect(0, 0, self.width, self.height, 2*mm, stroke=0, fill=1)
        # Left bar
        c.setFillColor(self.bar_colour)
        c.rect(0, 2*mm, 3*mm, self.height - 4*mm, stroke=0, fill=1)
        # Text
        inner_w = self.width - 12*mm
        _, qh = self.q.wrap(inner_w, self.height)
        _, ah = self.a.wrap(inner_w, self.height)
        y = self.height - 3*mm
        y -= qh
        self.q.drawOn(c, 8*mm, y)
        y -= ah
        self.a.drawOn(c, 8*mm, y)
        c.restoreState()


class HeroBlock(Flowable):
    """Title block with a dark background and cyclone metadata."""
    def __init__(self, eyebrow, title, subtitle, location, year,
                 image_path=None):
        Flowable.__init__(self)
        self.eyebrow = eyebrow
        self.title = title
        self.subtitle = subtitle
        self.location = location
        self.year = year
        self.image_path = image_path

    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        # Calculate height based on content
        base_h = 55*mm
        if self.image_path and os.path.exists(self.image_path):
            base_h = 70*mm
        self.height = base_h
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        # Dark background
        c.setFillColor(SLATE_900)
        c.roundRect(0, 0, self.width, self.height, 3*mm, stroke=0, fill=1)

        # Background image (faded) if available
        if self.image_path and os.path.exists(self.image_path):
            try:
                c.saveState()
                # Clip to rounded rect
                p = c.beginPath()
                p.roundRect(0, 0, self.width, self.height, 3*mm)
                c.clipPath(p)
                c.setFillAlpha(0.15)
                c.drawImage(self.image_path, 0, 0,
                          width=self.width, height=self.height,
                          preserveAspectRatio=True, anchor='c', mask='auto')
                c.restoreState()
            except:
                pass

        pad = 6*mm
        y = self.height - pad

        # Eyebrow
        c.setFillColor(PRIMARY)
        c.setFont('Helvetica-Bold', 6.5)
        c.drawString(pad, y - 6, self.eyebrow.upper())
        y -= 12*mm

        # Title
        c.setFillColor(white)
        c.setFont('Times-Bold', 28)
        # Split long titles
        if len(self.title) > 18:
            c.setFont('Times-Bold', 24)
        c.drawString(pad, y - 4, self.title)
        y -= 10*mm

        # Subtitle
        c.setFillColor(SLATE_400)
        c.setFont('Times-Italic', 10)
        # Word-wrap subtitle
        words = self.subtitle.split()
        lines = []
        current_line = ""
        for word in words:
            test = current_line + " " + word if current_line else word
            if c.stringWidth(test, 'Times-Italic', 10) < self.width - 2*pad:
                current_line = test
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)
        for line in lines[:3]:
            c.drawString(pad, y, line)
            y -= 4*mm

        y -= 2*mm
        # Location + Year bar
        c.setFillColor(SLATE_500)
        c.setFont('Helvetica', 7)
        c.drawString(pad, y, f"{self.location}  \u2022  {self.year}")

        c.restoreState()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def safe_img(path, max_w, max_h=None):
    """Return an Image flowable scaled to fit, or None if missing."""
    if not path or not os.path.exists(path):
        return None
    try:
        pil = PILImage.open(path)
        iw, ih = pil.size
        ratio = iw / ih
        w = min(max_w, iw)
        h = w / ratio
        if max_h and h > max_h:
            h = max_h
            w = h * ratio
        return Image(path, width=w, height=h)
    except Exception:
        return None

def add_fact_row(value, label):
    """Return a table row for the Fast Facts sidebar."""
    return [
        Paragraph(str(value), STYLES['fact_value']),
        Paragraph(label.upper(), STYLES['fact_label']),
    ]


def build_facts_table(facts, title="FAST FACTS"):
    """Build a compact facts box."""
    rows = []
    for val, label in facts:
        rows.append([
            Paragraph(str(val), STYLES['fact_value']),
            Paragraph(label.upper(), STYLES['fact_label']),
        ])

    # Convert to two-column layout for compactness
    data = []
    for i in range(0, len(rows), 2):
        if i + 1 < len(rows):
            data.append([rows[i][0], rows[i][1],
                        rows[i+1][0], rows[i+1][1]])
        else:
            data.append([rows[i][0], rows[i][1], '', ''])

    col_w = USABLE_W / 4
    t = Table(data, colWidths=[col_w*0.3, col_w*0.7, col_w*0.3, col_w*0.7])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 1*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1*mm),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, SLATE_200),
    ]))

    header = Paragraph(f'\u26a1 {title}', STYLES['section_header'])
    elements = [header, t]
    return ColourBlock(elements, SLATE_100, padding=3*mm)


def build_timeline(events):
    """Build a compact timeline."""
    items = []
    items.append(Paragraph('TIMELINE', STYLES['section_header']))
    for date, desc in events:
        items.append(Paragraph(f'<b>{date}</b>', STYLES['timeline_date']))
        items.append(Paragraph(desc, STYLES['timeline_text']))
    return ColourBlock(items, SLATE_100, padding=3*mm)


def build_press_section(articles):
    """Build a compact press coverage row."""
    col_w = (USABLE_W - 4*mm) / 3
    cells = []
    for source, headline, desc, date in articles:
        cell = [
            Paragraph(source.upper(), STYLES['press_source']),
            Paragraph(f'\u201c{headline}\u201d', STYLES['press_headline']),
            Paragraph(f'{desc}', STYLES['press_desc']),
            Paragraph(date, ParagraphStyle('PressDate',
                fontName='Helvetica', fontSize=6, leading=8,
                textColor=SLATE_400, alignment=TA_CENTER)),
        ]
        cells.append(cell)

    # Pad to 3 if needed
    while len(cells) < 3:
        cells.append(['', '', '', ''])

    data = [cells[:3]]
    t = Table(data, colWidths=[col_w]*3, spaceBefore=0, spaceAfter=0)
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 2*mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2*mm),
        ('TOPPADDING', (0, 0), (-1, -1), 2*mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2*mm),
        ('BACKGROUND', (0, 0), (-1, -1), SLATE_100),
        ('ROUNDEDCORNERS', [2*mm, 2*mm, 2*mm, 2*mm]),
        ('LINEAFTER', (0, 0), (1, -1), 0.5, SLATE_200),
    ]))
    return t


def build_learning_box(title, intro, bullets, bg_colour, accent_colour):
    """Build a learning focus box."""
    elements = []
    elements.append(Paragraph(
        f'\U0001f4a1 {title}',
        ParagraphStyle('LT', fontName='Helvetica-Bold', fontSize=8,
                       leading=10, textColor=accent_colour, spaceAfter=1.5*mm)
    ))
    elements.append(Paragraph(intro,
        ParagraphStyle('LI', fontName='Times-Roman', fontSize=7.5,
                       leading=10.5, textColor=HexColor("#cbd5e1"),
                       spaceAfter=2*mm, alignment=TA_JUSTIFY)
    ))
    bullet_style = ParagraphStyle('LB',
        fontName='Times-Roman', fontSize=7.5, leading=10,
        textColor=HexColor("#e2e8f0"), leftIndent=4*mm,
        spaceAfter=1.5*mm, alignment=TA_JUSTIFY)
    for b in bullets:
        elements.append(Paragraph(f'\u2713 {b}', bullet_style))

    return ColourBlock(elements, bg_colour, padding=4*mm)


# ─── Page footer ─────────────────────────────────────────────────────────────

def footer_canvas(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setFont('Helvetica', 6)
    canvas_obj.setFillColor(SLATE_400)
    canvas_obj.drawCentredString(
        PAGE_W / 2, 8*mm,
        f"Cyclone Archive  \u2022  Joshua  \u2022  Page {doc.page}"
    )
    # Top accent line
    canvas_obj.setStrokeColor(PRIMARY)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.line(MARGIN_L, PAGE_H - 10*mm,
                    PAGE_W - MARGIN_R, PAGE_H - 10*mm)
    canvas_obj.restoreState()


# ─── Individual cyclone builders ─────────────────────────────────────────────

def build_tracy(base):
    """Cyclone Tracy PDF content."""
    story = []
    hero_img = os.path.join(base, 'Cyclone_Tracy', 'Suburb.png')
    story.append(HeroBlock(
        'CATASTROPHE \u2022 1974',
        'Cyclone Tracy',
        'The night the wind howled like a banshee and a city ceased to exist.',
        'Darwin, Northern Territory',
        '1974',
        hero_img
    ))
    story.append(Spacer(1, 3*mm))

    # Facts + Timeline side by side
    facts = build_facts_table([
        ('66', 'Total Fatalities'),
        ('41,000', 'Homeless'),
        ('$800M', 'Damage (1974)'),
        ('Cat 4', 'Severe Cyclone'),
        ('217', 'Peak Winds km/h'),
        ('90%', 'Homes Destroyed'),
    ])
    timeline = build_timeline([
        ('21 Dec 1974', 'Tropical cyclone forms in the Arafura Sea.'),
        ('24 Dec, 10:00 AM', 'Tracy turns sharply towards Darwin.'),
        ('25 Dec, 3:00 AM', 'Eye passes directly over the city.'),
        ('26 Dec', 'Evacuations begin; largest airlift in Australian history.'),
    ])
    story.append(Table([[facts, timeline]],
        colWidths=[USABLE_W*0.52, USABLE_W*0.48]))
    story.append(Spacer(1, 3*mm))

    # Article
    story.append(Paragraph(
        'Christmas Eve in Darwin, 1974, was hot, humid, and heavy with anticipation. '
        'Not for the storm that was brewing hundreds of miles out in the Arafura Sea, '
        'but for the holiday celebrations. Families were unwrapping the last of the ham, '
        'children were restless with excitement, and the air conditioners hummed a collective '
        'drone across the northern capital. But the radio bulletins had begun to change tone. '
        'What was once a distant depression named Tracy had taken a sudden, malevolent turn.',
        STYLES['dropcap']))

    story.append(Paragraph(
        'By midnight, the festivities were over. The wind had picked up, stripping leaves '
        'from the frangipani trees and rattling the louvers of the elevated fibro houses that '
        'defined Darwin\u2019s architecture. These structures, built for airflow rather than '
        'fortification, stood like fragile card houses in the path of a bowling ball.',
        STYLES['body_light']))

    story.append(Paragraph(
        'Residents hunkered down, many assuming it would be another blow, a bit of rain, '
        'and a story for Boxing Day breakfast. They were wrong. At 3:00 AM on Christmas '
        'morning, the eye of Cyclone Tracy passed directly over the city, unleashing wind '
        'speeds that broke the anemometer at the airport after registering 217 km/h.',
        STYLES['body_light']))

    story.append(QuoteBar(
        'We woke up to a world that had simply ceased to be. The house wasn\u2019t just damaged; '
        'it was gone. The street was gone. The landmarks were gone.',
        'Survivor Account, 1975'))

    story.append(Paragraph('The Sound of Destruction', STYLES['h2']))
    story.append(Paragraph(
        'Survivors consistently recall the noise above all else. It wasn\u2019t just the wind; '
        'it was the sound of the city physically tearing apart. The screaming of twisting metal, '
        'the explosion of glass, and the grinding of timber. In the darkness, devoid of electricity, '
        'the auditory horror was amplified.',
        STYLES['body_light']))

    # Image
    img = safe_img(os.path.join(base, 'Cyclone_Tracy', 'City.png'),
                   USABLE_W, 55*mm)
    if img:
        story.append(img)
        story.append(Paragraph(
            'Archival photograph taken in the days following landfall. The northern suburbs '
            'suffered catastrophic structural failure, with over 90% of homes destroyed.',
            STYLES['caption']))

    story.append(Paragraph(
        'When the sun rose on Christmas morning, it illuminated a wasteland. The lush tropical '
        'foliage was stripped bare or uprooted entirely. Power lines lay snarled in the streets '
        'like black spaghetti. But the human toll was the most devastating realisation. Sixty-six '
        'people had lost their lives in the chaos, and hundreds more were injured.',
        STYLES['body_light']))

    story.append(Paragraph('Operation Navy Help', STYLES['h2']))
    story.append(Paragraph(
        'In the days that followed, Darwin became the site of Australia\u2019s largest civil evacuation '
        'effort. With no power, no running water, and the threat of disease looming in the tropical '
        'heat, the decision was made to evacuate the majority of the population. Over 30,000 people '
        'were airlifted out of the city in a matter of days. It reshaped the demographic of the city '
        'for decades. Many never returned, too traumatised by the memory of that Christmas morning. '
        'Those who stayed, however, forged a bond of resilience that defines Darwin\u2019s spirit to this day.',
        STYLES['body_light']))

    # Maps
    img_map1 = safe_img(os.path.join(base, 'Cyclone_Tracy', 'Map.png'),
                        USABLE_W*0.48, 45*mm)
    img_map2 = safe_img(os.path.join(base, 'Cyclone_Tracy', 'Map two.png'),
                        USABLE_W*0.48, 45*mm)
    if img_map1 and img_map2:
        story.append(Paragraph('METEOROLOGICAL RECORD', STYLES['section_header']))
        story.append(Table([[img_map1, img_map2]],
            colWidths=[USABLE_W*0.5, USABLE_W*0.5]))
        story.append(Paragraph(
            'Left: Cyclone Tracy\u2019s colour-coded path from Dec 20\u201325. '
            'Right: Hour-by-hour track through the Van Diemen Gulf to Darwin.',
            STYLES['caption']))

    # Press coverage
    story.append(Spacer(1, 2*mm))
    story.append(Paragraph('MEDIA RECORD \u2014 THE FRONT PAGES', STYLES['section_header']))

    # Newspaper images
    news_imgs = []
    for fname in ['News darwin-wiped-out-large.png', 'News two.png', 'News three.png']:
        img = safe_img(os.path.join(base, 'Cyclone_Tracy', fname),
                       USABLE_W*0.31, 50*mm)
        if img:
            news_imgs.append(img)
    if news_imgs:
        story.append(Table([news_imgs],
            colWidths=[USABLE_W/len(news_imgs)]*len(news_imgs)))
        story.append(Paragraph(
            'Left: "Darwin Wiped Out" (The Sun, 26 Dec). Centre: "Tracy \u2014 She Broke His Heart" '
            '(The Herald, 27 Dec). Right: "The Day Darwin Died" (The Sun, 27 Dec).',
            STYLES['caption']))

    return story


def build_larry(base):
    """Cyclone Larry PDF content."""
    story = []
    hero_img = os.path.join(base, 'Cyclone_Larry', 'Satellite image.png')
    story.append(HeroBlock(
        'CATASTROPHE \u2022 2006',
        'Cyclone Larry',
        'The morning the Wet Tropics went quiet \u2014 and Australia ran out of bananas.',
        'Innisfail, Far North Queensland',
        '2006',
        hero_img
    ))
    story.append(Spacer(1, 3*mm))

    facts = build_facts_table([
        ('0', 'Direct Fatalities'),
        ('10,000+', 'Homes Damaged'),
        ('$1.5bn', 'Damage (2006)'),
        ('Cat 5', 'Severe Cyclone'),
        ('240+', 'Peak Gusts km/h'),
        ('80%', 'Aus. Banana Crop Lost'),
    ])
    timeline = build_timeline([
        ('17 Mar 2006', 'Tropical disturbance develops in the Coral Sea.'),
        ('19 Mar, Afternoon', 'Larry rapidly intensifies to Category 5.'),
        ('20 Mar, 6:28 AM', 'Eye crosses coast south of Innisfail.'),
        ('20 Mar, Afternoon', 'Weakens rapidly over Atherton Tablelands.'),
    ])
    story.append(Table([[facts, timeline]],
        colWidths=[USABLE_W*0.52, USABLE_W*0.48]))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph(
        'Dawn broke slowly over the Wet Tropics on 20 March 2006 \u2014 or rather, it didn\u2019t. '
        'By the time first light should have filtered through the ancient rainforest canopy above '
        'Innisfail, the sky had already turned a sickly green-grey. Cyclone Larry had been tracking '
        'west for three days through the Coral Sea, tightening its spiral with each passing hour '
        'until it had become one of the most intense tropical cyclones to approach the Australian '
        'mainland in a generation. By 6:28 in the morning, Far North Queensland\u2019s banana belt '
        'was about to be erased.',
        STYLES['dropcap']))

    story.append(Paragraph(
        'The residents of the Innisfail district had been warned. In the 48 hours prior, the Bureau '
        'of Meteorology issued escalating warnings. Schools closed, shelves emptied, and Innisfail\u2019s '
        'daily life fell into an anxious quiet. Families moved vehicles to high ground, strapped '
        'roofing iron, and gathered in hallways and bathrooms with mattresses against the louvres.',
        STYLES['body_light']))

    story.append(QuoteBar(
        'The bananas were just gone. The cane was gone. Fifty years of farming, obliterated before '
        'breakfast. But we were still standing \u2014 and that was all that mattered.',
        'Innisfail farmer, March 2006'))

    story.append(Paragraph('A Miraculous Zero', STYLES['h2']))
    story.append(Paragraph(
        'Among the most remarkable aspects of Cyclone Larry\u2019s history is what did not happen. '
        'Despite the ferocity of the storm \u2014 winds that snapped power poles like matchsticks \u2014 '
        'there were no direct fatalities. The zero death toll stands as an extraordinary testament '
        'to the effectiveness of Australia\u2019s emergency management systems.',
        STYLES['body_light']))

    img = safe_img(os.path.join(base, 'Cyclone_Larry', 'Banana crop.png'),
                   USABLE_W, 45*mm)
    if img:
        story.append(img)
        story.append(Paragraph(
            'The Banana Belt \u2014 Every plant across thousands of hectares was snapped at the stem. '
            'Australia\u2019s banana industry took nearly two years to recover.',
            STYLES['caption']))

    story.append(Paragraph('The Banana Belt Broken', STYLES['h2']))
    story.append(Paragraph(
        'The agricultural catastrophe was the defining legacy of Larry\u2019s passage. The Wet Tropics region '
        'produces the overwhelming majority of Australia\u2019s banana crop, and the cyclone eliminated '
        'nearly all of it in a single morning. Banana prices surged to over $6/kg. Total economic '
        'damage was estimated at A$1.5 billion.',
        STYLES['body_light']))

    story.append(Paragraph('Innisfail and the Recovery', STYLES['h2']))
    story.append(Paragraph(
        'Innisfail\u2019s Art Deco buildings \u2014 erected after a devastating 1918 cyclone \u2014 bore the full '
        'brunt. Yet the town\u2019s response was immediate. Within hours, the community had begun clearing '
        'roads and checking on neighbours. Thousands of ADF personnel and emergency volunteers converged. '
        'The federal government committed over $150 million in immediate disaster relief.',
        STYLES['body_light']))

    # Gallery images
    img1 = safe_img(os.path.join(base, 'Cyclone_Larry', 'Devastation.png'),
                    USABLE_W*0.48, 40*mm)
    img2 = safe_img(os.path.join(base, 'Cyclone_Larry', 'Street scene.png'),
                    USABLE_W*0.48, 40*mm)
    if img1 and img2:
        story.append(Paragraph('THE AFTERMATH', STYLES['section_header']))
        story.append(Table([[img1, img2]],
            colWidths=[USABLE_W*0.5, USABLE_W*0.5]))
        story.append(Paragraph(
            'Left: A resident surveys roof damage. Right: BOM photo of leaning power poles, Innisfail.',
            STYLES['caption']))

    return story


def build_althea(base):
    """Cyclone Althea PDF content."""
    story = []
    hero_img = os.path.join(base, 'Cyclone_Althea', 'hero.png')
    story.append(HeroBlock(
        'CATASTROPHE \u2022 1971',
        'Cyclone Althea',
        'A Christmas Eve that changed Townsville \u2014 and rewrote Australian building codes.',
        'Townsville, Queensland',
        '1971',
        hero_img
    ))
    story.append(Spacer(1, 3*mm))

    facts = build_facts_table([
        ('3', 'Fatalities'),
        ('3,300+', 'Homes Damaged'),
        ('Cat 4', 'Severe Cyclone'),
        ('196', 'Peak Gusts km/h'),
        ('1972', 'CTS Founded at JCU'),
        ('Townsville', 'Christmas Eve Landfall'),
    ])
    timeline = build_timeline([
        ('18 Dec 1971', 'Tropical cyclone forms in the Coral Sea.'),
        ('24 Dec 1971', 'Strikes Townsville as Category 4. 3,300 homes damaged.'),
        ('25 Dec 1971', 'Recovery begins; families spend Christmas assessing damage.'),
        ('1972', 'Cyclone Testing Station founded at JCU as a direct response.'),
    ])
    story.append(Table([[facts, timeline]],
        colWidths=[USABLE_W*0.52, USABLE_W*0.48]))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph(
        'Christmas Eve in Townsville, 1971. Children had gone to bed expecting presents. '
        'What came instead was wind \u2014 gusts reaching 196 km/h tearing the roofs from '
        'fibrous cement houses that had not been built to withstand what Cyclone Althea '
        'was about to deliver. Three years before Tracy would flatten Darwin, Townsville '
        'would have its own reckoning \u2014 and what came out of that destruction would change '
        'Australian building codes for decades.',
        STYLES['dropcap']))

    story.append(QuoteBar(
        'We drove through Townsville and I kept stopping the car to look at how the roofs '
        'had failed. And it was always the same four or five failure modes. I thought \u2014 '
        'if we can test those failure modes, we can prevent them.',
        'Professor James Reardon, founding director of the Cyclone Testing Station, JCU'))

    story.append(Paragraph('The Buildings That Failed', STYLES['h2']))
    story.append(Paragraph(
        'Post-Althea engineering surveys revealed a consistent pattern. Homes failed with '
        'entire roofs lifted cleanly from walls. The common characteristics: minimal roof-to-wall '
        'tie-down connections, undersized timber purlins, and reliance on roof nails rather than '
        'structural metal connectors. The walls stood intact; the roof connections failed. This '
        'insight became the foundation of cyclone-resistant building code reforms.',
        STYLES['body_light']))

    img = safe_img(os.path.join(base, 'Cyclone_Althea', 'building-damage.png'),
                   USABLE_W, 45*mm)
    if img:
        story.append(img)
        story.append(Paragraph(
            'A typical post-Althea scene: walls standing, roof gone. This pattern was documented '
            'systematically and directly informed the founding of the Cyclone Testing Station.',
            STYLES['caption']))

    story.append(Paragraph('The Community Rebuilt', STYLES['h2']))
    story.append(Paragraph(
        'The recovery was swift and community-led. Neighbours helped neighbours clear debris. '
        'But the most enduring recovery was institutional. In 1972, James Cook University established '
        'the Cyclone Testing Station \u2014 a purpose-built facility for full-scale structural testing '
        'under simulated cyclonic conditions. The first institution of its kind in the world, the CTS '
        'has directly shaped Australian building codes for over fifty years.',
        STYLES['body_light']))

    # Gallery: recovery image
    img_r = safe_img(os.path.join(base, 'Cyclone_Althea', 'recovery.png'),
                     USABLE_W, 40*mm)
    if img_r:
        story.append(Paragraph('THE AFTERMATH', STYLES['section_header']))
        story.append(img_r)
        story.append(Paragraph(
            'Townsville residents working together to clear cyclone debris, December 1971. '
            'The community-led response was swift \u2014 neighbours helping neighbours from the first morning.',
            STYLES['caption']))

    # Press coverage
    story.append(Paragraph('MEDIA RECORD \u2014 THE FRONT PAGES', STYLES['section_header']))
    story.append(build_press_section([
        ('The Townsville Bulletin', 'Althea Strikes on Christmas Eve \u2014 3,300 Homes Hit',
         'The local paper\u2019s emergency Christmas Day edition.', '25 Dec 1971'),
        ('The Courier-Mail', 'How Townsville\u2019s Homes Failed \u2014 The Engineers\u2019 Verdict',
         'Landmark feature on the post-cyclone engineering surveys.', 'Jan 1972'),
        ('The Australian', 'JCU Opens World-First Cyclone Lab',
         'The Cyclone Testing Station\u2019s establishment announcement.', '1972'),
    ]))

    # Impact story: Learning box
    story.append(Spacer(1, 2*mm))
    story.append(build_learning_box(
        'LEARNING FOCUS: How Disasters Drive Social Change',
        'Some of the most important changes in how societies protect themselves have come directly from disaster.',
        [
            '<b>Building codes</b> are the legal minimum standards managed through the National Construction Code (NCC). Every major cyclone contributed data that shaped these standards.',
            '<b>The Cyclone Testing Station (CTS)</b> at JCU physically tests building components under cyclonic wind loads. Engineers find failure points before a real cyclone does.',
            '<b>Post-disaster forensic engineering</b> involves systematically studying damaged buildings after a cyclone to understand exactly how they failed.',
            '<b>Community resilience</b> is built through research, good building standards, effective warnings, and education. Townsville\'s experience made the region demonstrably more resilient.',
        ],
        BLUE_950, SKY_400
    ))

    return story


def build_george(base):
    """Cyclone George PDF content."""
    story = []
    hero_img = os.path.join(base, 'Cyclone_George', 'hero.png')
    story.append(HeroBlock(
        'CATASTROPHE \u2022 2007',
        'Cyclone George',
        'A Category 5 monster strikes Australia\u2019s iron heart \u2014 and the global economy feels the tremor.',
        'Port Hedland, Western Australia',
        '2007',
        hero_img
    ))
    story.append(Spacer(1, 3*mm))

    facts = build_facts_table([
        ('3', 'Fatalities'),
        ('$2.9bn', 'Total Damage (2007)'),
        ('Cat 5', 'Severe Cyclone'),
        ('935 hPa', 'Central Pressure'),
        ('295', 'Peak Gusts km/h'),
        ('2 wks', 'Port Hedland Shut Down'),
    ])
    timeline = build_timeline([
        ('5 Mar 2007', 'Tropical cyclone develops in the eastern Indian Ocean.'),
        ('7 Mar', 'Rapidly intensifies to Category 5; 240 km/h sustained.'),
        ('8 Mar, 1:50 AM', 'Eye crosses coast south of Port Hedland. 3 fatalities at work camp.'),
        ('8 Mar, Morning', 'Weakens over the Pilbara desert. Mining operations suspended.'),
    ])
    story.append(Table([[facts, timeline]],
        colWidths=[USABLE_W*0.52, USABLE_W*0.48]))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph(
        'In the early hours of 8 March 2007, a Category 5 tropical cyclone crossed the Pilbara coast '
        'of Western Australia with sustained winds of 240 km/h. What Cyclone George struck \u2014 '
        'the iron ore infrastructure of the Pilbara \u2014 was the economic engine of Australia\u2019s '
        'resource boom. When George came ashore, the world felt it.',
        STYLES['dropcap']))

    story.append(Paragraph(
        'The Pilbara region is one of the most geologically remarkable places on Earth. Iron ore '
        'extracted here feeds the steel mills of Japan, South Korea, and above all, China. The mines '
        'of BHP and Rio Tinto were not merely profitable; they were national infrastructure.',
        STYLES['body_light']))

    story.append(QuoteBar(
        'We were sheltering in a demountable. I could hear the steel walls moving. Not vibrating '
        '\u2014 actually flexing. And then the roof lifted off and we just held onto each other in the dark.',
        'Mining camp worker, Ophthalmia Dam site, March 2007'))

    story.append(Paragraph('The Human Cost', STYLES['h2']))
    story.append(Paragraph(
        'Three people died \u2014 all at the Ophthalmia Dam construction camp operated by FMG. '
        'The deaths occurred when prefabricated accommodation buildings were overturned by the '
        'cyclone\u2019s winds. The tragedy prompted an immediate investigation into structural '
        'standards at temporary accommodation facilities at remote mine sites.',
        STYLES['body_light']))

    img = safe_img(os.path.join(base, 'Cyclone_George', 'mine-damage.png'),
                   USABLE_W, 45*mm)
    if img:
        story.append(img)
        story.append(Paragraph(
            'Cyclone damage at a Pilbara mining camp \u2014 prefabricated accommodation demolished '
            'by George\u2019s 295 km/h gusts.',
            STYLES['caption']))

    story.append(Paragraph('A Global Tremor', STYLES['h2']))
    story.append(Paragraph(
        'Iron ore shipments from Port Hedland were suspended for approximately two weeks. Port Hedland '
        'ships over 500 million tonnes annually \u2014 80% bound for China. A two-week disruption sent '
        'ripples through steel futures markets in Tokyo, London, and Shanghai. Spot iron ore prices '
        'climbed. A single tropical cyclone had reached into the global economy with unexpected force.',
        STYLES['body_light']))

    # Gallery: additional images
    george_assets = os.path.join(base, 'Cyclone_George', 'Assets', 'named_images')
    img_g1 = safe_img(os.path.join(george_assets, 'fig_e1_overturned_building_de_grey.jpeg'),
                      USABLE_W*0.48, 35*mm)
    img_g2 = safe_img(os.path.join(george_assets, 'fig_e4_overturned_tanker_indee.jpeg'),
                      USABLE_W*0.48, 35*mm)
    if img_g1 and img_g2:
        story.append(Paragraph('THE AFTERMATH', STYLES['section_header']))
        story.append(Table([[img_g1, img_g2]],
            colWidths=[USABLE_W*0.5, USABLE_W*0.5]))
        story.append(Paragraph(
            'Left: An overturned demountable at De Grey Station. '
            'Right: A heavy road tanker flipped on the Indee road south of Port Hedland.',
            STYLES['caption']))

    # Press coverage
    story.append(Paragraph('MEDIA RECORD \u2014 THE FRONT PAGES', STYLES['section_header']))
    story.append(build_press_section([
        ('The West Australian', 'Three Dead as George Hits Pilbara Camp',
         'The state\u2019s major daily led with the human tragedy.', '8 Mar 2007'),
        ('Australian Financial Review', 'Iron Ore Prices Surge After Port Hedland Shutdown',
         'The business press tracked spot price movements.', '9 Mar 2007'),
        ('The Australian', 'Are Mining Camps Safe? The Questions George Left Behind',
         'Investigation into temporary accommodation standards.', 'Mar 2007'),
    ]))

    # Impact story: Learning box
    story.append(Spacer(1, 2*mm))
    story.append(build_learning_box(
        'LEARNING FOCUS: Local Industries &amp; the Global Economy',
        'A natural disaster in one place can affect people on the other side of the world.',
        [
            '<b>Supply chains</b> are networks turning raw materials into finished products. A single disrupted link affects every downstream product.',
            '<b>Commodity markets</b> respond almost instantly to disruptions \u2014 a cyclone in WA can change steel prices in Tokyo within hours.',
            '<b>Economic resilience</b> means building backup suppliers, stockpiles, and alternative routes to absorb shocks.',
            '<b>Workplace safety in disasters</b> \u2014 the three deaths showed FIFO workers in temporary structures face specific vulnerabilities. Safety law was updated.',
        ],
        SLATE_900, ORANGE_400
    ))

    return story


def build_mahina(base):
    """Cyclone Mahina PDF content."""
    story = []
    hero_img = os.path.join(base, 'Cyclone_Mahina', 'hero.png')
    story.append(HeroBlock(
        'CATASTROPHE \u2022 1899',
        'Cyclone Mahina',
        'The sea rose thirteen metres \u2014 and three hundred souls vanished before dawn at Bathurst Bay.',
        'Bathurst Bay, QLD',
        '1899',
        hero_img
    ))
    story.append(Spacer(1, 3*mm))

    facts = build_facts_table([
        ('307+', 'Confirmed Fatalities'),
        ('13 m', 'Storm Surge (World Record)'),
        ('Cat 5', 'Estimated Intensity'),
        ('914 hPa', 'Estimated Pressure'),
        ('100+', 'Vessels Destroyed'),
        ('Pre-1901', 'No Warning System'),
    ])
    timeline = build_timeline([
        ('Early March 1899', 'Cyclone develops in the Coral Sea. No warning system exists.'),
        ('4 March 1899', 'Makes landfall at Bathurst Bay. 13-metre surge overwhelms fleet.'),
        ('5 March 1899', 'Survivors found; full scale of disaster begins to emerge.'),
        ('Weeks Later', 'News reaches Brisbane. A formal inquiry is ordered. 307+ dead.'),
    ])
    story.append(Table([[facts, timeline]],
        colWidths=[USABLE_W*0.52, USABLE_W*0.48]))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph(
        'There was no warning. No radio broadcast, no telegraph alert, no Bureau of Meteorology. '
        'In the first days of March 1899, over a hundred pearling luggers had gathered at Bathurst Bay '
        'on the Cape York Peninsula of Queensland \u2014 their holds filling with pearl shell, one of '
        'Australia\u2019s most valuable exports. On the decks and in anchored camps were over 400 people. '
        'What happened next would remain the deadliest natural disaster in Australian recorded history.',
        STYLES['dropcap']))

    story.append(Paragraph(
        'The pearling industry of the late nineteenth century was fuelled by a multicultural workforce '
        'unlike almost anything else in colonial Australia. Indigenous Australian men and women worked '
        'alongside Japanese, Malay, Timorese, Filipinos, and South Sea Islanders, often under conditions '
        'that would today constitute forced labour.',
        STYLES['body_light']))

    story.append(QuoteBar(
        'I looked for my brother among the wreckage for three days. He was on the lugger nearest '
        'the shore. There was nothing left of it. Nothing at all.',
        'Survivor account, Bathurst Bay, March 1899'))

    story.append(Paragraph('The Wave That Moved Dolphins Inland', STYLES['h2']))
    story.append(Paragraph(
        'The surge was so extraordinary that contemporary accounts recorded dolphins found stranded in '
        'trees several kilometres inland. Fish were found on hillsides twenty metres above sea level. '
        'These details, once dismissed as exaggeration, have since been corroborated by geological '
        'evidence. The entire anchored fleet \u2014 over one hundred vessels \u2014 was destroyed. '
        'Of the 400+ people present, 307 are confirmed dead.',
        STYLES['body_light']))

    img = safe_img(os.path.join(base, 'Cyclone_Mahina', 'lugger.png'),
                   USABLE_W, 45*mm)
    if img:
        story.append(img)
        story.append(Paragraph(
            'Pearling luggers like these were the backbone of Australia\u2019s colonial pearl shell '
            'industry \u2014 and the vessels Cyclone Mahina\u2019s surge lifted and scattered like driftwood.',
            STYLES['caption']))

    story.append(Paragraph('A Disaster Without Warning', STYLES['h2']))
    story.append(Paragraph(
        'The Commonwealth of Australia did not yet exist. No telegraph line reached the remote Cape '
        'York coast. The pearling masters had no instruments to detect Mahina\u2019s rapid intensification. '
        'By the time the rapidly falling barometer told them something was catastrophically wrong, '
        'the surge was already hours away.',
        STYLES['body_light']))

    # Gallery: aftermath image
    img_a = safe_img(os.path.join(base, 'Cyclone_Mahina', 'aftermath.png'),
                     USABLE_W, 40*mm)
    if img_a:
        story.append(Paragraph('THE AFTERMATH', STYLES['section_header']))
        story.append(img_a)
        story.append(Paragraph(
            'The devastation at Bathurst Bay \u2014 the wreckage of the pearling fleet scattered '
            'along the coastline. Over one hundred vessels were destroyed.',
            STYLES['caption']))

    # Impact story: Learning box
    story.append(Spacer(1, 2*mm))
    story.append(build_learning_box(
        'LEARNING FOCUS: Vulnerability in Natural Disasters',
        'Not everyone faces the same level of risk in a natural disaster. Understanding who is most vulnerable \u2014 and why \u2014 is one of the most important lessons in disaster studies.',
        [
            '<b>Social vulnerability</b> refers to characteristics affecting capacity to anticipate, cope with, and recover from disaster. Poverty, language barriers, and legal status all increase vulnerability.',
            '<b>Warning systems</b> save lives \u2014 but only when everyone can access them. In 1899, there were no cyclone warnings at all.',
            '<b>Historical injustice</b> can persist through disasters. The unnamed dead of Bathurst Bay had no memorial for over a century.',
            '<b>Modern disaster preparedness</b> now explicitly considers social vulnerability. The NSDR requires governments to identify and support the most at-risk communities.',
        ],
        AMBER_950, AMBER_400
    ))

    return story


def build_yasi(base):
    """Cyclone Yasi PDF content."""
    story = []
    hero_img = os.path.join(base, 'Cyclone_Yasi', 'hero.png')
    story.append(HeroBlock(
        'CATASTROPHE \u2022 2011',
        'Cyclone Yasi',
        'The night the Wet Tropics went dark \u2014 and a World Heritage rainforest fell silent.',
        'Mission Beach, QLD',
        '2011',
        hero_img
    ))
    story.append(Spacer(1, 3*mm))

    facts = build_facts_table([
        ('1', 'Direct Fatality'),
        ('$3.6bn', 'Total Damage (2011)'),
        ('Cat 5', 'Severe Cyclone'),
        ('929 hPa', 'Central Pressure'),
        ('300+', 'Peak Gusts km/h'),
        ('175,000', 'People Evacuated'),
    ])
    timeline = build_timeline([
        ('29 Jan 2011', 'Tropical low develops east of Vanuatu.'),
        ('1 Feb, Afternoon', 'Rapidly intensifies to Category 5; 285 km/h sustained.'),
        ('2 Feb, ~Midnight', 'Eye crosses coast near Mission Beach \u2014 most intense QLD landfall since 1918.'),
        ('2 Feb, Morning', 'Storm weakens over Cape York Peninsula.'),
    ])
    story.append(Table([[facts, timeline]],
        colWidths=[USABLE_W*0.52, USABLE_W*0.48]))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph(
        'On the night of 1 February 2011, residents across Far North Queensland had already packed what '
        'they could carry and driven inland. The Bureau of Meteorology had been unambiguous for two days: '
        'Cyclone Yasi was going to be the most powerful storm to strike the Queensland coast in living memory. '
        'The warnings worked. But no warning could prepare the land itself.',
        STYLES['dropcap']))

    story.append(Paragraph(
        'At approximately midnight AEST, Yasi\u2019s eye crossed the coast between Mission Beach and Cardwell '
        'as a Category 5 severe tropical cyclone. Sustained winds of 285 km/h, gusting beyond 300 km/h, '
        'tore through the coastal strip. A storm surge of up to five metres inundated the beachfront. '
        'The Wet Tropics World Heritage Area took the full force of the eye wall.',
        STYLES['body_light']))

    story.append(QuoteBar(
        'We thought we understood these forests. They\u2019re hundreds of millions of years old. '
        'But when we walked in after Yasi, it was like walking on another planet. The canopy was simply gone.',
        'Dr. Erin Vandermark, Wet Tropics Authority, February 2011'))

    story.append(Paragraph('A Storm of Record Force', STYLES['h2']))
    story.append(Paragraph(
        'Yasi\u2019s gale-force wind radius extended over 650 km \u2014 simultaneously affecting Cairns '
        'to the north and Townsville to the south, covering an area greater than the United Kingdom. '
        'An estimated 175,000 people evacuated. The death toll \u2014 one direct fatality \u2014 reflected '
        'what can be achieved when warnings are clear and heeded.',
        STYLES['body_light']))

    img = safe_img(os.path.join(base, 'Cyclone_Yasi', 'rainforest.png'),
                   USABLE_W, 45*mm)
    if img:
        story.append(img)
        story.append(Paragraph(
            'Wet Tropics rainforest near Mission Beach following Cyclone Yasi. Ancient trees snapped '
            'at the trunk. The canopy, centuries in the making, was stripped in hours.',
            STYLES['caption']))

    story.append(Paragraph('The Agricultural Reckoning', STYLES['h2']))
    story.append(Paragraph(
        'Just five years after Larry obliterated the banana crop, Yasi struck the same region. '
        'An estimated 75% of Australia\u2019s banana crop was again destroyed. Sugar cane fields '
        'across Tully and Innisfail were flattened. Total economic damage reached A$3.6 billion.',
        STYLES['body_light']))

    # Gallery: surge image
    img_s = safe_img(os.path.join(base, 'Cyclone_Yasi', 'surge.png'),
                     USABLE_W, 40*mm)
    if img_s:
        story.append(Paragraph('STORM SURGE', STYLES['section_header']))
        story.append(img_s)
        story.append(Paragraph(
            'Storm surge inundation at Mission Beach \u2014 Yasi\u2019s surge reached up to '
            'five metres along the coastal strip, devastating beachfront communities.',
            STYLES['caption']))

    # Impact story: Learning box
    story.append(Spacer(1, 2*mm))
    story.append(build_learning_box(
        'LEARNING FOCUS: Ecosystem Vulnerability &amp; Recovery',
        'Natural disasters reveal how ecosystems respond to sudden, extreme stress.',
        [
            '<b>World Heritage Areas</b> are places of extraordinary natural value protected under international law. The Wet Tropics harbours 3,000+ plant species and 107 mammal species.',
            '<b>Ecological resilience</b> is the ability to absorb disturbance and reorganise. Ancient rainforests have evolved to recover from cyclones over millions of years.',
            '<b>Climate change</b> is increasing the frequency and intensity of Category 4 and 5 cyclones. If ecosystems face more frequent extreme events, they may not recover between each one.',
            '<b>Coral bleaching</b> occurs when stress causes coral to expel its algae. Cyclone runoff, combined with warming oceans, puts reef systems at serious long-term risk.',
        ],
        EMERALD_950, EMERALD_400
    ))

    return story


# ─── Main generator ──────────────────────────────────────────────────────────

CYCLONES = [
    ('Cyclone_Tracy',  build_tracy,  'Cyclone Tracy \u2014 Darwin 1974'),
    ('Cyclone_Larry',  build_larry,  'Cyclone Larry \u2014 Innisfail 2006'),
    ('Cyclone_Althea', build_althea, 'Cyclone Althea \u2014 Townsville 1971'),
    ('Cyclone_George', build_george, 'Cyclone George \u2014 Port Hedland 2007'),
    ('Cyclone_Mahina', build_mahina, 'Cyclone Mahina \u2014 Bathurst Bay 1899'),
    ('Cyclone_Yasi',   build_yasi,   'Cyclone Yasi \u2014 Mission Beach 2011'),
]


def generate_pdf(base, folder, builder, doc_title):
    out_dir = os.path.join(base, 'PDFs')
    os.makedirs(out_dir, exist_ok=True)
    filename = os.path.join(out_dir, f'{folder}.pdf')

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T,
        bottomMargin=MARGIN_B,
        title=doc_title,
        author='Joshua \u2014 Cyclone Archive',
    )

    story = builder(base)
    # Footer line
    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width=USABLE_W, color=SLATE_200, thickness=0.5))
    story.append(Paragraph(
        f'{doc_title}  \u2022  Cyclone Archive  \u2022  \u00a9 2026 Joshua',
        STYLES['footer']))

    doc.build(story, onFirstPage=footer_canvas, onLaterPages=footer_canvas)
    print(f'  [OK] {filename}')
    return filename


def main():
    base = os.path.dirname(os.path.abspath(__file__))
    print('Cyclone Archive \u2014 PDF Generator')
    print('=' * 40)
    pdfs = []
    for folder, builder, title in CYCLONES:
        try:
            pdf = generate_pdf(base, folder, builder, title)
            pdfs.append(pdf)
        except Exception as e:
            print(f'  [FAIL] {folder}: {e}')
            import traceback
            traceback.print_exc()
    print(f'\nDone! {len(pdfs)} PDFs generated in PDFs/ folder.')


if __name__ == '__main__':
    main()
