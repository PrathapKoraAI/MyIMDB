import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Star } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useFeaturedMovies, useMovies } from '../hooks/useMovies';
import { Button } from '../components/ui/button';

const Home = () => {
  const { featuredMovies, loading: featuredLoading, error: featuredError } = useFeaturedMovies();
  const { movies: popularMovies, loading: popularLoading, error: popularError, refetch } = useMovies({ limit: 6 });
  
  const heroMovie = featuredMovies.length > 0 ? featuredMovies[0] : null;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      {featuredLoading ? (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner size="large" message="Loading featured movies..." />
        </div>
      ) : featuredError ? (
        <div className="h-screen flex items-center justify-center">
          <ErrorMessage error={featuredError} showRetry={false} />
        </div>
      ) : (
        heroMovie && <HeroSection movie={heroMovie} />
      )}
      
      {/* Featured Movies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Star className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
            </div>
            <Link to="/movies">
              <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {featuredLoading ? (
            <LoadingSpinner message="Loading featured movies..." />
          ) : featuredError ? (
            <ErrorMessage error={featuredError} showRetry={false} />
          ) : featuredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="medium" />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No featured movies available</p>
          )}
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-3xl font-bold text-white">Popular Movies</h2>
            </div>
            <Link to="/top-rated">
              <Button variant="ghost" className="text-yellow-400 hover:text-yellow-300">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {popularLoading ? (
            <LoadingSpinner message="Loading popular movies..." />
          ) : popularError ? (
            <ErrorMessage error={popularError} onRetry={refetch} />
          ) : popularMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="small" />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No popular movies available</p>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors">
              <h3 className="text-4xl font-bold text-yellow-400 mb-2">10,000+</h3>
              <p className="text-gray-300 text-lg">Movies in Database</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors">
              <h3 className="text-4xl font-bold text-yellow-400 mb-2">500,000+</h3>
              <p className="text-gray-300 text-lg">User Reviews</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 hover:bg-gray-700 transition-colors">
              <h3 className="text-4xl font-bold text-yellow-400 mb-2">1M+</h3>
              <p className="text-gray-300 text-lg">Monthly Visitors</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;