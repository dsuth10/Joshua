#!/usr/bin/env python3
"""
extract_site_copy.py

Extract all readable text content from one of the mini-websites in
English_Unit_2/ and emit a single structured markdown "copy" document in
the style of Earthquakes/copy_the_trembling_earth.md.

Usage (run from English_Unit_2/ or anywhere):
    python _scripts/extract_site_copy.py cyclones
    python _scripts/extract_site_copy.py bushfires
    python _scripts/extract_site_copy.py floods
    python _scripts/extract_site_copy.py cyclones_easy_read

Heuristic design:
  * Load each HTML page, drop boilerplate (nav, footer, script, style, svg,
    decorative icon spans, buttons, forms, images).
  * Walk main/body content in document order, emitting a flat stream of
    "content blocks" (headings, paragraphs, blockquotes, figures, lists,
    stat-pairs, card-links).
  * Group that stream into editorial sections (HERO, STATS, INTRO, CARDS,
    SECTION N, SIDEBAR-FACT/DATA/POP/QUOTE, PULL, FIGURE, REF, ABOUT) using
    positional + class-name + structural signals.
  * Emit markdown using the same template as the trembling-earth copy doc.

This is a *pragmatic* extractor: it favours completeness over perfect
semantic fidelity. Where the site's HTML doesn't map cleanly to the
editorial labels (e.g. the cyclone story pages have gallery / press /
map sections), those appear as additional numbered sections.
"""

from __future__ import annotations

import re
import sys
from collections import OrderedDict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, List, Optional

from bs4 import BeautifulSoup, NavigableString, Tag


REPO_ROOT = Path(__file__).resolve().parents[1]  # English_Unit_2/


# --------------------------------------------------------------------------- #
# Site configuration                                                          #
# --------------------------------------------------------------------------- #

SITES = {
    "cyclones": {
        "dir": REPO_ROOT / "Cyclones",
        "series_label": "Australian Severe Weather",
        "volume": "Volume II",
        "output_basename": "copy_the_cyclone_archive.md",
        "site_title": "The Cyclone Archive",
        "reading_level": "Upper secondary / first-year undergraduate",
        "editorial_voice": "Immersive long-form; meteorology + community history",
        "pages": [
            ("index.html", "HUB PAGE", "HUB"),
            ("Cyclone_Tracy/index.html", "CYCLONE TRACY", "SUB"),
            ("Cyclone_Tracy/timeline.html", "CYCLONE TRACY — TIMELINE", "SUB"),
            ("Cyclone_Tracy/rebuilding-darwin.html", "CYCLONE TRACY — REBUILDING DARWIN", "SUB"),
            ("Cyclone_Tracy/safety-guide.html", "CYCLONE TRACY — SAFETY GUIDE", "SUB"),
            ("Cyclone_Tracy/historical-cyclones.html", "HISTORICAL CYCLONES", "SUB"),
            ("Cyclone_Althea/index.html", "CYCLONE ALTHEA", "SUB"),
            ("Cyclone_George/index.html", "CYCLONE GEORGE", "SUB"),
            ("Cyclone_Larry/index.html", "CYCLONE LARRY", "SUB"),
            ("Cyclone_Mahina/index.html", "CYCLONE MAHINA", "SUB"),
            ("Cyclone_Yasi/index.html", "CYCLONE YASI", "SUB"),
        ],
    },
    "cyclones_easy_read": {
        "dir": REPO_ROOT / "Cyclones_Easy_Read",
        "series_label": "Big Storms in Australia",
        "volume": "Easy Read Edition",
        "output_basename": "copy_the_cyclone_archive_easy_read.md",
        "site_title": "The Cyclone Archive (Easy Read)",
        "reading_level": "Easy Read / Plain English",
        "editorial_voice": "Short sentences; plain vocabulary; accessible retelling",
        "pages": [
            ("index.html", "HUB PAGE", "HUB"),
            ("Cyclone_Tracy/index.html", "CYCLONE TRACY", "SUB"),
            ("Cyclone_Tracy/timeline.html", "CYCLONE TRACY — TIMELINE", "SUB"),
            ("Cyclone_Tracy/rebuilding-darwin.html", "CYCLONE TRACY — REBUILDING DARWIN", "SUB"),
            ("Cyclone_Tracy/safety-guide.html", "CYCLONE TRACY — SAFETY GUIDE", "SUB"),
            ("Cyclone_Tracy/historical-cyclones.html", "HISTORICAL CYCLONES", "SUB"),
            ("Cyclone_Althea/index.html", "CYCLONE ALTHEA", "SUB"),
            ("Cyclone_George/index.html", "CYCLONE GEORGE", "SUB"),
            ("Cyclone_Larry/index.html", "CYCLONE LARRY", "SUB"),
            ("Cyclone_Mahina/index.html", "CYCLONE MAHINA", "SUB"),
            ("Cyclone_Yasi/index.html", "CYCLONE YASI", "SUB"),
        ],
    },
    "bushfires": {
        "dir": REPO_ROOT / "Bushfires",
        "series_label": "Australian Extreme Weather",
        "volume": "Volume I",
        "output_basename": "copy_the_bushfire_archive.md",
        "site_title": "The Bushfire Archive",
        "reading_level": "Upper secondary / first-year undergraduate",
        "editorial_voice": "Immersive long-form; fire science + Australian history",
        "pages": [
            ("index.html", "HUB PAGE", "HUB"),
            ("Black_Saturday/index.html", "BLACK SATURDAY", "SUB"),
            ("Black_Summer/index.html", "BLACK SUMMER", "SUB"),
            ("Ash_Wednesday/index.html", "ASH WEDNESDAY", "SUB"),
            ("Arsonist_Birds/index.html", "ARSONIST BIRDS", "SUB"),
            ("Elemental_Magic/index.html", "ELEMENTAL MAGIC", "SUB"),
            ("Fire_Science/index.html", "FIRE SCIENCE", "SUB"),
            ("Prevention_Prep/index.html", "PREVENTION & PREPARATION", "SUB"),
            ("The_Frontline/index.html", "THE FRONTLINE", "SUB"),
            ("The_Frontline/aerial-support.html", "THE FRONTLINE — AERIAL SUPPORT", "SUB"),
            ("The_Frontline/backburning.html", "THE FRONTLINE — BACKBURNING", "SUB"),
            ("The_Frontline/satellites-drones.html", "THE FRONTLINE — SATELLITES & DRONES", "SUB"),
        ],
    },
    "floods": {
        "dir": REPO_ROOT / "Floods",
        "series_label": "Australian Severe Weather",
        "volume": "Volume III",
        "output_basename": "copy_when_the_river_rises.md",
        "site_title": "When the River Rises",
        "reading_level": "Upper secondary / first-year undergraduate",
        "editorial_voice": "Narrative hydrology; Queensland-focused flood history",
        "pages": [
            ("index.html", "HUB PAGE", "HUB"),
            ("How_Floods_Work/index.html", "HOW FLOODS WORK", "SUB"),
            ("Brisbane_River_System/index.html", "THE BRISBANE RIVER SYSTEM", "SUB"),
            ("Brisbane_History/index.html", "BRISBANE'S FLOOD HISTORY", "SUB"),
            ("Human_Cost/index.html", "THE HUMAN COST", "SUB"),
            ("The_Future/index.html", "THE FUTURE", "SUB"),
        ],
    },
}


