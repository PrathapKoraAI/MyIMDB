import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Movie API functions
export const moviesApi = {
  // Get all movies with filtering and pagination
  getMovies: async (params = {}) => {
    try {
      const response = await apiClient.get('/movies', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch movies');
    }
  },

  // Get movie by ID
  getMovieById: async (id) => {
    try {
      const response = await apiClient.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Movie not found');
      }
      throw new Error(error.response?.data?.detail || 'Failed to fetch movie');
    }
  },

  // Search movies
  searchMovies: async (query) => {
    try {
      const response = await apiClient.get('/movies/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to search movies');
    }
  },

  // Get featured movies
  getFeaturedMovies: async () => {
    try {
      const response = await apiClient.get('/movies/featured');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch featured movies');
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (limit = 20) => {
    try {
      const response = await apiClient.get('/movies/top-rated', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch top rated movies');
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genre) => {
    try {
      const response = await apiClient.get(`/movies/genre/${genre}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch movies by genre');
    }
  },

  // Create new movie
  createMovie: async (movieData) => {
    try {
      const response = await apiClient.post('/movies', movieData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create movie');
    }
  }
};

// Genres API functions
export const genresApi = {
  // Get all genres
  getGenres: async () => {
    try {
      const response = await apiClient.get('/genres');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch genres');
    }
  }
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.detail || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default apiClient;