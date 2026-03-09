import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.hrms_lite

employee_collection = database.get_collection("employees")
attendance_collection = database.get_collection("attendance")

async def init_db():
    await employee_collection.create_index("employee_id", unique=True)
    await attendance_collection.create_index(
        [("employee_id", 1), ("date", 1)], unique=True
    )
