from fastapi import FastAPI, APIRouter, Query, HTTPException, Depends
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
import math

from models import Movie, MovieCreate, MovieUpdate, SearchQuery, MovieResponse
from database import MovieDatabase

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
movie_db = MovieDatabase(mongo_url, db_name)

# Create the main app without a prefix
app = FastAPI(title="IMDB Clone API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Dependency
async def get_movie_db():
    return movie_db

# Health check
@api_router.get("/")
async def root():
    return {"message": "IMDB Clone API is running", "version": "1.0.0"}

# Get all movies with filtering and pagination
@api_router.get("/movies", response_model=MovieResponse)
async def get_movies(
    genre: Optional[str] = Query(None, description="Filter by genre"),
    sortBy: Optional[str] = Query("rating", description="Sort by: rating, year, title"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Movies per page"),
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movies_data, total = await db.get_all_movies(genre, sortBy, page, limit)
        
        # Convert MongoDB documents to Movie objects
        movies = []
        for movie_data in movies_data:
            # Remove MongoDB _id field
            if '_id' in movie_data:
                del movie_data['_id']
            movies.append(Movie(**movie_data))
        
        total_pages = math.ceil(total / limit)
        
        return MovieResponse(
            movies=movies,
            total=total,
            page=page,
            per_page=limit,
            total_pages=total_pages
        )
    except Exception as e:
        logging.error(f"Error getting movies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get movie by ID
@api_router.get("/movies/{movie_id}")
async def get_movie(
    movie_id: str,
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movie_data = await db.get_movie_by_id(movie_id)
        if not movie_data:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Remove MongoDB _id field
        if '_id' in movie_data:
            del movie_data['_id']
        
        return Movie(**movie_data)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting movie {movie_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Search movies
@api_router.get("/movies/search")
async def search_movies(
    q: str = Query(..., min_length=1, description="Search query"),
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movies_data = await db.search_movies(q)
        
        # Convert MongoDB documents to Movie objects
        movies = []
        for movie_data in movies_data:
            if '_id' in movie_data:
                del movie_data['_id']
            movies.append(Movie(**movie_data))
        
        return {"movies": movies, "total": len(movies)}
    except Exception as e:
        logging.error(f"Error searching movies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get featured movies
@api_router.get("/movies/featured")
async def get_featured_movies(
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movies_data = await db.get_featured_movies()
        
        # Convert MongoDB documents to Movie objects
        movies = []
        for movie_data in movies_data:
            if '_id' in movie_data:
                del movie_data['_id']
            movies.append(Movie(**movie_data))
        
        return {"movies": movies}
    except Exception as e:
        logging.error(f"Error getting featured movies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get top rated movies
@api_router.get("/movies/top-rated")
async def get_top_rated_movies(
    limit: int = Query(20, ge=1, le=100, description="Number of movies to return"),
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movies_data = await db.get_top_rated_movies(limit)
        
        # Convert MongoDB documents to Movie objects
        movies = []
        for movie_data in movies_data:
            if '_id' in movie_data:
                del movie_data['_id']
            movies.append(Movie(**movie_data))
        
        return {"movies": movies}
    except Exception as e:
        logging.error(f"Error getting top rated movies: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get movies by genre
@api_router.get("/movies/genre/{genre}")
async def get_movies_by_genre(
    genre: str,
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movies_data = await db.get_movies_by_genre(genre)
        
        # Convert MongoDB documents to Movie objects
        movies = []
        for movie_data in movies_data:
            if '_id' in movie_data:
                del movie_data['_id']
            movies.append(Movie(**movie_data))
        
        return {"movies": movies}
    except Exception as e:
        logging.error(f"Error getting movies by genre {genre}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Create new movie
@api_router.post("/movies")
async def create_movie(
    movie: MovieCreate,
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        movie_data = movie.dict()
        created_movie = await db.create_movie(movie_data)
        
        if '_id' in created_movie:
            del created_movie['_id']
        
        return Movie(**created_movie)
    except Exception as e:
        logging.error(f"Error creating movie: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get all genres
@api_router.get("/genres")
async def get_genres(
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        genres = await db.get_all_genres()
        return {"genres": genres}
    except Exception as e:
        logging.error(f"Error getting genres: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Seed database
@api_router.post("/seed")
async def seed_database(
    db: MovieDatabase = Depends(get_movie_db)
):
    try:
        result = await db.seed_database()
        return {"message": result}
    except Exception as e:
        logging.error(f"Error seeding database: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup_event():
    await movie_db.create_indexes()
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    movie_db.client.close()