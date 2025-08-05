# IMDB Clone - Backend Integration Contracts

## API Endpoints Specification

### Movies API Routes

#### 1. Get All Movies
- **Endpoint**: `GET /api/movies`
- **Query Parameters**: 
  - `genre` (optional): Filter by genre
  - `sortBy` (optional): 'rating', 'year', 'title' (default: 'rating')
  - `limit` (optional): Number of movies to return (default: 20)
  - `page` (optional): Page number for pagination (default: 1)
- **Response**: Array of movie objects

#### 2. Get Movie by ID
- **Endpoint**: `GET /api/movies/{id}`
- **Response**: Single movie object

#### 3. Search Movies
- **Endpoint**: `GET /api/movies/search`
- **Query Parameters**: 
  - `q`: Search query (title, director, genre)
- **Response**: Array of matching movies

#### 4. Get Featured Movies
- **Endpoint**: `GET /api/movies/featured`
- **Response**: Array of featured movies

#### 5. Get Top Rated Movies
- **Endpoint**: `GET /api/movies/top-rated`
- **Response**: Array of movies sorted by rating (descending)

#### 6. Get Movies by Genre
- **Endpoint**: `GET /api/movies/genre/{genre}`
- **Response**: Array of movies in specified genre

#### 7. Add New Movie (Admin)
- **Endpoint**: `POST /api/movies`
- **Body**: Movie object
- **Response**: Created movie object

#### 8. Get All Genres
- **Endpoint**: `GET /api/genres`
- **Response**: Array of genre strings

## MongoDB Schema

### Movie Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  year: Number (required),
  rating: Number (required, min: 0, max: 10),
  genre: [String] (required),
  director: String (required),
  duration: String (required),
  poster: String (required, URL),
  backdrop: String (required, URL),
  plot: String (required),
  cast: [String] (required),
  featured: Boolean (default: false),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

## Mock Data Replacement Strategy

### Current Mock Data in `/frontend/src/data/mockMovies.js`:
- **mockMovies**: 8 sample movies with all required fields
- **genres**: Array of 20 genre strings
- **Helper functions**: getFeaturedMovies, getPopularMovies, getMovieById, searchMovies, getMoviesByGenre

### Replacement Plan:
1. Replace mock data calls with API calls using axios
2. Update all pages to use async data fetching
3. Add loading states and error handling
4. Implement pagination for large datasets

## Frontend Integration Changes

### Files to Update:
1. **src/pages/Home.jsx**: Replace mock data with API calls for featured and popular movies
2. **src/pages/Movies.jsx**: Replace filtering with API-based filtering and pagination
3. **src/pages/SearchResults.jsx**: Replace mock search with API search
4. **src/pages/MovieDetail.jsx**: Replace getMovieById with API call
5. **src/pages/Genres.jsx**: Replace genre data with API calls
6. **src/pages/TopRated.jsx**: Replace sorting with API-based top rated endpoint

### API Service Layer:
- Create `src/services/api.js` for centralized API calls
- Add proper error handling and loading states
- Implement caching for better performance

## Backend Implementation Plan

### 1. MongoDB Models (using Mongoose)
- Movie model with validation
- Index on title, genre, rating for better query performance

### 2. Backend Routes
- Implement all API endpoints listed above
- Add input validation using Pydantic
- Error handling and status codes
- CORS setup for frontend integration

### 3. Database Seeding
- Create script to populate database with initial movie data
- Use the current mock data as seed data

### 4. Integration Testing
- Test all API endpoints
- Verify frontend-backend communication
- Test error scenarios and edge cases

## Success Criteria
- [ ] All mock data replaced with API calls
- [ ] Search functionality working with backend
- [ ] Filtering and sorting working via API
- [ ] Movie details loading from database
- [ ] Error handling for network failures
- [ ] Loading states for better UX
- [ ] Database properly seeded with movie data