import React from 'react';
import { Star, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const MovieCard = ({ movie, size = 'medium' }) => {
  const cardSizes = {
    small: 'w-48',
    medium: 'w-64',
    large: 'w-80'
  };

  const posterHeights = {
    small: 'h-72',
    medium: 'h-96',
    large: 'h-[28rem]'
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <Card className={`${cardSizes[size]} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gray-900 border-gray-700 overflow-hidden`}>
        <div className="relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className={`w-full ${posterHeights[size]} object-cover group-hover:opacity-90 transition-opacity`}
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2">
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-semibold">{movie.rating}</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4 text-white">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center text-gray-400 text-sm mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="mr-3">{movie.year}</span>
            <Clock className="w-4 h-4 mr-1" />
            <span>{movie.duration}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genre.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                {genre}
              </Badge>
            ))}
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {movie.plot}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;