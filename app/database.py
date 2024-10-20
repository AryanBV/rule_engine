from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variable
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

# Create MongoDB client
client = MongoClient(MONGODB_URL)

# Get database
db = client.rule_engine

# Get collections
rules_collection = db.rules