export const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    genre: ["Drama"],
    director: "Frank Darabont",
    duration: "142 min",
    poster: "https://images.unsplash.com/photo-1489599833883-0a2c073c5fd4?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&h=600&fit=crop",
    plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    featured: true
  },
  {
    id: 2,
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    genre: ["Crime", "Drama"],
    director: "Francis Ford Coppola",
    duration: "175 min",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"],
    featured: true
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    duration: "152 min",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    featured: true
  },
  {
    id: 4,
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    genre: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    duration: "154 min",
    poster: "https://images.unsplash.com/photo-1489599833883-0a2c073c5fd4?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis"],
    featured: false
  },
  {
    id: 5,
    title: "Forrest Gump",
    year: 1994,
    rating: 8.8,
    genre: ["Drama", "Romance"],
    director: "Robert Zemeckis",
    duration: "142 min",
    poster: "https://images.unsplash.com/photo-1489599833883-0a2c073c5fd4?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
    featured: false
  },
  {
    id: 6,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    genre: ["Action", "Sci-Fi", "Thriller"],
    director: "Christopher Nolan",
    duration: "148 min",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy", "Ellen Page"],
    featured: false
  },
  {
    id: 7,
    title: "The Matrix",
    year: 1999,
    rating: 8.7,
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski, Lilly Wachowski",
    duration: "136 min",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=600&fit=crop",
    plot: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
    featured: false
  },
  {
    id: 8,
    title: "Goodfellas",
    year: 1990,
    rating: 8.7,
    genre: ["Biography", "Crime", "Drama"],
    director: "Martin Scorsese",
    duration: "146 min",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci", "Lorraine Bracco"],
    featured: false
  }
];

export const genres = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", 
  "Music", "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western"
];

export const getFeaturedMovies = () => mockMovies.filter(movie => movie.featured);
export const getPopularMovies = () => mockMovies.slice(0, 6);
export const getMovieById = (id) => mockMovies.find(movie => movie.id === parseInt(id));
export const searchMovies = (query) => mockMovies.filter(movie => 
  movie.title.toLowerCase().includes(query.toLowerCase()) ||
  movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
  movie.director.toLowerCase().includes(query.toLowerCase())
);
export const getMoviesByGenre = (genre) => mockMovies.filter(movie => 
  movie.genre.includes(genre)
);