from google import genai
import os
from dotenv import load_dotenv
from functools import cache
from pathlib import Path
from typing import Optional

load_dotenv()
client = genai.Client()

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