# --------------------------------------------------------------------------- #
# Cleaning helpers                                                            #
# --------------------------------------------------------------------------- #

NOISE_TAGS = {"nav", "script", "style", "svg", "iframe", "form", "button", "template"}
# <footer> is handled separately — some HTML uses it inside <blockquote> for
# citations, which we must preserve.
# Tag names whose text we always drop because they're decorative icons.
ICON_CLASSES = (
    "material-symbols-outlined",
    "material-icons",
    "material-symbols",
)


def strip_noise(soup: BeautifulSoup) -> None:
    """Remove boilerplate / decorative elements in-place."""
    for tag_name in NOISE_TAGS:
        for t in soup.find_all(tag_name):
            t.decompose()

    # Remove site footers ONLY — never blockquote citation footers.
    for f in soup.find_all("footer"):
        if f.find_parent("blockquote"):
            continue
        f.decompose()

    # Remove icon spans (they contain only icon ligature text like "cyclone")
    for span in soup.find_all("span"):
        classes = span.get("class") or []
        if any(c in classes for c in ICON_CLASSES):
            span.decompose()
    # Remove <i> icons too
    for i in soup.find_all("i"):
        classes = i.get("class") or []
        if any(c in classes for c in ICON_CLASSES):
            i.decompose()

    # Remove <img>; we replace them with no content. Their alt text is often redundant.
    for img in soup.find_all("img"):
        img.decompose()

    # Remove <picture> and <source>
    for p in soup.find_all(["picture", "source", "video", "audio", "object", "embed"]):
        p.decompose()

    # Remove lightbox overlays & dialogs (usually have id="lightbox" or role="dialog")
    for el in soup.find_all(True, id=re.compile(r"^(lightbox|lb|modal)", re.I)):
        el.decompose()
    for el in soup.find_all(True, attrs={"role": "dialog"}):
        el.decompose()
    for el in soup.find_all(True, attrs={"aria-hidden": "true"}):
        # Decorative only if it has no meaningful text.
        if not clean_text(el):
            el.decompose()


_WS_RE = re.compile(r"\s+")
_LEADING_NUM_RE = re.compile(r"^\s*\d+[\.\)]\s+")


def clean_text(node) -> str:
    if node is None:
        return ""
    if isinstance(node, NavigableString):
        return _WS_RE.sub(" ", str(node)).strip()
    text = node.get_text(separator=" ", strip=False)
    text = _WS_RE.sub(" ", text).strip()
    return text


def inline_text(node: Tag) -> str:
    """Get text preserving inline emphasis markers (*em*, **strong**)."""
    parts: list[str] = []

    def walk(n):
        if isinstance(n, NavigableString):
            parts.append(str(n))
            return
        tag = n.name
        if tag in ("em", "i"):
            parts.append("*")
            for c in n.children:
                walk(c)
            parts.append("*")
        elif tag in ("strong", "b"):
            parts.append("**")
            for c in n.children:
                walk(c)
            parts.append("**")
        elif tag == "br":
            parts.append(" ")
        elif tag in ("code",):
            parts.append("`")
            for c in n.children:
                walk(c)
            parts.append("`")
        else:
            for c in n.children:
                walk(c)

    for c in node.children:
        walk(c)
    text = "".join(parts)
    text = _WS_RE.sub(" ", text).strip()
    return text


def strip_leading_number(text: str) -> tuple[str, Optional[str]]:
    """Strip a leading "1. " or "2) " from a heading. Return (stripped, marker)."""
    m = _LEADING_NUM_RE.match(text)
    if m:
        return text[m.end():], m.group(0).strip()
    return text, None


# --------------------------------------------------------------------------- #
# Tooltip collection                                                          #
# --------------------------------------------------------------------------- #

def collect_tooltips(soup: BeautifulSoup, glossary: "OrderedDict[str, str]") -> None:
    """Collect `<span data-tooltip="...">term</span>` pairs."""
    for span in soup.find_all(attrs={"data-tooltip": True}):
        term = clean_text(span)
        defn = (span.get("data-tooltip") or "").strip()
        if not term:
            continue
        # Defensive: skip empty tooltip definitions (some are placeholders).
        if not defn:
            continue
        if term.lower() not in glossary:
            glossary[term.lower()] = f"**{term}** — {defn}"


# --------------------------------------------------------------------------- #
# Block classification                                                        #
# --------------------------------------------------------------------------- #

@dataclass
class Block:
    kind: str                 # "hero", "stats", "intro", "cards", "section", "sidebar-fact",
                              # "sidebar-data", "sidebar-pop", "sidebar-quote", "pull",
                              # "figure", "ref", "about", "text"
    data: dict = field(default_factory=dict)


STATS_KEYWORDS_RE = re.compile(r"stats?-strip|stats?-?grid|fast-?facts|key-?facts|data-callout", re.I)
CARDS_KEYWORDS_RE = re.compile(r"card-grid|chapter-grid|cards?-grid|glass-card|chapter-card", re.I)
SIDEBAR_KEYWORDS_RE = re.compile(r"sidebar|fact-box|data-callout|sidebar-pop|sidebar-quote|editorial-sidebar|key-facts|fast-facts|aside", re.I)
REF_KEYWORDS_RE = re.compile(r"reference|citation", re.I)
PULL_KEYWORDS_RE = re.compile(r"pull-quote|blockquote", re.I)
HERO_KEYWORDS_RE = re.compile(r"hero|article-hero|hub-hero", re.I)
NAV_KEYWORDS_RE = re.compile(r"site-nav|main-nav|breadcrumb", re.I)


