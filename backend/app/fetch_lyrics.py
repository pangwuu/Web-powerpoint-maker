from dotenv import load_dotenv
import os, lyricsgenius, webbrowser, warnings, re
from random import randint

# Path to the root directory containing "Songs" and "Complete Slides" directories
root_directory = f"{os.path.dirname(__file__)}/../"

load_dotenv()
# Put your own genius token here
genius_token = os.environ.get("GENIUS_TOKEN")

if genius_token == "":
    raise Exception

# Path to the "Songs" directory
songs_directory = os.path.join(root_directory, "songs")

def clean_genius_lyrics(lyrics: str) -> str:
    """
    Removes Genius-specific junk like '123 Contributors', 'Easy To Love Lyrics',
    and '123Embed' at the end, while preserving structural line breaks.
    """
    # Remove the "n Contributors ... Lyrics" header
    # We use re.DOTALL to handle potential multi-line headers if they exist
    lyrics = re.sub(r'^\d+ Contributors.*?Lyrics', '', lyrics, flags=re.IGNORECASE)
    
    # Remove "You might also like" which sometimes appears in the middle
    lyrics = re.sub(r'You might also like', '', lyrics, flags=re.IGNORECASE)
    
    # Remove the "Embed" junk at the very end
    lyrics = re.sub(r'\d*Embed$', '', lyrics.strip())
    
    return lyrics.strip()

def fetch_lyrics(song_name: str, artist: str = ""):
    genius_token = os.environ.get("GENIUS_TOKEN")
    if not genius_token:
        print("GENIUS_TOKEN not found in environment variables")
        return None

    # Increase timeout if it isn't working
    genius = lyricsgenius.Genius(genius_token, timeout=100)
    # We WANT section headers [Verse 1] etc. to help Gemini structure it
    genius.remove_section_headers = False 
    genius.skip_non_songs = True
    
    song = genius.search_song(song_name, artist, get_full_info=False)

    if song:
        return {
            "title": song.title,
            "artist": song.artist,
            "lyrics": clean_genius_lyrics(song.lyrics)
        }
    return None