import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Clock, User, ArrowLeft, Play } from 'lucide-react';
import { getMovieById } from '../data/mockMovies';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

const MovieDetail = () => {
  const { id } = useParams();
  const movie = getMovieById(id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-64 h-96 object-cover rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Movie Info */}
              <div className="flex-1 max-w-2xl">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span className="font-bold">{movie.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{movie.duration}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((genre, index) => (
                    <Badge key={index} variant="outline" className="border-gray-400 text-gray-300">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  {movie.plot}
                </p>
                
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-400">Director:</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{movie.director}</p>
                </div>
                
                <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8 py-3">
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cast Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {movie.cast.map((actor, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-white font-semibold">{actor}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieDetail;