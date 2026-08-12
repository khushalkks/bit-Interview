import os
from typing import Dict, Any, List, Optional
from datetime import datetime

try:
    from pymongo import MongoClient
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    # Test connection
    client.admin.command('ping')
    db = client["bit_interview_db"]
    IS_MONGO_CONNECTED = True
    print("Successfully connected to MongoDB Database!")
except Exception as e:
    IS_MONGO_CONNECTED = False
    db = None
    print(f"MongoDB not available locally ({e}). Using resilient in-memory database store.")

# In-memory document store fallback
IN_MEMORY_COLLECTIONS: Dict[str, Dict[str, dict]] = {
    "users": {},
    "resumes": {},
    "interviews": {},
    "reports": {}
}

class MongoDBManager:
    @staticmethod
    def get_collection(collection_name: str):
        if IS_MONGO_CONNECTED and db is not None:
            return db[collection_name]
        return None

    @staticmethod
    def insert_document(collection_name: str, doc_id: str, document: dict) -> dict:
        document["_id"] = doc_id
        document["updated_at"] = datetime.now().isoformat()
        
        if IS_MONGO_CONNECTED and db is not None:
            try:
                db[collection_name].replace_one({"_id": doc_id}, document, upsert=True)
                return document
            except Exception as e:
                print(f"Mongo write warning: {e}")

        # Fallback in-memory
        if collection_name not in IN_MEMORY_COLLECTIONS:
            IN_MEMORY_COLLECTIONS[collection_name] = {}
        IN_MEMORY_COLLECTIONS[collection_name][doc_id] = document
        return document

    @staticmethod
    def find_document(collection_name: str, doc_id: str) -> Optional[dict]:
        if IS_MONGO_CONNECTED and db is not None:
            try:
                result = db[collection_name].find_one({"_id": doc_id})
                if result:
                    return result
            except Exception as e:
                print(f"Mongo find warning: {e}")

        # Fallback in-memory
        return IN_MEMORY_COLLECTIONS.get(collection_name, {}).get(doc_id)

    @staticmethod
    def find_all(collection_name: str, filter_dict: Optional[dict] = None) -> List[dict]:
        if IS_MONGO_CONNECTED and db is not None:
            try:
                cursor = db[collection_name].find(filter_dict or {})
                return list(cursor)
            except Exception as e:
                print(f"Mongo query warning: {e}")

        # Fallback in-memory
        coll = IN_MEMORY_COLLECTIONS.get(collection_name, {})
        docs = list(coll.values())
        if filter_dict:
            filtered = []
            for d in docs:
                match = True
                for k, v in filter_dict.items():
                    if d.get(k) != v:
                        match = False
                        break
                if match:
                    filtered.append(d)
            return filtered
        return docs
