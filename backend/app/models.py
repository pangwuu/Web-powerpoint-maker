from pydantic import BaseModel
from typing import List, Optional

class SongSection(BaseModel):
    label: str
    content: str

class Song(BaseModel):
    id: Optional[str] = None
    title: str
    ccli_number: Optional[str] = None
    sections: List[SongSection]
    # We can add more fields later like 'author', 'key', etc.

class ServiceItem(BaseModel):
    type: str  # "song", "bible", "announcement", "communion"
    id: Optional[str] = None # ID if it's a song from DB
    data: Optional[dict] = None # Extra data (e.g. bible ref, or custom announcement text)

class GenerateRequest(BaseModel):
    date: str
    speaker: str
    topic: str
    bible_reference: str
    bible_version: str = "NIV"
    songs: List[Song] # We pass full song objects for simplicity in generation
    response_songs: List[Song]
    template_name: Optional[str] = "medium" # small, medium, large
    translate: bool = False
    language: str = "Chinese (Simplified)"