def classes_of(tag: Tag) -> str:
    return " ".join(tag.get("class") or [])


def has_class_match(tag: Tag, pattern: re.Pattern) -> bool:
    return bool(pattern.search(classes_of(tag)))


def find_content_root(soup: BeautifulSoup) -> Tag:
    body = soup.body or soup
    main = body.find("main")
    if main:
        return main
    return body


def descendant_headings(tag: Tag) -> List[Tag]:
    return tag.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])


def looks_like_stat_pair(child: Tag) -> bool:
    """A stat pair is typically a small div with one very prominent short number and one short caption.

    Heuristic: the "number" side should be a compact token (<= 20 chars, <= 3
    words), either numeric-looking or a short all-caps code. The "label" side
    should be a short caption (<= 15 words). This deliberately *rejects*
    timeline rows like "1899 Cyclone Mahina Bathurst Bay, QLD" which are long.
    """
    ps = [clean_text(p) for p in child.find_all(["p", "div", "span", "strong"], recursive=True)]
    ps = [p for p in ps if p]
    # De-duplicate nested mirrors (common when a wrapper reports combined text).
    seen: set = set()
    uniq: List[str] = []
    for p in ps:
        if p not in seen:
            seen.add(p)
            uniq.append(p)
    if len(uniq) < 2:
        return False
    first, second = uniq[0], uniq[1]
    # Number side must be compact.
    if len(first) > 20 or len(first.split()) > 3:
        return False
    # Label side must be reasonably short.
    if len(second) > 120 or len(second.split()) > 18:
        return False
    # First should look like a stat token: contains a digit, a recognised code,
    # or is an uppercase short word.
    if re.search(r"\d", first):
        return True
    if re.match(r"^(Cat|Mw|ML|Mt|km/h|km|m|hPa)\b", first):
        return True
    if first.isupper() and len(first) <= 10:
        return True
    # "Cat 5" / "Mw 9.1" style handled by regex above.
    return False


def extract_stat_pair(child: Tag) -> Optional[dict]:
    # Find the two most prominent pieces of text in the child.
    # Heuristic: first node with short text + numeric/uppercase, then the second prominent node.
    texts: List[tuple[Tag, str]] = []
    for t in child.find_all(["p", "div", "span", "strong", "h1", "h2", "h3", "h4"]):
        txt = clean_text(t)
        if txt and len(txt.split()) <= 30:
            texts.append((t, txt))
    if not texts:
        return None
    # Prefer shorter, numeric/uppercase as number; longer as label
    # Dedup duplicates that reflect nested elements with same text
    seen = set()
    uniq: List[str] = []
    for _, t in texts:
        if t not in seen:
            seen.add(t)
            uniq.append(t)
    if len(uniq) < 2:
        return None
    number, label = uniq[0], uniq[1]
    if len(number) > 60:
        return None
    return {"number": number, "label": label}


def detect_stats_container(tag: Tag) -> Optional[List[dict]]:
    """If tag looks like a stats-grid (>=3 stat pairs in a grid), return list of pairs."""
    # Direct children of the tag that are likely "stat-item" elements
    candidates = [c for c in tag.find_all(recursive=False) if isinstance(c, Tag)]
    # If wrapped in a container div, drill in once
    while len(candidates) == 1 and candidates[0].name in ("div", "section", "header"):
        candidates = [c for c in candidates[0].find_all(recursive=False) if isinstance(c, Tag)]
    stat_like = [c for c in candidates if looks_like_stat_pair(c)]
    if len(stat_like) >= 3:
        return [s for s in (extract_stat_pair(c) for c in stat_like) if s]
    # Also try a shallow search for a grid with stat items
    grids = tag.find_all("div", class_=re.compile(r"\bgrid\b", re.I), limit=3)
    for g in grids:
        kids = [c for c in g.find_all(recursive=False) if isinstance(c, Tag)]
        stat_like = [c for c in kids if looks_like_stat_pair(c)]
        if len(stat_like) >= 3:
            return [s for s in (extract_stat_pair(c) for c in stat_like) if s]
    return None


def detect_card_grid(tag: Tag) -> Optional[List[dict]]:
    """A grid of cards: each card is a link containing an h3 and some teaser text."""
    # Find a container with multiple <a> children, each of which contains an h3.
    containers = [tag] + tag.find_all(["div", "section"], recursive=True)
    for c in containers:
        direct_kids = [k for k in c.find_all(recursive=False) if isinstance(k, Tag)]
        link_cards = [k for k in direct_kids if k.name == "a" and k.find(["h2", "h3", "h4"])]
        if len(link_cards) >= 2:
            cards = []
            for lc in link_cards:
                cards.append(extract_card(lc))
            return cards
    return None


