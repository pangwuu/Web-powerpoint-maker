from random import choice
import re
from meaningless import WebExtractor
import meaningless
from meaningless.utilities.exceptions import InvalidSearchError
from google import genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load env to get API key if needed
# explicitly look for .env in the backend directory (parent of app)
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent
env_path = backend_dir / '.env'
load_dotenv(dotenv_path=env_path)

# Also try loading from current working directory or parents (default behavior) for good measure
load_dotenv()

def bible_passage_auto(verse_reference: str, output_translation="NIV", verse_max=2, newlines_max=4):
    '''
    Obtains a bible passage using the meaningless extractor with a robust GenAI fallback.
    '''
    
    if not verse_reference or verse_reference.lower().strip() == "n":
        return []

    try:
        extractor = WebExtractor(translation=output_translation, output_as_list=True)
        verse_reference = re.sub(r'\([^)]*\)', '', verse_reference).strip().title()
        verse_text = extractor.search(verse_reference)
    except (InvalidSearchError, Exception) as e:
        print(f"Meaningless failed: {e}. Trying GenAI...")
        
        client = genai.Client()

        # UPDATED PROMPT: Explicitly request newlines and verse numbers for easier parsing
        prompt = (
            f"Return the text of the bible passage {verse_reference} ({output_translation}). "
            "Format the output so each verse is on a new line starting with its verse number. "
            "Do not include the reference title or any introductory text. If not found, return nothing."
        )
        
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            print(response)
            
            # Use regex to split by verse numbers (e.g., '1 ', '2 ') in case \n is missing
            raw_text = response.text.strip()
            # This regex splits by "digit followed by space", keeping the digit as part of the verse
            # 1. Split by verse numbers at the start of lines
            raw_verses = re.split(r'\n(?=\d+\s)', raw_text)
            # 2. Strip the leading numbers from each verse            
            verse_text = [re.sub(r'^\d+\s+', '', v).strip() for v in raw_verses if v.strip()]            
            
        except Exception as gen_e:
            print(f"GenAI failed: {gen_e}")
            return []

    if not verse_text:
        return []

    verse_remaining = len(verse_text)
    verse_count = 0
    part = ""
    parts = []

    for i, verse in enumerate(verse_text):
        # FIX: Added a newline separator between verses so they don't run together
        part = f"{part}\n{verse}".strip() if part else verse

        verse_count = (verse_count + 1) % verse_max
        verse_remaining -= 1
        
        # Check constraints for splitting into a new "part" (slide)
        if verse_count <= 0 or verse_remaining <= 0 or part.count("\n") >= newlines_max:
            verse_count = 0 
            parts.append(part)
            part = ""

    return parts
def get_correct_copyright_message(bible_version: str) -> str:
    match bible_version:
        case "NIV":
            return """Scripture quotations taken from The Holy Bible, New International Version® NIV®
            Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.
            Used with permission. All rights reserved worldwide."""
        case "ESV":
            return """Scripture quotations are from The ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.
            """
        case "NLT":
            return """Scripture quotations are taken from the Holy Bible, New Living Translation, Copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Inc., Carol Stream, Illinois 60188. All rights reserved."""
        case "CEV":
            return """Scripture quotations marked (CEV) are from the Contemporary English Version Copyright © 1991, 1992, 1995 by American Bible Society. Used by Permission."""
        case "NASB":
            return """Scripture quotations taken from the (NASB®) New American Standard Bible®, Copyright © 1960, 1971, 1977, 1995, 2020 by The Lockman Foundation. Used by permission. All rights reserved. lockman.org"""
        case "NKJV":
            return """Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved."""
        case _ :
            return "Public domain"
