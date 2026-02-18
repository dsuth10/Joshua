"""
Spelfabet /k/ Sound Word Extractor

This script systematically scrapes all Spelfabet pages containing /k/ sound words
and compiles them into a comprehensive markdown document organized by spelling pattern.
"""

import requests
from bs4 import BeautifulSoup
import re
from collections import defaultdict

# All /k/ sound spelling pages on Spelfabet
K_SOUND_URLS = {
    'c': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/c-as-in-cat/',
    'k': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/k-as-in-kit/',
    'ck': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/ck-as-in-back/',
    'x': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/x-as-in-fox/',
    'q': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/q-as-in-quit/',
    'ch': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/ch-as-in-school/',
    'que': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/que-as-in-cheque/',
    'cc': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/cc-as-in-soccer/',
    'cqu': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/cqu-as-in-racquet/',
    'cch': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/cch-as-in-zucchini/',
    'ke': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/ke-as-in-bourke/',
    'kk': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/kk-as-in-trekking/',
    'kh': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/k-as-in-kit/kh-as-in-khaki/',
    'cq': 'https://www.spelfabet.com.au/spelling-lists/sorted-by-sound/k/cq-as-in-acquit/',
}

def extract_words_from_page(url):
    """
    Extract all words from a Spelfabet spelling list page.
    Returns a list of words found on the page.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the main content area (adjust selector based on actual page structure)
        # Spelfabet pages typically have words in table cells or list items
        words = []
        
        # Look for words in table cells
        for cell in soup.find_all('td'):
            text = cell.get_text(strip=True)
            if text and not text.startswith('http'):
                # Split by whitespace and filter out non-word content
                potential_words = text.split()
                for word in potential_words:
                    # Clean up the word (remove punctuation at edges)
                    clean_word = re.sub(r'^[^\w]+|[^\w]+$', '', word)
                    if clean_word and len(clean_word) > 1:
                        words.append(clean_word)
        
        # Also check for words in paragraph or list elements
        for elem in soup.find_all(['p', 'li']):
            text = elem.get_text(strip=True)
            # Look for word lists (comma-separated or space-separated)
            if ',' in text or ' ' in text:
                potential_words = re.split(r'[,\s]+', text)
                for word in potential_words:
                    clean_word = re.sub(r'^[^\w]+|[^\w]+$', '', word)
                    if clean_word and 2 <= len(clean_word) <= 20:
                        words.append(clean_word)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_words = []
        for word in words:
            if word.lower() not in seen:
                seen.add(word.lower())
                unique_words.append(word)
        
        return unique_words
    
    except Exception as e:
        print(f"Error extracting from {url}: {e}")
        return []

def generate_markdown(all_words):
    """
    Generate a markdown document with all /k/ sound words organized by spelling.
    """
    output = "# Sound: /k/ (as in kick, school)\n\n"
    output += "_Comprehensive word list extracted from Spelfabet.com.au_\n\n"
    
    for spelling, url in K_SOUND_URLS.items():
        words = all_words.get(spelling, [])
        if words:
            output += f"## Spelling: {spelling}\n\n"
            output += f"**Example**: {spelling} as in {words[0] if words else 'N/A'}\n\n"
            output += "**Words**:\n"
            # Format words in columns for readability
            for i, word in enumerate(words):
                if i % 5 == 0 and i > 0:
                    output += "\n"
                output += f"- {word}\n" if i % 5 == 0 else f"{word}, "
            output += "\n\n---\n\n"
    
    return output

def main():
    """Main function to extract all /k/ sound words and generate markdown."""
    print("Starting Spelfabet /k/ sound word extraction...")
    
    all_words = {}
    
    for spelling, url in K_SOUND_URLS.items():
        print(f"\nExtracting words with '{spelling}' spelling from:")
        print(f"  {url}")
        words = extract_words_from_page(url)
        all_words[spelling] = words
        print(f"  Found {len(words)} words")
    
    # Generate markdown
    markdown_content = generate_markdown(all_words)
    
    # Write to file
    output_path = r"c:\Users\dsuth\OneDrive\Documents\Joshua\Spelling-Project\Sounds\k_complete.md"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print(f"\n✓ Complete word list written to: {output_path}")
    print(f"✓ Total spellings processed: {len(all_words)}")
    
    total_words = sum(len(words) for words in all_words.values())
    print(f"✓ Total unique words extracted: {total_words}")

if __name__ == "__main__":
    main()