def extract_card(anchor: Tag) -> dict:
    """Extract a card's eyebrow / title / teaser / meta / data strip."""
    heading = anchor.find(["h2", "h3", "h4"])
    title = inline_text(heading) if heading else ""
    # Eyebrow labels: collect ALL short small-caps / tag / uppercase labels that
    # appear before the heading inside the card, and concatenate with " · ".
    eyebrows: List[str] = []
    seen_eyebrows: set = set()
    if heading:
        for sib in heading.find_all_previous(["div", "span", "p"], limit=20):
            # Only consider elements that are still within this anchor.
            if not any(anc is anchor for anc in sib.parents):
                continue
            txt = clean_text(sib)
            if not txt or len(txt) > 100 or txt in seen_eyebrows:
                continue
            # Skip elements whose text is actually a concatenation of a child's text.
            if any(clean_text(c) == txt and c is not sib for c in sib.find_all(True)):
                continue
            classes = classes_of(sib).lower()
            is_label = (
                "eyebrow" in classes
                or "tracking-" in classes
                or "uppercase" in classes
                or "tag" in classes
                or "card-tag" in classes
                or (sib.name == "span" and len(txt.split()) <= 8)
                or (sib.name == "p" and len(txt) < 60 and (txt.isupper() or "uppercase" in classes))
            )
            if is_label:
                eyebrows.insert(0, txt)  # Maintain document order.
                seen_eyebrows.add(txt)
    eyebrow = " · ".join(dict.fromkeys(eyebrows))  # de-dup while preserving order
    # teaser: first <p> under the anchor after the heading
    teaser = ""
    if heading:
        p = heading.find_next("p")
        if p and p in anchor.descendants:
            teaser = inline_text(p)
    if not teaser:
        ps = anchor.find_all("p")
        if ps:
            teaser = inline_text(ps[0])
    # Any "read time" / footer meta with duration
    meta = ""
    for span in anchor.find_all(["span", "p", "div"]):
        txt = clean_text(span)
        if re.search(r"\d+\s*min\s*read|read time|\d+\s*Min", txt, re.I):
            meta = txt
            break
    # Data strip: numbers + labels pairs at the card foot (cyclones have peak winds / fatalities / damage)
    data_strip = []
    for g in anchor.find_all("div", class_=re.compile(r"grid", re.I)):
        kids = [k for k in g.find_all(recursive=False) if isinstance(k, Tag)]
        pairs = []
        for k in kids:
            ps = [clean_text(p) for p in k.find_all(["p", "span"]) if clean_text(p)]
            if len(ps) >= 2:
                pairs.append((ps[1] if len(ps[0]) <= 30 and re.search(r"[a-zA-Z]", ps[0]) and not re.search(r"\d", ps[0]) else ps[0],
                              ps[0] if len(ps[0]) <= 30 and re.search(r"[a-zA-Z]", ps[0]) and not re.search(r"\d", ps[0]) else ps[1]))
        if len(pairs) >= 2:
            # Normalise: put label first (short text), then value (with number)
            norm = []
            for a, b in pairs:
                # Detect which has a digit → value
                if re.search(r"\d", a) and not re.search(r"\d", b):
                    label, value = b, a
                else:
                    label, value = a, b
                norm.append({"label": label, "value": value})
            data_strip = norm
            break
    return {
        "eyebrow": eyebrow,
        "title": title,
        "teaser": teaser,
        "meta": meta,
        "data_strip": data_strip,
        "href": anchor.get("href", ""),
    }


# --------------------------------------------------------------------------- #
# Page walker                                                                 #
# --------------------------------------------------------------------------- #

def find_hero(root: Tag) -> Optional[Tag]:
    """Find the first element that looks like a hero: contains an h1."""
    for el in root.find_all(["header", "section", "div"], limit=20):
        if el.find("h1") and not has_class_match(el, NAV_KEYWORDS_RE):
            return el
    return None


def extract_hero(hero: Tag) -> dict:
    """Extract eyebrow / h1 / deck / read-time."""
    h1 = hero.find("h1")
    title = inline_text(h1) if h1 else ""
    eyebrow = ""
    deck = ""
    read_time = ""
    breadcrumb = ""
    # Find eyebrow: anything before h1 with short text
    for sib in hero.find_all(["div", "span", "p"]):
        if not h1 or sib in h1.descendants:
            continue
        if hasattr(h1, "find_previous") and sib not in list(h1.find_all_previous()):
            continue
        txt = clean_text(sib)
        if not txt or len(txt) > 120:
            continue
        classes = classes_of(sib).lower()
        if "breadcrumb" in classes:
            breadcrumb = txt
            continue
        if "eyebrow" in classes or "tracking-" in classes or "uppercase" in classes or "tag" in classes:
            if not eyebrow:
                eyebrow = txt
            continue
    # Find deck: first <p> after h1
    if h1:
        p = h1.find_next("p")
        if p and p in hero.descendants:
            deck = inline_text(p)
    # Read time: search for "N min read"
    text_all = clean_text(hero)
    m = re.search(r"(\d+\s*min\s*read|\d+\s*Min\s*Read)", text_all, re.I)
    if m:
        read_time = m.group(1).strip().lower()
    # Breadcrumb may also be contained in an ancestor
    if not breadcrumb:
        bc = hero.find(attrs={"class": re.compile(r"breadcrumb", re.I)})
        if bc:
            breadcrumb = clean_text(bc)
    return {
        "eyebrow": eyebrow,
        "title": title,
        "deck": deck,
        "read_time": read_time,
        "breadcrumb": breadcrumb,
    }


def extract_fact_box_items(tag: Tag) -> dict:
    h = tag.find(["h2", "h3", "h4", "h5"])
    heading = inline_text(h) if h else ""
    ul = tag.find(["ul", "ol"])
    items: List[str] = []
    if ul:
        for li in ul.find_all("li", recursive=False):
            items.append(inline_text(li))
    # Fallback: paragraphs
    if not items:
        for p in tag.find_all("p"):
            txt = inline_text(p)
            if txt and txt != heading:
                items.append(txt)
    return {"heading": heading, "items": items}


def extract_sidebar_pop(tag: Tag) -> dict:
    """Extract a "case study" sidebar — eyebrow, h4, paragraphs, data strip."""
    eyebrow = ""
    eb = tag.find(attrs={"class": re.compile(r"eyebrow|pop-eyebrow|tracking-", re.I)})
    if eb:
        eyebrow = clean_text(eb)
    h = tag.find(["h2", "h3", "h4"])
    heading = inline_text(h) if h else ""
    paragraphs = [inline_text(p) for p in tag.find_all("p") if inline_text(p) and inline_text(p) != eyebrow]
    data_line = ""
    dl = tag.find(attrs={"class": re.compile(r"pop-data|callout-data", re.I)})
    if dl:
        data_line = clean_text(dl)
    return {
        "eyebrow": eyebrow,
        "heading": heading,
        "paragraphs": paragraphs,
        "data": data_line,
    }


