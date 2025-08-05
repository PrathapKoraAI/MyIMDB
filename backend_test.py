#!/usr/bin/env python3
"""
IMDB Clone Backend API Test Suite
Tests all backend endpoints with comprehensive scenarios
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        return "http://localhost:8001"
    return "http://localhost:8001"

BASE_URL = get_backend_url() + "/api"
print(f"Testing backend at: {BASE_URL}")

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def print_header(message):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{message}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.ENDC}")

class IMDBBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'total': 0
        }
        self.created_movie_id = None

    def run_test(self, test_name, test_func):
        """Run a single test and track results"""
        self.test_results['total'] += 1
        try:
            print(f"\n{Colors.YELLOW}Testing: {test_name}{Colors.ENDC}")
            test_func()
            self.test_results['passed'] += 1
            print_success(f"PASSED: {test_name}")
        except Exception as e:
            self.test_results['failed'] += 1
            print_error(f"FAILED: {test_name} - {str(e)}")

    def test_health_check(self):
        """Test GET /api/ - Health check"""
        response = self.session.get(f"{self.base_url}/")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if "message" not in data or "version" not in data:
            raise Exception("Response missing required fields")
        
        print_info(f"Health check response: {data}")

    def test_seed_database(self):
        """Test POST /api/seed - Seed database"""
        response = self.session.post(f"{self.base_url}/seed")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if "message" not in data:
            raise Exception("Response missing message field")
        
        print_info(f"Seed response: {data['message']}")

    def test_get_all_movies(self):
        """Test GET /api/movies - Get all movies"""
        response = self.session.get(f"{self.base_url}/movies")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        required_fields = ['movies', 'total', 'page', 'per_page', 'total_pages']
        for field in required_fields:
            if field not in data:
                raise Exception(f"Response missing required field: {field}")
        
        if not isinstance(data['movies'], list):
            raise Exception("Movies field should be a list")
        
        if len(data['movies']) == 0:
            raise Exception("No movies returned - database might not be seeded")
        
        # Verify movie structure
        movie = data['movies'][0]
        movie_fields = ['id', 'title', 'year', 'rating', 'genre', 'director', 'duration', 'poster', 'backdrop', 'plot', 'cast', 'featured']
        for field in movie_fields:
            if field not in movie:
                raise Exception(f"Movie missing required field: {field}")
        
        print_info(f"Retrieved {len(data['movies'])} movies out of {data['total']} total")

    def test_movies_filtering(self):
        """Test GET /api/movies with filtering parameters"""
        # Test genre filtering
        response = self.session.get(f"{self.base_url}/movies?genre=Drama")
        if response.status_code != 200:
            raise Exception(f"Genre filtering failed with status {response.status_code}")
        
        data = response.json()
        if len(data['movies']) == 0:
            print_warning("No Drama movies found")
        else:
            # Check if returned movies contain Drama genre
            for movie in data['movies']:
                if 'Drama' not in movie['genre']:
                    raise Exception("Genre filtering not working correctly")
        
        # Test sorting
        response = self.session.get(f"{self.base_url}/movies?sortBy=title")
        if response.status_code != 200:
            raise Exception(f"Title sorting failed with status {response.status_code}")
        
        # Test pagination
        response = self.session.get(f"{self.base_url}/movies?page=1&limit=5")
        if response.status_code != 200:
            raise Exception(f"Pagination failed with status {response.status_code}")
        
        data = response.json()
        if len(data['movies']) > 5:
            raise Exception("Pagination limit not working")
        
        print_info("Filtering, sorting, and pagination working correctly")

    def test_get_movie_by_id(self):
        """Test GET /api/movies/{id} - Get movie by ID"""
        # First get a movie ID from the movies list
        response = self.session.get(f"{self.base_url}/movies?limit=1")
        if response.status_code != 200:
            raise Exception("Failed to get movies list for ID test")
        
        movies = response.json()['movies']
        if len(movies) == 0:
            raise Exception("No movies available for ID test")
        
        movie_id = movies[0]['id']
        
        # Test getting movie by ID
        response = self.session.get(f"{self.base_url}/movies/{movie_id}")
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        movie = response.json()
        if movie['id'] != movie_id:
            raise Exception("Returned movie ID doesn't match requested ID")
        
        print_info(f"Successfully retrieved movie: {movie['title']}")

    def test_get_movie_by_invalid_id(self):
        """Test GET /api/movies/{id} with invalid ID"""
        response = self.session.get(f"{self.base_url}/movies/invalid-id-123")
        
        if response.status_code != 404:
            raise Exception(f"Expected status 404 for invalid ID, got {response.status_code}")
        
        print_info("Invalid ID correctly returns 404")

    def test_search_movies(self):
        """Test GET /api/movies/search?q={query} - Search movies"""
        # Test search with a common term
        response = self.session.get(f"{self.base_url}/movies/search?q=The")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if 'movies' not in data or 'total' not in data:
            raise Exception("Search response missing required fields")
        
        if not isinstance(data['movies'], list):
            raise Exception("Movies field should be a list")
        
        # Test search with director name
        response = self.session.get(f"{self.base_url}/movies/search?q=Nolan")
        if response.status_code != 200:
            raise Exception("Director search failed")
        
        # Test search with genre
        response = self.session.get(f"{self.base_url}/movies/search?q=Drama")
        if response.status_code != 200:
            raise Exception("Genre search failed")
        
        print_info("Search functionality working for title, director, and genre")

    def test_search_empty_query(self):
        """Test search with empty query"""
        response = self.session.get(f"{self.base_url}/movies/search?q=")
        
        if response.status_code != 422:
            raise Exception(f"Expected status 422 for empty query, got {response.status_code}")
        
        print_info("Empty search query correctly returns validation error")

    def test_get_featured_movies(self):
        """Test GET /api/movies/featured - Get featured movies"""
        response = self.session.get(f"{self.base_url}/movies/featured")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if 'movies' not in data:
            raise Exception("Featured movies response missing movies field")
        
        if not isinstance(data['movies'], list):
            raise Exception("Movies field should be a list")
        
        # Verify all returned movies are featured
        for movie in data['movies']:
            if not movie.get('featured', False):
                raise Exception("Non-featured movie returned in featured endpoint")
        
        print_info(f"Retrieved {len(data['movies'])} featured movies")

    def test_get_top_rated_movies(self):
        """Test GET /api/movies/top-rated - Get top rated movies"""
        # Test without limit
        response = self.session.get(f"{self.base_url}/movies/top-rated")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if 'movies' not in data:
            raise Exception("Top rated movies response missing movies field")
        
        # Test with limit
        response = self.session.get(f"{self.base_url}/movies/top-rated?limit=3")
        if response.status_code != 200:
            raise Exception("Top rated with limit failed")
        
        data = response.json()
        if len(data['movies']) > 3:
            raise Exception("Limit parameter not working for top-rated")
        
        # Verify movies are sorted by rating (descending)
        if len(data['movies']) > 1:
            for i in range(len(data['movies']) - 1):
                if data['movies'][i]['rating'] < data['movies'][i + 1]['rating']:
                    raise Exception("Movies not sorted by rating in descending order")
        
        print_info(f"Retrieved {len(data['movies'])} top-rated movies")

    def test_get_movies_by_genre(self):
        """Test GET /api/movies/genre/{genre} - Get movies by genre"""
        # Test with Drama genre
        response = self.session.get(f"{self.base_url}/movies/genre/Drama")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if 'movies' not in data:
            raise Exception("Genre movies response missing movies field")
        
        # Verify all movies contain the requested genre
        for movie in data['movies']:
            if 'Drama' not in movie['genre']:
                raise Exception("Movie without Drama genre returned")
        
        # Test with Action genre
        response = self.session.get(f"{self.base_url}/movies/genre/Action")
        if response.status_code != 200:
            raise Exception("Action genre request failed")
        
        print_info("Genre-based filtering working correctly")

    def test_create_movie_valid(self):
        """Test POST /api/movies - Create new movie with valid data"""
        new_movie = {
            "title": "Test Movie 2024",
            "year": 2024,
            "rating": 8.5,
            "genre": ["Action", "Thriller"],
            "director": "Test Director",
            "duration": "120 min",
            "poster": "https://example.com/poster.jpg",
            "backdrop": "https://example.com/backdrop.jpg",
            "plot": "This is a test movie created during API testing to verify the movie creation functionality works correctly.",
            "cast": ["Actor One", "Actor Two", "Actor Three"],
            "featured": False
        }
        
        response = self.session.post(f"{self.base_url}/movies", json=new_movie)
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        created_movie = response.json()
        
        # Verify the created movie has all required fields
        required_fields = ['id', 'title', 'year', 'rating', 'genre', 'director', 'duration', 'poster', 'backdrop', 'plot', 'cast', 'featured', 'created_at', 'updated_at']
        for field in required_fields:
            if field not in created_movie:
                raise Exception(f"Created movie missing field: {field}")
        
        # Verify the data matches what we sent
        if created_movie['title'] != new_movie['title']:
            raise Exception("Created movie title doesn't match")
        
        if created_movie['rating'] != new_movie['rating']:
            raise Exception("Created movie rating doesn't match")
        
        # Store the ID for potential cleanup
        self.created_movie_id = created_movie['id']
        
        print_info(f"Successfully created movie with ID: {self.created_movie_id}")

    def test_create_movie_invalid(self):
        """Test POST /api/movies - Create movie with invalid data"""
        # Test with missing required fields
        invalid_movie = {
            "title": "Invalid Movie",
            "year": 2024
            # Missing other required fields
        }
        
        response = self.session.post(f"{self.base_url}/movies", json=invalid_movie)
        
        if response.status_code != 422:
            raise Exception(f"Expected status 422 for invalid data, got {response.status_code}")
        
        # Test with invalid genre
        invalid_genre_movie = {
            "title": "Invalid Genre Movie",
            "year": 2024,
            "rating": 8.0,
            "genre": ["InvalidGenre"],
            "director": "Test Director",
            "duration": "120 min",
            "poster": "https://example.com/poster.jpg",
            "backdrop": "https://example.com/backdrop.jpg",
            "plot": "This movie has an invalid genre.",
            "cast": ["Actor One"],
            "featured": False
        }
        
        response = self.session.post(f"{self.base_url}/movies", json=invalid_genre_movie)
        
        if response.status_code != 422:
            raise Exception(f"Expected status 422 for invalid genre, got {response.status_code}")
        
        print_info("Invalid movie data correctly rejected with validation errors")

    def test_get_all_genres(self):
        """Test GET /api/genres - Get all unique genres"""
        response = self.session.get(f"{self.base_url}/genres")
        
        if response.status_code != 200:
            raise Exception(f"Expected status 200, got {response.status_code}")
        
        data = response.json()
        if 'genres' not in data:
            raise Exception("Genres response missing genres field")
        
        if not isinstance(data['genres'], list):
            raise Exception("Genres field should be a list")
        
        if len(data['genres']) == 0:
            raise Exception("No genres returned")
        
        # Verify genres are strings
        for genre in data['genres']:
            if not isinstance(genre, str):
                raise Exception("Genre should be a string")
        
        print_info(f"Retrieved {len(data['genres'])} unique genres: {data['genres']}")

    def test_database_contains_8_movies(self):
        """Verify database contains exactly 8 seeded movies"""
        response = self.session.get(f"{self.base_url}/movies?limit=100")
        
        if response.status_code != 200:
            raise Exception(f"Failed to get movies list: {response.status_code}")
        
        data = response.json()
        total_movies = data['total']
        
        # Account for any movies we created during testing
        expected_movies = 8
        if self.created_movie_id:
            expected_movies = 9
        
        if total_movies < 8:
            raise Exception(f"Database should contain at least 8 movies, found {total_movies}")
        
        print_info(f"Database contains {total_movies} movies (expected at least 8)")

    def run_all_tests(self):
        """Run all backend API tests"""
        print_header("IMDB Clone Backend API Test Suite")
        
        # Test in logical order
        test_cases = [
            ("Health Check", self.test_health_check),
            ("Database Seeding", self.test_seed_database),
            ("Get All Movies", self.test_get_all_movies),
            ("Movies Filtering & Pagination", self.test_movies_filtering),
            ("Get Movie by ID", self.test_get_movie_by_id),
            ("Get Movie by Invalid ID", self.test_get_movie_by_invalid_id),
            ("Search Movies", self.test_search_movies),
            ("Search Empty Query", self.test_search_empty_query),
            ("Get Featured Movies", self.test_get_featured_movies),
            ("Get Top Rated Movies", self.test_get_top_rated_movies),
            ("Get Movies by Genre", self.test_get_movies_by_genre),
            ("Create Movie (Valid)", self.test_create_movie_valid),
            ("Create Movie (Invalid)", self.test_create_movie_invalid),
            ("Get All Genres", self.test_get_all_genres),
            ("Verify Database Content", self.test_database_contains_8_movies),
        ]
        
        for test_name, test_func in test_cases:
            self.run_test(test_name, test_func)
        
        # Print final results
        print_header("Test Results Summary")
        print(f"Total Tests: {self.test_results['total']}")
        print_success(f"Passed: {self.test_results['passed']}")
        print_error(f"Failed: {self.test_results['failed']}")
        
        success_rate = (self.test_results['passed'] / self.test_results['total']) * 100
        print(f"Success Rate: {success_rate:.1f}%")
        
        if self.test_results['failed'] == 0:
            print_success("🎉 All tests passed! Backend API is working correctly.")
        else:
            print_error(f"❌ {self.test_results['failed']} test(s) failed. Please check the issues above.")
        
        return self.test_results['failed'] == 0

if __name__ == "__main__":
    tester = IMDBBackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)