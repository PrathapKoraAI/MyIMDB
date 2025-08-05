import React, { useState, useEffect } from 'react';
import { Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { genresApi, moviesApi } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movieCounts, setMovieCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [genreMoviesLoading, setGenreMoviesLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch genres and movie counts on component mount
  useEffect(() => {
    const fetchGenresAndCounts = async () => {
      try {
        setLoading(true);
        
        // Fetch genres
        const genresResponse = await genresApi.getGenres();
        const genresList = genresResponse.genres || [];
        setGenres(genresList);
        
        // Fetch movie counts for each genre
        const counts = {};
        await Promise.all(
          genresList.map(async (genre) => {
            try {
              const response = await moviesApi.getMoviesByGenre(genre);
              counts[genre] = response.movies?.length || 0;
            } catch (err) {
              counts[genre] = 0;
            }
          })
        );
        setMovieCounts(counts);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenresAndCounts();
  }, []);

  const handleGenreClick = async (genre) => {
    try {
      setGenreMoviesLoading(true);
      setSelectedGenre(genre);
      
      const response = await moviesApi.getMoviesByGenre(genre);
      setGenreMovies(response.movies || []);
    } catch (err) {
      setError(err.message);
      setGenreMovies([]);
    } finally {
      setGenreMoviesLoading(false);
    }
  };

  const genreColors = [
    'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600',
    'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600',
    'bg-orange-600', 'bg-gray-600', 'bg-emerald-600', 'bg-violet-600',
    'bg-cyan-600', 'bg-rose-600', 'bg-amber-600', 'bg-lime-600',
    'bg-sky-600', 'bg-fuchsia-600', 'bg-slate-600', 'bg-stone-600'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading genres..." />
      </div>
    );
  }

  if (error && !selectedGenre) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <ErrorMessage error={error} title="Failed to load genres" showRetry={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Tag className="w-8 h-8 text-yellow-400 mr-3" />
          <h1 className="text-4xl font-bold text-white">Browse by Genre</h1>
        </div>
        
        {!selectedGenre ? (
          <>
            {/* Genre Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {genres.map((genre, index) => (
                <Card
                  key={genre}
                  className="cursor-pointer transform hover:scale-105 transition-all duration-300 bg-gray-800 border-gray-700 hover:border-yellow-400 overflow-hidden"
                  onClick={() => handleGenreClick(genre)}
                >
                  <CardContent className="p-0">
                    <div className={`${genreColors[index % genreColors.length]} h-24 flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-black bg-opacity-40" />
                      <Tag className="w-8 h-8 text-white relative z-10" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-center mb-1">{genre}</h3>
                      <p className="text-gray-400 text-sm text-center">
                        {movieCounts[genre] || 0} movies
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Popular Genres Highlight */}
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-white mb-6">Popular Genres</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Action', 'Drama', 'Crime'].filter(genre => genres.includes(genre)).map((genre, index) => (
                  <Card
                    key={genre}
                    className="cursor-pointer bg-gray-800 border-gray-700 hover:border-yellow-400 transition-colors"
                    onClick={() => handleGenreClick(genre)}
                  >
                    <CardContent className="p-6">
                      <div className={`${genreColors[index]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{genre}</h3>
                      <p className="text-gray-400 mb-4">
                        {movieCounts[genre] || 0} movies available
                      </p>
                      <div className="flex items-center text-yellow-400 hover:text-yellow-300">
                        <span>Browse {genre}</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Selected Genre Movies */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setSelectedGenre(null)}
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Back to Genres
              </Button>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedGenre} Movies</h2>
              <p className="text-gray-400">
                {genreMovies.length} movie{genreMovies.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {genreMoviesLoading ? (
              <LoadingSpinner message={`Loading ${selectedGenre} movies...`} />
            ) : error ? (
              <ErrorMessage error={error} onRetry={() => handleGenreClick(selectedGenre)} />
            ) : genreMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {genreMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size="medium" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
                <p className="text-gray-500">No movies available in this genre yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Genres;