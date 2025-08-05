import React, { useState } from 'react';
import { Film, Filter } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { mockMovies, genres } from '../data/mockMovies';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Movies = () => {
  const [filteredMovies, setFilteredMovies] = useState(mockMovies);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    if (genre === 'all') {
      setFilteredMovies(mockMovies);
    } else {
      setFilteredMovies(mockMovies.filter(movie => movie.genre.includes(genre)));
    }
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    const sorted = [...filteredMovies].sort((a, b) => {
      switch (criteria) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setFilteredMovies(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Film className="w-8 h-8 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">All Movies</h1>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-yellow-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <Select value={selectedGenre} onValueChange={handleGenreFilter}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-600">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="rating" className="text-white hover:bg-gray-600">Rating</SelectItem>
                  <SelectItem value="year" className="text-white hover:bg-gray-600">Year</SelectItem>
                  <SelectItem value="title" className="text-white hover:bg-gray-600">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size="medium" />
          ))}
        </div>
        
        {filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
            <Button 
              onClick={() => handleGenreFilter('all')} 
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;