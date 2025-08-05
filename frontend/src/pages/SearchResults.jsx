import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Film } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useMovieSearch } from '../hooks/useMovies';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchResults, loading, error, searchMovies } = useMovieSearch();

  useEffect(() => {
    if (query) {
      searchMovies(query);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" message="Searching movies..." />
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
            Found {searchResults.length} movie{searchResults.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <ErrorMessage error={error} onRetry={() => searchMovies(query)} />
          </div>
        )}
        
        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} size="medium" />
            ))}
          </div>
        ) : !loading && !error && (
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