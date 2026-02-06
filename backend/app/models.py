from pydantic import BaseModel
from typing import List, Optional

class SongSection(BaseModel):
    label: str
    content: str

class Song(BaseModel):
    id: Optional[str] = None
    title: str
    artist: Optional[str] = None
    ccli_number: Optional[str] = None
    sections: List[SongSection]
    # We can add more fields later like 'author', 'key', etc.

class ServiceItem(BaseModel):
    type: str  # "song", "bible", "announcement", "communion"
    id: Optional[str] = None # ID if it's a song from DB
    data: Optional[dict] = None # Extra data (e.g. bible ref, or custom announcement text)

class BibleReading(BaseModel):
    reference: str
    version: str = "NIV"

class AnnouncementItem(BaseModel):
    title: str
    content: Optional[str] = None

class OfferingInfo(BaseModel):
    account_name: str = "Blacktown Chinese Christian Church"
    account_number: str = "4216 50263"
    bsb: str = "112 - 879"
    reference: str = "offering"
    details: str = "The offering box is available at the back of the hall"

class GenerateRequest(BaseModel):
    date: str
    speaker: str
    topic: str
    church_name: str = "Blacktown Chinese Christian Church"
    service_name: str = "English Service"
    bible_readings: List[BibleReading] = []
    songs: List[Song]
    response_songs: List[Song]
    announcements: List[AnnouncementItem] = []
    offering: OfferingInfo = OfferingInfo()
    prayer_points: List[str] = []
    mingle_text: str = "Mingle time!"
    template_name: Optional[str] = "medium"
    translate: bool = False
    language: str = "Chinese (Simplified)"
