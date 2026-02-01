from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import uuid
from typing import List

from .models import Song, GenerateRequest
from .generator import generate_powerpoint
from .bible import bible_passage_auto
from .database import db

app = FastAPI(title="PPT Generator API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/songs", response_model=List[Song])
async def get_songs():
    songs_cursor = db.songs.find({})
    songs = await songs_cursor.to_list(length=None)
    # Map MongoDB documents to Song objects (Pydantic handles extra fields like _id by default, 
    # but we pass the dict. 'id' should be in the doc from migration/creation)
    return [Song(**song) for song in songs]

@app.post("/songs", response_model=Song)
async def create_song(song: Song):
    if not song.id:
        song.id = str(uuid.uuid4())
    
    song_dict = song.dict()
    await db.songs.insert_one(song_dict)
    return song

@app.put("/songs/{song_id}", response_model=Song)
async def update_song(song_id: str, updated_song: Song):
    # Ensure ID matches
    updated_song.id = song_id
    
    result = await db.songs.replace_one({"id": song_id}, updated_song.dict())
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Song not found")
        
    return updated_song

@app.delete("/songs/{song_id}")
async def delete_song(song_id: str):
    result = await db.songs.delete_one({"id": song_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Song not found")
        
    return {"message": "Song deleted"}

@app.get("/bible")
async def get_bible_passage(ref: str, version: str = "NIV"):
    """Returns the text for a given reference."""
    verses = bible_passage_auto(f"{ref} ({version})", output_translation=version)
    if not verses:
        raise HTTPException(status_code=404, detail="Passage not found")
    return {"reference": ref, "version": version, "text": verses}

@app.post("/generate")
async def generate_ppt(request: GenerateRequest):
    try:
        ppt_file = generate_powerpoint(request)
        headers = {
            'Content-Disposition': f'attachment; filename="Service_{request.date}.pptx"'
        }
        return Response(content=ppt_file.getvalue(), media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", headers=headers)
    except Exception as e:
        print(f"Error generating PPT: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}
