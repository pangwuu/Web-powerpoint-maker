import json
import os
import asyncio
from app.database import db

DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'songs_db.json')

async def migrate():
    if not os.path.exists(DATA_FILE):
        print(f"Data file not found at {DATA_FILE}")
        return

    print("Reading songs from JSON...")
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        songs = json.load(f)

    if not songs:
        print("No songs to migrate.")
        return

    collection = db.songs
    
    # Optional: Clear existing data or check for duplicates
    # await collection.delete_many({}) 
    
    count = 0
    for song in songs:
        # Use 'id' as the unique identifier.
        # If the song has an ID, check if it exists.
        if 'id' in song and song['id']:
            existing = await collection.find_one({"id": song['id']})
            if not existing:
                await collection.insert_one(song)
                count += 1
        else:
            # If no ID (shouldn't happen with latest code), insert it
            await collection.insert_one(song)
            count += 1

    print(f"Successfully migrated {count} songs to MongoDB.")

if __name__ == "__main__":
    asyncio.run(migrate())
