"""
Universal Spelfabet Sound Extractor

This script can extract word lists for ANY sound from Spelfabet.
Usage: python extract_sound.py <sound_name>
Example: python extract_sound.py sh
"""

import sys
import requests
from bs4 import BeautifulSoup
import re
from collections import defaultdict

# Mapping of sounds to their Spelfabet URL patterns
SOUND_URLS = {
    'sh': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/sh/',
    's': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/s/',
    'j': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/j/',
    'g': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/g/',
    'ay': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/ay/',
    'ee': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/ee/',
    'oh': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/oh/',
    'i': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/i/',
}

def get_spelling_variations(sound_url):
    """
    Get all spelling variation pages for a given sound.
    Returns a dict of {spelling_pattern: url}
    """
    try:
        response = requests.get(sound_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        variations = {}
        
        # Find all links that are spelling variations
        for link in soup.find_all('a', href=True):
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            # Look for links that contain the sound pattern
            if '/sorted-by-sound/' in href and href != sound_url:
                # Extract the spelling pattern from the URL
                pattern = href.split('/')[-2] if href.endswith('/') else href.split('/')[-1]
                variations[pattern] = href if href.startswith('http') else f"https://www.spelfabet.com.au{href}"
        
        return variations
    
    except Exception as e:
        print(f"Error getting variations: {e}")
        return {}

def extract_words_from_table(soup):
    """Extract words from table cells."""
    words = []
    
    # Look for table cells
    for cell in soup.find_all(['td', 'th']):
        text = cell.get_text(strip=True)
        if text and len(text) > 1 and len(text) < 30:
            # Clean and validate
            clean_word = re.sub(r'[^\w\s-]', '', text)
            if clean_word and clean_word[0].isalpha():
                words.append(clean_word)
    
    return words

def extract_words_from_page(url):
    """Extract all words from a Spelfabet page."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        words = extract_words_from_table(soup)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_words = []
        for word in words:
            if word.lower() not in seen and word.lower() not in ['level', 'column', 'row']:
                seen.add(word.lower())
                unique_words.append(word)
        
        return unique_words
    
    except Exception as e:
        print(f"Error extracting from {url}: {e}")
        return []

def main():
    if len(sys.argv) < 2:
        print("Usage: python extract_sound.py <sound>")
        print(f"Available sounds: {', '.join(SOUND_URLS.keys())}")
        sys.exit(1)
    
    sound = sys.argv[1].lower()
    
    if sound not in SOUND_URLS:
        print(f"Unknown sound '{sound}'. Available: {', '.join(SOUND_URLS.keys())}")
        sys.exit(1)
    
    print(f"\\nExtracting words for /{sound}/ sound...")
    print(f"Main page: {SOUND_URLS[sound]}")
    
    # Get spelling variations
    print("\\nFinding spelling variations...")
    variations = get_spelling_variations(SOUND_URLS[sound])
    
    if not variations:
        print("  No variations found, extracting from main page only")
        variations = {'main': SOUND_URLS[sound]}
    else:
        print(f"  Found {len(variations)} spelling variations")
    
    # Extract words from each variation
    all_words = {}
    total_words = 0
    
    for pattern, url in variations.items():
        print(f"\\nExtracting '{pattern}' from:")
        print(f"  {url}")
        words = extract_words_from_page(url)
        all_words[pattern] = words
        total_words += len(words)
        print(f"  Found {len(words)} words")
    
    # Generate output
    output_path = f"c:\\Users\\dsuth\\OneDrive\\Documents\\Joshua\\Spelling-Project\\Sounds\\{sound}_raw.txt"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"# Raw extraction for /{sound}/ sound\\n\\n")
        for pattern, words in all_words.items():
            f.write(f"\\n## Spelling: {pattern}\\n")
            f.write(f"Words: {', '.join(words)}\\n")
    
    print(f"\\n✓ Extraction complete!")
    print(f"✓ Total words extracted: {total_words}")
    print(f"✓ Output saved to: {output_path}")

if __name__ == "__main__":
    main()
