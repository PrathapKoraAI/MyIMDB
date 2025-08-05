import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Film } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { searchMovies } from '../data/mockMovies';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Simulate search delay
      setTimeout(() => {
        const searchResults = searchMovies(query);
        setResults(searchResults);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center text-white">
          <Search className="w-6 h-6 mr-2 animate-spin" />
          Searching movies...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Search className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Search Results</h1>
          </div>
          
          {query && (
            <p className="text-gray-400 text-lg">
              Results for "<span className="text-white font-semibold">{query}</span>"
            </p>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found {results.length} movie{results.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} size="medium" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {query ? 'No movies found' : 'Start searching'}
            </h3>
            <p className="text-gray-500">
              {query 
                ? 'Try different keywords or browse our movie collection' 
                : 'Enter a movie title, genre, or director to find movies'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;