def extract_data_callout(tag: Tag) -> dict:
    # Find biggest / first prominent number and the caption after it
    num = ""
    label = ""
    for el in tag.find_all(["div", "p", "span", "h3", "h4"]):
        txt = clean_text(el)
        if not txt:
            continue
        classes = classes_of(el).lower()
        if not num and ("stat-number" in classes or ("text-" in classes and re.search(r"\d", txt))
                        or (len(txt) < 20 and re.search(r"[\d]", txt))):
            num = txt
        elif num and not label and "stat-label" in classes:
            label = txt
    if not num:
        # Fall back: first <p> or <div>
        children = [clean_text(c) for c in tag.find_all(["p", "div", "h3", "h4"]) if clean_text(c)]
        if children:
            num = children[0]
            if len(children) > 1:
                label = children[1]
    return {"number": num, "label": label}


def extract_blockquote(tag: Tag) -> dict:
    # quote content
    # Ignore children that are a <footer> (citation)
    footer = tag.find("footer")
    attribution = clean_text(footer) if footer else ""
    if footer:
        footer.extract()
    quote = inline_text(tag).strip().strip("“”\"' ")
    # Some sites put citation via <cite>
    cite = tag.find("cite")
    if cite and not attribution:
        attribution = inline_text(cite)
    # Normalise: some citation footers include a leading em-dash that we add
    # ourselves at render time — strip any leading dash / whitespace.
    attribution = re.sub(r"^[\s\u2014\u2013\-]+", "", attribution).strip()
    return {"quote": quote, "attribution": attribution}


def extract_references(tag: Tag) -> List[str]:
    out = []
    ol = tag.find("ol")
    if ol:
        for li in ol.find_all("li", recursive=False):
            out.append(inline_text(li))
    else:
        for li in tag.find_all("li"):
            out.append(inline_text(li))
    return out


# --------------------------------------------------------------------------- #
# Page-level extraction                                                       #
# --------------------------------------------------------------------------- #

def extract_page_blocks(html_path: Path, page_kind: str, glossary: "OrderedDict[str, str]") -> List[Block]:
    """Return an ordered list of content Blocks for this HTML page."""
    raw = html_path.read_text(encoding="utf-8", errors="replace")
    soup = BeautifulSoup(raw, "html.parser")
    collect_tooltips(soup, glossary)
    strip_noise(soup)
    body = soup.body or soup

    blocks: List[Block] = []

    # 1. HERO — first header/section with h1.
    hero = find_hero(body)
    if hero:
        hero_data = extract_hero(hero)
        if hero_data["title"] or hero_data["deck"]:
            blocks.append(Block("hero", hero_data))
        # Remove the hero from DOM so later passes don't reprocess it.
        hero.extract()

    # 2. STATS strip — search for a container with class matching stats-strip, or a grid of stat pairs.
    for el in body.find_all(["section", "div"]):
        if not el.parent:
            continue  # already removed
        cls = classes_of(el)
        if STATS_KEYWORDS_RE.search(cls) and el.name == "section":
            stats = detect_stats_container(el)
            if stats:
                blocks.append(Block("stats", {"items": stats, "label": _nearby_label(el)}))
                el.extract()
                break
    else:
        # Also try: any <section> near the top that holds a grid of 3+ stat pairs.
        main_root = body.find("main") or body
        for el in list(main_root.find_all(["section", "div"], recursive=False))[:3]:
            stats = detect_stats_container(el)
            if stats:
                blocks.append(Block("stats", {"items": stats, "label": _nearby_label(el)}))
                el.extract()
                break

    # 3. Now walk remaining top-level children of main/body in order.
    content_root = body.find("main") or body
    for child in list(content_root.children):
        if not isinstance(child, Tag):
            continue
        _classify_and_emit(child, blocks, page_kind)

    return blocks


def _nearby_label(el: Tag) -> str:
    """If a section has a preceding small-label heading, return it."""
    prev = el.find_previous(["h2", "h3"])
    if prev:
        return inline_text(prev)
    return ""


def _classify_and_emit(child: Tag, blocks: List[Block], page_kind: str) -> None:
    """Classify a top-level content child and append one or more Blocks."""
    if not child.name:
        return

    cls = classes_of(child)

    # 0. Skip empty children
    if not clean_text(child):
        return

    # 1. Card grid
    cards = detect_card_grid(child)
    if cards and len(cards) >= 2 and any(c.get("title") for c in cards):
        blocks.append(Block("cards", {"cards": cards, "heading": _preceding_heading(child)}))
        return

    # 2. References — only when THIS element's OWN class marks it as a
    # references container. We deliberately do NOT descend to look for a
    # nested "References" heading: article bodies that end with an inline
    # references sub-section are handled by _emit_article_content instead.
    if REF_KEYWORDS_RE.search(cls):
        refs = extract_references(child)
        if refs:
            blocks.append(Block("ref", {"items": refs}))
            return

    # 3. Aside / sidebar
    if child.name == "aside" or SIDEBAR_KEYWORDS_RE.search(cls):
        _emit_sidebar(child, blocks)
        return

    # 4. Figure
    if child.name == "figure":
        _emit_figure(child, blocks)
        return

    # 5. Blockquote / pull-quote
    if child.name == "blockquote" or PULL_KEYWORDS_RE.search(cls):
        bq = extract_blockquote(child)
        if bq["quote"]:
            blocks.append(Block("pull", bq))
        return

    # 6. About section: h4 "About ..." heading
    h4s = child.find_all(["h4"])
    if h4s and any(re.search(r"\bAbout\b", inline_text(h), re.I) for h in h4s):
        _emit_about(child, blocks)
        return

    # 7. Article body / section: descend into sub-elements
    if child.name in ("article", "section", "div", "header", "main"):
        # Check for nested article/section with distinct headings
        _emit_article_content(child, blocks)
        return


def _preceding_heading(el: Tag) -> str:
    prev = el.find_previous(["h2", "h3"])
    if prev:
        return inline_text(prev)
    return ""


