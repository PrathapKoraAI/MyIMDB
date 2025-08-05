import React from 'react';
import { Play, Info, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const HeroSection = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full mr-4">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="font-bold">{movie.rating}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{movie.year}</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              {movie.title}
            </h1>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((genre, index) => (
                <Badge key={index} variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-700">
                  {genre}
                </Badge>
              ))}
            </div>
            
            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl">
              {movie.plot}
            </p>
            
            {/* Director */}
            <p className="text-gray-400 mb-8">
              <span className="text-gray-500">Directed by</span>{' '}
              <span className="text-white font-semibold">{movie.director}</span>
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-3">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Watch Trailer
              </Button>
              <Link to={`/movie/${movie.id}`}>
                <Button variant="outline" size="lg" className="border-gray-400 text-white hover:bg-white hover:text-black font-bold px-8 py-3">
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;