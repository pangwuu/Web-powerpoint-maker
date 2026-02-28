from google import genai
from google.genai import types
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
            model='gemini-2.5-flash-lite',
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
            model='gemini-2.5-flash-lite',
            contents=prompt
        )
        translated = response.text.strip()
        if translated:
            return translated
        return None
    except Exception as e:
        print(f"Gemini translation error: {e}")
        return None

def search_and_structure_lyrics_gemini(song: str, artist: str) -> dict | None:
    prompt = f'''
    Search for the lyrics of "{song}" by "{artist}". 
    DO NOT MAKE UP LYRICS. If the song is not found, return a JSON object with a single key 'status': 'not_found'.
    
    Split the lyrics into distinct sections (e.g., Verse 1, Chorus).
    Return a JSON object with exactly these keys: "title", "artist", and "sections".
    "sections" should be an array of objects with "label" and "content".

    ONLY RETURN THE JSON. NO MARKDOWN PROSE.
    '''
    
    # Properly define the grounding tool using the types from your snippet
    grounding_tool = types.Tool(google_search=types.GoogleSearch())

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[grounding_tool],
                temperature=0.0,
                # 'response_mime_type' removed because it's incompatible with tools
            )
        )
        
        if not response.text:
            return None

        import json
        
        # 1. Clean up the response text (remove markdown code blocks if they exist)
        raw_text = response.text.strip()
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        # 2. Parse the JSON
        data = json.loads(raw_text)
        
        # 3. Handle the "not found" status
        if isinstance(data, dict) and data.get('status') == 'not_found':
            return None
        
        # 4. Final validation of structure
        if isinstance(data, dict) and "sections" in data:
            return data
            
        return None

    except Exception as e:
        print(f"Lyrics search/structuring failed: {e}")
        return None