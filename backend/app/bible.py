from random import choice
import re
from meaningless import WebExtractor
import meaningless
from meaningless.utilities.exceptions import InvalidSearchError
import google.generativeai as genai
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
    Obtains a bible passage using the meaningless extractor.
    The passages are split into parts, which have their size restricted by a number of verses or newlines
    '''
    
    if not verse_reference or verse_reference.lower().strip() == "n":
        return []

    try:
        extractor = WebExtractor(translation=output_translation, output_as_list=True)
        # remove the edition
        verse_reference = re.sub(r'\([^)]*\)', '', verse_reference).strip().title()
        verse_text = extractor.search(verse_reference)
    except (InvalidSearchError, Exception) as e:
        # Fallback to GenAI if meaningless fails or invalid search
        print(f"Meaningless failed: {e}. Trying GenAI...")
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print(f"No GEMINI_API_KEY found. Checked {env_path} and environment. Returning empty.")
            return []

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        prompt = f'You are a biblical scholar. Return ONLY the text of the bible passage {verse_reference} ({output_translation}). Do not include the reference title, just the verses. If not found, return nothing.'
        
        try:
            response = model.generate_content(prompt)
            # GenAI might return a block of text, we might need to split it if it's not a list.
            # meaningful returns a list of strings (verses).
            # We'll just treat the whole block as one item for now or split by newlines.
            verse_text = response.text.split('\n')
            verse_text = [v for v in verse_text if v.strip()]
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
        part = f"{part}{verse}"

        # This ensures each slide has a consistent number of verses
        verse_count = (verse_count + 1) % verse_max
        verse_remaining -= 1
        
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
