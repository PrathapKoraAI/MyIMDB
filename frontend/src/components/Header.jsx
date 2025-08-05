import React, { useState } from 'react';
import { Search, Menu, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from './ui/input';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-yellow-400 text-black px-2 py-1 rounded font-bold text-lg">
              IMDb
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <Link to="/movies" className="hover:text-yellow-400 transition-colors">
              Movies
            </Link>
            <Link to="/genres" className="hover:text-yellow-400 transition-colors">
              Genres
            </Link>
            <Link to="/top-rated" className="hover:text-yellow-400 transition-colors flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Top Rated
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 pt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className="hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/genres" 
                className="hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Genres
              </Link>
              <Link 
                to="/top-rated" 
                className="hover:text-yellow-400 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-4 h-4 mr-1" />
                Top Rated
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;