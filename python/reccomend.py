from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List
from bson import ObjectId
from datetime import datetime

# FastAPI app instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; restrict this for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# MongoDB client setup
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["freelance"]

# Pydantic models
class Gig(BaseModel):
    id: str = Field(..., alias="_id")  # Mapping MongoDB's "_id"
    userId: str
    title: str
    desc: str
    totalStars: int
    starNumber: int
    cat: str
    price: int
    cover: str  # URL validation
    images: List[str]
    shortTitle: str
    shortDesc: str
    deliveryTime: int
    revisionNumber: int
    features: List[str]
    sales: int
    createdAt: datetime
    updatedAt: datetime

class SearchHistory(BaseModel):
    userId: str
    searches: List[str]
    lastUpdated: str

# Helper function to fetch user search history
async def get_search_history(user_id: str):
    search_history = await db.searchhistories.find_one({"userId": user_id})
    if not search_history:
        raise HTTPException(status_code=404, detail="Search history not found")
    return search_history['searches']

# Helper function to fetch all gigs from the gigs collection
async def get_all_gigs():
    gigs_cursor = db.gigs.find()
    gigs = []
    async for gig in gigs_cursor:
        gig["_id"] = str(gig["_id"])
        gigs.append(Gig(**gig))
    return gigs

# Helper function to compute cosine similarity
def get_cosine_similarity(query: str, documents: List[str]):
    # Combine query and documents to fit the vectorizer
    all_texts = [query] + documents
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    # Compute cosine similarity between the query (first vector) and all documents (remaining vectors)
    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    
    return cosine_similarities.flatten()

# API endpoint to get recommendations based on cosine similarity
@app.get("/recommendations/{user_id}", response_model=List[Gig])
async def get_recommendations(user_id: str):
    search_terms = await get_search_history(user_id)
    search_query = " ".join(search_terms)  # Combine search terms into a single query string
    
    # Fetch all gigs from MongoDB
    gigs = await get_all_gigs()
    
    # Prepare documents for cosine similarity calculation
    gig_titles = [gig.title for gig in gigs]
    gig_features = [" ".join(gig.features) for gig in gigs]
    gig_categories = [gig.cat for gig in gigs]

    print("Titles", gig_titles)
    print("Features",  gig_features)
    print("Catefories", gig_categories)
    
    # Combine all the gig fields (title, features, categories) into a single string for each gig
    gig_texts = [f"{title} {feature} {category}" for title, feature, category in zip(gig_titles, gig_features, gig_categories)]
    
    print(gig_texts)
    # Calculate cosine similarities between the user's search query and gig texts
    cosine_similarities = get_cosine_similarity(search_query, gig_texts)

    print(cosine_similarities)
    
    # Sort gigs by similarity score in descending order
    recommended_gigs = sorted(zip(cosine_similarities, gigs), key=lambda x: x[0], reverse=True)
    
    # Return the top 5 most similar gigs
    top_recommendations = [gig for _, gig in recommended_gigs[:5]]
    
    return top_recommendations

# Run the server using the command `uvicorn <filename>:app --reload`
