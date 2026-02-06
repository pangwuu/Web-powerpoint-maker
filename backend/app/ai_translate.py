from google import genai
import os
from dotenv import load_dotenv
from functools import cache
from pathlib import Path
from typing import Optional, List
import re

load_dotenv()
client = genai.Client()

def split_lyrics_manually(lyrics: str) -> List[dict]:
    """
    Attempts to split lyrics based on standard square bracket headers [Verse 1].
    """
    parts = re.split(r'\[([^\]]+)\]', lyrics)
    
    if len(parts) <= 1:
        return []

    sections = []
    # If there is text before the first header, label it as Intro
    if parts[0].strip():
        sections.append({"label": "Intro", "content": parts[0].strip()})
        
    for i in range(1, len(parts), 2):
        label = parts[i].strip()
        content = parts[i+1].strip() if i+1 < len(parts) else ""
        if content:
            sections.append({"label": label, "content": content})
            
    return sections

@cache
def translate_with_gemini(text: str, translated_language: str,  start_language: str='English') -> str:
    # make sure GEMINI_API_KEY is defined in your .env file
    current_dir = Path(__file__).resolve().parent
    backend_dir = current_dir.parent
    env_path = backend_dir / '.env'
    load_dotenv(dotenv_path=env_path)
    # Also load from default locations as fallback
    load_dotenv()

    # uses the same one in the .env file
    client = genai.Client()

    prompt = f'''
You are a song translator. For the song below, please translate the song line by line into {translated_language}.

Make sure the number of syllables on each {translated_language} line match up with the number of syllables in each {start_language} line. 

Since this song is going to be sung in church matching the syllables in each {translated_language} line to the number of syllables in each {start_language} line is also very important.

Make sure your output format alternates lines of {start_language} and {translated_language} simplified. For example

{start_language} LINE
{translated_language} LINE
{start_language} LINE
{translated_language} LINE

{text}

DO NOT PROVIDE ANY OTHER OUTPUTS OTHER THAN THE SONG LINES IN THE FORMAT ABOVE 
'''

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Translation failed: {e}")
        return text

@cache
def translate_text_gemini(text: str, target_language: str) -> Optional[str]:
    """Translation of text using Gemini. Can be a single line or a block."""
    
    prompt = f"Translate the following text to {target_language}. Keep the same number of lines and do not add any explanations or extra text. Only return the translated lines:\n\n{text}"
            
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        translated = response.text.strip()
        if translated:
            return translated
        return None
    except Exception as e:
        print(f"Gemini translation error: {e}")
        return None

def structure_lyrics_with_gemini(raw_lyrics: str) -> List[dict]:
    """
    Uses Gemini to structure raw lyrics into a list of sections.
    Attempts manual split first.
    """
    # 1. Try manual regex split first (Deterministic & Fast)
    manual_sections = split_lyrics_manually(raw_lyrics)
    if len(manual_sections) > 1:
        return manual_sections

    # 2. Fallback to AI for intelligent splitting (Probabilistic but Smart)
    prompt = f'''
You are a song lyrics processor. Your goal is to split raw lyrics into distinct sections (e.g., Verse 1, Chorus, Bridge, etc.).

Even if there are no square brackets like [Verse 1], look for logical breaks like:
- Labels at the start of lines (e.g. "Verse 1:", "Chorus -")
- Large blocks of text separated by double newlines.

Each section must have a clear "label" and "content".
Return the result as a JSON array of objects.

Raw lyrics:
{raw_lyrics}

ONLY RETURN THE JSON ARRAY. DO NOT PROVIDE ANY OTHER TEXT.
'''

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                'response_mime_type': 'application/json',
            }
        )
        import json
        structured_data = json.loads(response.text)
        if isinstance(structured_data, list) and len(structured_data) > 0:
            return structured_data
        return [{"label": "Lyrics", "content": raw_lyrics}]
    except Exception as e:
        print(f"Lyrics structuring failed: {e}")
        return [{"label": "Lyrics", "content": raw_lyrics}]


