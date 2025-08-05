from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
from datetime import datetime
import uuid

class MovieDatabase:
    def __init__(self, mongo_url: str, db_name: str):
        self.client = AsyncIOMotorClient(mongo_url)
        self.db = self.client[db_name]
        self.movies = self.db.movies

    async def create_indexes(self):
        """Create indexes for better query performance"""
        await self.movies.create_index("title")
        await self.movies.create_index("genre")
        await self.movies.create_index("rating")
        await self.movies.create_index("year")
        await self.movies.create_index("featured")

    async def get_all_movies(self, 
                           genre: Optional[str] = None,
                           sort_by: str = "rating",
                           page: int = 1,
                           limit: int = 20) -> tuple:
        """Get all movies with optional filtering and pagination"""
        skip = (page - 1) * limit
        
        # Build query
        query = {}
        if genre and genre != "all":
            query["genre"] = genre
        
        # Build sort
        sort_field = sort_by
        sort_direction = -1  # Descending by default
        if sort_by == "title":
            sort_direction = 1  # Ascending for title
        
        # Get total count
        total = await self.movies.count_documents(query)
        
        # Get movies
        cursor = self.movies.find(query).sort(sort_field, sort_direction).skip(skip).limit(limit)
        movies = await cursor.to_list(length=limit)
        
        return movies, total

    async def get_movie_by_id(self, movie_id: str):
        """Get a single movie by ID"""
        return await self.movies.find_one({"id": movie_id})

    async def search_movies(self, query: str) -> List[dict]:
        """Search movies by title, director, or genre"""
        search_regex = {"$regex": query, "$options": "i"}
        search_query = {
            "$or": [
                {"title": search_regex},
                {"director": search_regex},
                {"genre": search_regex}
            ]
        }
        
        cursor = self.movies.find(search_query).sort("rating", -1)
        return await cursor.to_list(length=50)

    async def get_featured_movies(self) -> List[dict]:
        """Get featured movies"""
        cursor = self.movies.find({"featured": True}).sort("rating", -1)
        return await cursor.to_list(length=10)

    async def get_top_rated_movies(self, limit: int = 20) -> List[dict]:
        """Get top rated movies"""
        cursor = self.movies.find({}).sort("rating", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_movies_by_genre(self, genre: str) -> List[dict]:
        """Get movies by specific genre"""
        cursor = self.movies.find({"genre": genre}).sort("rating", -1)
        return await cursor.to_list(length=50)

    async def create_movie(self, movie_data: dict):
        """Create a new movie"""
        movie_data["id"] = str(uuid.uuid4())
        movie_data["created_at"] = datetime.utcnow()
        movie_data["updated_at"] = datetime.utcnow()
        
        result = await self.movies.insert_one(movie_data)
        return await self.movies.find_one({"_id": result.inserted_id})

    async def update_movie(self, movie_id: str, update_data: dict):
        """Update a movie"""
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.movies.update_one(
            {"id": movie_id},
            {"$set": update_data}
        )
        
        if result.modified_count:
            return await self.movies.find_one({"id": movie_id})
        return None

    async def delete_movie(self, movie_id: str) -> bool:
        """Delete a movie"""
        result = await self.movies.delete_one({"id": movie_id})
        return result.deleted_count > 0

    async def get_all_genres(self) -> List[str]:
        """Get all unique genres"""
        pipeline = [
            {"$unwind": "$genre"},
            {"$group": {"_id": "$genre"}},
            {"$sort": {"_id": 1}}
        ]
        
        cursor = self.movies.aggregate(pipeline)
        genres = []
        async for doc in cursor:
            genres.append(doc["_id"])
        
        return genres

    async def seed_database(self):
        """Seed database with initial movie data"""
        # Check if movies already exist
        count = await self.movies.count_documents({})
        if count > 0:
            return f"Database already contains {count} movies"

        # Initial movie data
        initial_movies = [
            {
                "id": "1",
                "title": "The Shawshank Redemption",
                "year": 1994,
                "rating": 9.3,
                "genre": ["Drama"],
                "director": "Frank Darabont",
                "duration": "142 min",
                "poster": "https://images.unsplash.com/photo-1489599833883-0a2c073c5fd4?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=600&fit=crop",
                "plot": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                "cast": ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
                "featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "2",
                "title": "The Godfather",
                "year": 1972,
                "rating": 9.2,
                "genre": ["Crime", "Drama"],
                "director": "Francis Ford Coppola",
                "duration": "175 min",
                "poster": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
                "plot": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
                "cast": ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"],
                "featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "3",
                "title": "The Dark Knight",
                "year": 2008,
                "rating": 9.0,
                "genre": ["Action", "Crime", "Drama"],
                "director": "Christopher Nolan",
                "duration": "152 min",
                "poster": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
                "plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
                "cast": ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
                "featured": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "4",
                "title": "Pulp Fiction",
                "year": 1994,
                "rating": 8.9,
                "genre": ["Crime", "Drama"],
                "director": "Quentin Tarantino",
                "duration": "154 min",
                "poster": "https://images.unsplash.com/photo-1489599833883-0a2c073c5fd4?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
                "plot": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
                "cast": ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis"],
                "featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "5",
                "title": "Forrest Gump",
                "year": 1994,
                "rating": 8.8,
                "genre": ["Drama", "Romance"],
                "director": "Robert Zemeckis",
                "duration": "142 min",
                "poster": "https://images.unsplash.com/photo-1489599833883-0a2c073c5fd4?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
                "plot": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
                "cast": ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
                "featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "6",
                "title": "Inception",
                "year": 2010,
                "rating": 8.8,
                "genre": ["Action", "Sci-Fi", "Thriller"],
                "director": "Christopher Nolan",
                "duration": "148 min",
                "poster": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
                "plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "cast": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Ellen Page"],
                "featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "7",
                "title": "The Matrix",
                "year": 1999,
                "rating": 8.7,
                "genre": ["Action", "Sci-Fi"],
                "director": "Lana Wachowski, Lilly Wachowski",
                "duration": "136 min",
                "poster": "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
                "plot": "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
                "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
                "featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": "8",
                "title": "Goodfellas",
                "year": 1990,
                "rating": 8.7,
                "genre": ["Biography", "Crime", "Drama"],
                "director": "Martin Scorsese",
                "duration": "146 min",
                "poster": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
                "backdrop": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
                "plot": "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
                "cast": ["Robert De Niro", "Ray Liotta", "Joe Pesci", "Lorraine Bracco"],
                "featured": False,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]

        # Insert all movies
        await self.movies.insert_many(initial_movies)
        await self.create_indexes()
        
        return f"Successfully seeded database with {len(initial_movies)} movies"