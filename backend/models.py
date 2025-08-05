from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime
import uuid

class MovieBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    year: int = Field(..., ge=1800, le=2030)
    rating: float = Field(..., ge=0.0, le=10.0)
    genre: List[str] = Field(..., min_items=1)
    director: str = Field(..., min_length=1, max_length=100)
    duration: str = Field(..., min_length=1, max_length=20)
    poster: str = Field(..., min_length=1)
    backdrop: str = Field(..., min_length=1)
    plot: str = Field(..., min_length=10, max_length=1000)
    cast: List[str] = Field(..., min_items=1)
    featured: bool = Field(default=False)

    @validator('genre')
    def validate_genre(cls, v):
        valid_genres = [
            "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
            "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", 
            "Music", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
        ]
        for genre in v:
            if genre not in valid_genres:
                raise ValueError(f'Invalid genre: {genre}')
        return v

class MovieCreate(MovieBase):
    pass

class Movie(MovieBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class MovieUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    year: Optional[int] = Field(None, ge=1800, le=2030)
    rating: Optional[float] = Field(None, ge=0.0, le=10.0)
    genre: Optional[List[str]] = Field(None, min_items=1)
    director: Optional[str] = Field(None, min_length=1, max_length=100)
    duration: Optional[str] = Field(None, min_length=1, max_length=20)
    poster: Optional[str] = Field(None, min_length=1)
    backdrop: Optional[str] = Field(None, min_length=1)
    plot: Optional[str] = Field(None, min_length=10, max_length=1000)
    cast: Optional[List[str]] = Field(None, min_items=1)
    featured: Optional[bool] = None

class SearchQuery(BaseModel):
    q: str = Field(..., min_length=1, max_length=100)

class MovieResponse(BaseModel):
    movies: List[Movie]
    total: int
    page: int
    per_page: int
    total_pages: int