def _emit_sidebar(container: Tag, blocks: List[Block]) -> None:
    """Detect and emit one or more sidebar sub-blocks (fact-box, data-callout, sidebar-pop, sidebar-quote)."""
    # Walk descendants looking for specific sub-boxes.
    any_emitted = False
    for sub in container.find_all(["div", "section", "article", "aside"], recursive=True):
        cls = classes_of(sub).lower()
        if "fact-box" in cls or "fast-facts" in cls or "key-facts" in cls:
            fb = extract_fact_box_items(sub)
            if fb["heading"] or fb["items"]:
                blocks.append(Block("sidebar-fact", fb))
                any_emitted = True
        elif "data-callout" in cls:
            dc = extract_data_callout(sub)
            if dc["number"]:
                blocks.append(Block("sidebar-data", dc))
                any_emitted = True
        elif "sidebar-pop" in cls:
            sp = extract_sidebar_pop(sub)
            if sp["heading"]:
                blocks.append(Block("sidebar-pop", sp))
                any_emitted = True
    if any_emitted:
        return

    # If no structured children, treat the whole aside as one fact-box style block.
    # But avoid the "timeline" / "share" navigation patterns.
    # Try to split by h3/h4 internal sub-sections.
    headings = container.find_all(["h2", "h3", "h4"])
    if headings:
        for h in headings:
            # Extract heading + following paragraphs/list items until next heading
            items: List[str] = []
            for sib in h.find_next_siblings():
                if sib.name in ("h2", "h3", "h4"):
                    break
                if sib.name == "ul" or sib.name == "ol":
                    for li in sib.find_all("li"):
                        items.append(inline_text(li))
                elif sib.name == "p":
                    txt = inline_text(sib)
                    if txt:
                        items.append(txt)
            blocks.append(Block("sidebar-fact", {"heading": inline_text(h), "items": items}))
    else:
        # Treat as a quote-style sidebar if contains a blockquote, else a generic fact box
        bq = container.find("blockquote")
        if bq:
            q = extract_blockquote(bq)
            if q["quote"]:
                blocks.append(Block("sidebar-quote", q))
                return
        # Fallback: emit paragraphs as a fact-list
        items = [inline_text(p) for p in container.find_all("p") if inline_text(p)]
        if items:
            blocks.append(Block("sidebar-fact", {"heading": "", "items": items}))


def _emit_figure(fig: Tag, blocks: List[Block]) -> None:
    cap = fig.find("figcaption")
    if cap:
        blocks.append(Block("figure", {"caption": inline_text(cap)}))


def _emit_about(container: Tag, blocks: List[Block]) -> None:
    items = []
    heading_primary = ""
    for h in container.find_all(["h3", "h4"]):
        label = inline_text(h)
        # Collect following <p> text or <ul>
        bodies: List[str] = []
        sib = h.next_sibling
        while sib is not None:
            if isinstance(sib, Tag):
                if sib.name in ("h2", "h3", "h4"):
                    break
                if sib.name == "p":
                    t = inline_text(sib)
                    if t:
                        bodies.append(t)
                if sib.name in ("ul", "ol"):
                    for li in sib.find_all("li", recursive=False):
                        t = inline_text(li)
                        if t:
                            bodies.append("- " + t)
            sib = sib.next_sibling
        if not heading_primary and re.search(r"About", label, re.I):
            heading_primary = label
        items.append({"heading": label, "bodies": bodies})
    if items:
        blocks.append(Block("about", {"heading": heading_primary or "About This Archive", "items": items}))


def _emit_article_content(container: Tag, blocks: List[Block]) -> None:
    """Walk a content region producing section blocks keyed off h2 headings.

    A section is [h2] + following paragraphs, blockquotes (as [PULL]), figures,
    lists — up to the next h2 (or end). Content before the first h2 becomes
    an [INTRO] block emitted immediately (before any sections).
    """
    # We want to traverse ALL descendants in document order, handling sub-asides
    # that are interleaved with the article body.
    current_section: Optional[dict] = None
    intro_text: List[str] = []
    intro_flushed = False
    seen_sections = False

    def maybe_flush_intro():
        nonlocal intro_flushed
        if intro_flushed:
            return
        if intro_text:
            blocks.append(Block("intro", {"paragraphs": list(intro_text)}))
        intro_flushed = True

    def flush_section():
        nonlocal current_section
        if current_section and (current_section["body"] or current_section["heading"]):
            blocks.append(Block("section", current_section))
        current_section = None

    # Iterate descendants but skip anything we've already consumed (hero, stats, ref, aside handled elsewhere).
    # We treat <aside>, references, and figure specially.
    for el in container.descendants:
        if not isinstance(el, Tag):
            continue
        # If we hit a nav, skip subtree.
        name = el.name
        cls = classes_of(el)

        if name in ("nav", "footer", "script", "style", "svg", "form", "button", "iframe"):
            continue
        # An <aside> interleaved with the article body — flush the current
        # section and emit sidebar sub-blocks inline at the point they appear.
        if name == "aside":
            flush_section()
            _emit_sidebar(el, blocks)
            continue
        # Skip elements whose ancestor is an <aside> (handled above as a whole).
        if el.find_parent("aside"):
            continue
        # Skip elements that are inside a <blockquote> (we process blockquotes as a unit)
        if el.find_parent("blockquote") and name != "blockquote":
            continue
        # Skip if inside a <figure> (we process figure as a unit)
        if el.find_parent("figure") and name != "figure":
            continue
        # Skip inside an <a> card grid (handled separately as cards)
        # But for cyclone story pages, there are no card grids in main, so this is safe.
        if el.find_parent("a") and el.find_parent("a").find(["h2", "h3"]) and el.find_parent("a").get("href") and "index.html" in (el.find_parent("a").get("href") or "") and name in ("h2", "h3", "p"):
            # That <a> is a card; skip for now. (We'd have detected it at top level otherwise.)
            continue

        if name == "h1":
            # Already consumed as hero; skip.
            continue
        if name == "h2":
            # Might be "References"; handled at the top-level classifier, but if it slipped through:
            txt = inline_text(el)
            if re.search(r"^\s*References?\s*$", txt, re.I):
                # Find the next ol and extract
                ol = el.find_next("ol")
                if ol:
                    refs = [inline_text(li) for li in ol.find_all("li", recursive=False)]
                    refs = [r for r in refs if r]
                    if refs:
                        flush_section()
                        blocks.append(Block("ref", {"items": refs}))
                        # Continue past the ol
                continue
            # New section — first, flush any pre-section intro text.
            maybe_flush_intro()
            flush_section()
            title_raw, _ = strip_leading_number(txt)
            current_section = {"heading": title_raw, "raw_heading": txt, "body": []}
            seen_sections = True
            continue

        if name == "h3" or name == "h4":
            # Subheading inside a section. Emit as small header inside body.
            txt = inline_text(el)
            if not txt:
                continue
            if current_section:
                current_section["body"].append(("h3", txt))
            else:
                intro_text.append(f"**{txt}**")
            continue

        if name == "p":
            txt = inline_text(el)
            if not txt:
                continue
            if current_section:
                current_section["body"].append(("p", txt))
            else:
                intro_text.append(txt)
            continue

        if name == "blockquote":
            bq = extract_blockquote(el)
            if not bq["quote"]:
                continue
            if current_section:
                current_section["body"].append(("quote", bq))
            else:
                maybe_flush_intro()
                blocks.append(Block("pull", bq))
            continue

        if name == "figure":
            cap = el.find("figcaption")
            if cap:
                caption = inline_text(cap)
                if current_section:
                    current_section["body"].append(("figure", caption))
                else:
                    blocks.append(Block("figure", {"caption": caption}))
            continue

        if name in ("ul", "ol"):
            # Skip if this list is inside something else we already handle.
            if el.find_parent(["blockquote", "figure", "aside"]):
                continue
            items = [inline_text(li) for li in el.find_all("li", recursive=False)]
            items = [i for i in items if i]
            if not items:
                continue
            if current_section:
                current_section["body"].append(("list", items))
            else:
                for i in items:
                    intro_text.append("- " + i)
            continue

    flush_section()
    # If we never encountered an h2, emit the intro paragraphs now (these are
    # effectively the whole article body).
    maybe_flush_intro()


