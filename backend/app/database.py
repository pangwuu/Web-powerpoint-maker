import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "ppt_maker")

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]

async def get_database():
    return db
