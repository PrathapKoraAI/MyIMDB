import { useState, useEffect } from 'react';
import { moviesApi } from '../services/api';

export const useMovies = (params = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 20,
    total_pages: 0
  });

  const fetchMovies = async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await moviesApi.getMovies({ ...params, ...customParams });
      
      setMovies(response.movies || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        per_page: response.per_page || 20,
        total_pages: response.total_pages || 0
      });
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const refetch = (newParams = {}) => {
    fetchMovies(newParams);
  };

  return {
    movies,
    loading,
    error,
    pagination,
    refetch
  };
};

export const useMovie = (id) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await moviesApi.getMovieById(id);
        setMovie(response);
      } catch (err) {
        setError(err.message);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  return { movie, loading, error };
};

export const useFeaturedMovies = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await moviesApi.getFeaturedMovies();
        setFeaturedMovies(response.movies || []);
      } catch (err) {
        setError(err.message);
        setFeaturedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  return { featuredMovies, loading, error };
};

export const useTopRatedMovies = (limit = 20) => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await moviesApi.getTopRatedMovies(limit);
        setTopRatedMovies(response.movies || []);
      } catch (err) {
        setError(err.message);
        setTopRatedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, [limit]);

  return { topRatedMovies, loading, error };
};

export const useMovieSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await moviesApi.searchMovies(query);
      setSearchResults(response.movies || []);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, loading, error, searchMovies };
};