# --------------------------------------------------------------------------- #
# Markdown rendering                                                          #
# --------------------------------------------------------------------------- #

def render_markdown(site_key: str, config: dict) -> str:
    out: List[str] = []
    glossary: "OrderedDict[str, str]" = OrderedDict()
    all_pages: List[tuple[str, str, str, List[Block]]] = []  # (rel_path, display_title, kind, blocks)

    site_dir: Path = config["dir"]
    for rel, title, kind in config["pages"]:
        path = site_dir / rel
        if not path.exists():
            print(f"[warn] missing: {path}", file=sys.stderr)
            continue
        blocks = extract_page_blocks(path, kind, glossary)
        all_pages.append((rel, title, kind, blocks))

    # --- Document header ------------------------------------------------
    title = config["site_title"]
    out.append(f"# {title} — Full Website Copy\n")
    out.append(f"**{config['series_label']} — {config['volume']}**  ")
    out.append(f"**Target reading level:** {config['reading_level']}  ")
    out.append(f"**Editorial voice:** {config['editorial_voice']}  ")
    num_pages = len(all_pages)
    out.append(f"**Structure:** 1 hub page + {num_pages - 1} sub-page{'s' if num_pages != 2 else ''}  ")
    out.append("**Extracted from published HTML via `_scripts/extract_site_copy.py`**\n")
    out.append("---\n")

    # --- Placement key --------------------------------------------------
    out.append("## PLACEMENT KEY\n")
    out.extend([
        "- `[HUB]` = Hub/index page",
        "- `[SUB-PAGE N]` = Sub-page number",
        "- `[HERO]` = Hero/header section",
        "- `[STATS]` = Stats strip",
        "- `[INTRO]` = Editorial introduction paragraphs",
        "- `[CARD]` = Chapter/story card teaser",
        "- `[DECK]` = Article deck (sub-headline below h1)",
        "- `[SECTION]` = Numbered article body section",
        "- `[PULL]` = Pull-quote (inline breakout)",
        "- `[FIGURE]` = Figure / image caption",
        "- `[SIDEBAR-FACT]` = Sidebar fact-box",
        "- `[SIDEBAR-DATA]` = Sidebar data callout (large number)",
        "- `[SIDEBAR-QUOTE]` = Sidebar expert-quote card",
        "- `[SIDEBAR-POP]` = Historical pop-out / case-study callout",
        "- `[REF]` = Reference list item",
        "- `[ABOUT]` = About / series colophon section\n",
    ])
    out.append("---\n---\n")

    # --- Per-page content ----------------------------------------------
    for idx, (rel, display_title, kind, blocks) in enumerate(all_pages):
        page_no = idx + 1
        page_label = "HUB PAGE" if kind == "HUB" else f"SUB-PAGE {page_no}"
        out.append(f"# PAGE {page_no}: {display_title}\n")
        out.append(f"`Page: {rel}`\n")
        out.append("---\n")

        prefix = "[HUB]" if kind == "HUB" else f"[SUB-PAGE {page_no}]"
        section_counter = 0
        card_counter = 0
        sidebars: List[Block] = []   # Buffer sidebars to emit as a group at the end.
        references_block: Optional[Block] = None

        for b in blocks:
            if b.kind == "hero":
                out.append(f"## {prefix}[HERO]\n")
                h = b.data
                if h.get("breadcrumb"):
                    out.append(f"**Breadcrumb:** {h['breadcrumb']}\n")
                if h.get("eyebrow"):
                    out.append(f"**Eyebrow label:** {h['eyebrow']}\n")
                if h.get("title"):
                    out.append(f"**H1:** {h['title']}\n")
                if h.get("deck"):
                    out.append(f"**[DECK]:** {h['deck']}\n")
                if h.get("read_time"):
                    out.append(f"**Read time:** {h['read_time']}\n")
                out.append("---\n")

            elif b.kind == "stats":
                out.append(f"## {prefix}[STATS]\n")
                for i, s in enumerate(b.data.get("items", []), 1):
                    out.append(f"**Stat {i}:**  ")
                    out.append(f"`{s['number']}`  ")
                    out.append(f"{s['label']}\n")
                out.append("---\n")

            elif b.kind == "intro":
                paras = b.data.get("paragraphs") or []
                # Suppress near-empty intro blocks (single label-like line).
                total_chars = sum(len(p) for p in paras)
                has_prose = any(
                    len(p.split()) >= 8 and not (p.startswith("**") and p.endswith("**"))
                    for p in paras
                )
                if paras and (has_prose or total_chars > 200):
                    out.append(f"## {prefix}[INTRO]\n")
                    for p in paras:
                        out.append(p + "\n")
                    out.append("---\n")

            elif b.kind == "cards":
                out.append(f"## {prefix} Chapter / Story Cards\n")
                heading = b.data.get("heading")
                if heading:
                    out.append(f"**H2:** {heading}\n")
                for card in b.data["cards"]:
                    card_counter += 1
                    out.append(f"### [CARD {card_counter}]")
                    if card.get("eyebrow"):
                        out.append(f"**Eyebrow:** {card['eyebrow']}")
                    if card.get("title"):
                        out.append(f"**H3:** {card['title']}")
                    if card.get("teaser"):
                        out.append(f"**Teaser:** {card['teaser']}")
                    if card.get("meta"):
                        out.append(f"**Meta:** {card['meta']}")
                    if card.get("data_strip"):
                        out.append("**Data strip:**")
                        for ds in card["data_strip"]:
                            out.append(f"- `{ds['value']}` — {ds['label']}")
                    if card.get("href"):
                        out.append(f"**Link:** `{card['href']}`")
                    out.append("")
                out.append("---\n")

            elif b.kind == "section":
                section_counter += 1
                out.append(f"## {prefix}[SECTION {section_counter}]\n")
                raw = b.data.get("raw_heading") or b.data.get("heading") or ""
                if raw:
                    out.append(f"**H2:** {raw}\n")
                for kind_i, payload in b.data["body"]:
                    if kind_i == "p":
                        out.append(payload + "\n")
                    elif kind_i == "h3":
                        out.append(f"**H3:** {payload}\n")
                    elif kind_i == "quote":
                        q = payload["quote"]
                        attr = payload.get("attribution") or ""
                        out.append(f"> **[PULL]** {q}")
                        if attr:
                            out.append(f"> — {attr}")
                        out.append("")
                    elif kind_i == "figure":
                        out.append(f"**[FIGURE caption]:** {payload}\n")
                    elif kind_i == "list":
                        for li in payload:
                            out.append(f"- {li}")
                        out.append("")
                out.append("---\n")

            elif b.kind == "pull":
                q = b.data["quote"]
                attr = b.data.get("attribution") or ""
                out.append(f"### {prefix}[PULL]\n")
                out.append(f"> {q}")
                if attr:
                    out.append(f"> — {attr}")
                out.append("\n---\n")

            elif b.kind == "figure":
                out.append(f"### {prefix}[FIGURE]\n")
                out.append(f"**Caption:** {b.data['caption']}\n")
                out.append("---\n")

            elif b.kind in ("sidebar-fact", "sidebar-data", "sidebar-pop", "sidebar-quote"):
                sidebars.append(b)

            elif b.kind == "ref":
                references_block = b

            elif b.kind == "about":
                out.append(f"## {prefix} About Section\n")
                items = b.data.get("items", [])
                for it in items:
                    out.append(f"**H4:** {it['heading']}")
                    for body in it["bodies"]:
                        out.append(body)
                    out.append("")
                out.append("---\n")

        # Emit grouped sidebars for this page
        if sidebars:
            out.append(f"## {prefix} SIDEBAR ELEMENTS\n")
            for sb in sidebars:
                if sb.kind == "sidebar-fact":
                    out.append("### [SIDEBAR-FACT]")
                    if sb.data.get("heading"):
                        out.append(f"**H4:** {sb.data['heading']}")
                    for item in sb.data.get("items", []):
                        out.append(f"- {item}")
                    out.append("")
                elif sb.kind == "sidebar-data":
                    out.append("### [SIDEBAR-DATA]")
                    out.append(f"**Large number:** {sb.data.get('number', '')}")
                    if sb.data.get("label"):
                        out.append(f"**Label:** {sb.data['label']}")
                    out.append("")
                elif sb.kind == "sidebar-pop":
                    out.append("### [SIDEBAR-POP]")
                    if sb.data.get("eyebrow"):
                        out.append(f"**Eyebrow label:** {sb.data['eyebrow']}")
                    if sb.data.get("heading"):
                        out.append(f"**H4:** {sb.data['heading']}")
                    for para in sb.data.get("paragraphs", []):
                        out.append(para)
                    if sb.data.get("data"):
                        out.append(f"**Data callout inside pop-out:** `{sb.data['data']}`")
                    out.append("")
                elif sb.kind == "sidebar-quote":
                    out.append("### [SIDEBAR-QUOTE]")
                    out.append(f"**Quote:** \"{sb.data.get('quote', '')}\"")
                    if sb.data.get("attribution"):
                        out.append(f"**Attribution:** {sb.data['attribution']}")
                    out.append("")
            out.append("---\n")

        # Emit references block if present
        if references_block:
            out.append(f"## {prefix}[REF]\n")
            for i, ref in enumerate(references_block.data.get("items", []), 1):
                out.append(f"{i}. {ref}")
            out.append("\n---\n")

        out.append("---\n")

    # --- Glossary / tooltip terms --------------------------------------
    if glossary:
        out.append("# GLOSSARY — Tooltip Terms\n")
        out.append("| Term | Definition |")
        out.append("|------|-----------|")
        for lower, line in glossary.items():
            # Split at " — " once
            term_part, _, defn = line.partition(" — ")
            term = term_part.lstrip("*").rstrip("*").strip()
            out.append(f"| {term} | {defn} |")
        out.append("")
        out.append("---\n")

    # --- Word count -----------------------------------------------------
    body_words = sum(len(line.split()) for line in out if not line.startswith("#"))
    out.append(f"*End of copy document — {title}*")
    out.append(f"*Total approximate word count (body copy only): ~{body_words:,} words*")
    out.append(f"*Prepared for: {config['series_label']} — {config['volume']}*")
    out.append("")

    return "\n".join(out)


# --------------------------------------------------------------------------- #
# CLI                                                                         #
# --------------------------------------------------------------------------- #

def main(argv: List[str]) -> int:
    if len(argv) < 2:
        print(f"usage: {argv[0]} {{{'|'.join(SITES)}}}", file=sys.stderr)
        return 2
    key = argv[1].lower()
    if key == "all":
        targets = list(SITES.keys())
    elif key in SITES:
        targets = [key]
    else:
        print(f"unknown site: {key}; choose from {list(SITES)}", file=sys.stderr)
        return 2

    for k in targets:
        cfg = SITES[k]
        md = render_markdown(k, cfg)
        out_path = cfg["dir"] / cfg["output_basename"]
        out_path.write_text(md, encoding="utf-8")
        print(f"wrote {out_path} ({len(md):,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
