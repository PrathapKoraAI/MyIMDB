import React from 'react';
import { Star, Trophy } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useTopRatedMovies } from '../hooks/useMovies';

const TopRated = () => {
  const { topRatedMovies, loading, error } = useTopRatedMovies();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading top rated movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <ErrorMessage error={error} title="Failed to load top rated movies" showRetry={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">Top Rated Movies</h1>
        </div>
        
        {/* Description */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Highest Rated Films</h2>
          </div>
          <p className="text-gray-400">
            Discover the highest-rated movies of all time, ranked by our community ratings and critical acclaim.
          </p>
        </div>
        
        {/* Top 3 Movies Highlight */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Top 3 Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRatedMovies.slice(0, 3).map((movie, index) => (
              <div key={movie.id} className="relative">
                <div className="absolute -top-2 -left-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-400 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    'bg-amber-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <MovieCard movie={movie} size="large" />
              </div>
            ))}
          </div>
        </section>
        
        {/* All Top Rated Movies */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">All Top Rated</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topRatedMovies.map((movie, index) => (
              <div key={movie.id} className="relative">
                {index < 10 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-black bg-opacity-70 text-yellow-400 px-2 py-1 rounded text-sm font-bold">
                      #{index + 1}
                    </div>
                  </div>
                )}
                <MovieCard movie={movie} size="medium" />
              </div>
            ))}
          </div>
        </section>
        
        {/* Rating Info */}
        <div className="mt-16 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">About Our Ratings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Rating Scale</h4>
              <p>Our ratings are based on a 10-point scale, where 10 represents a masterpiece and 1 represents a poor film.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Community Driven</h4>
              <p>Ratings are calculated from thousands of user reviews and professional critic scores to provide the most accurate representation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRated;