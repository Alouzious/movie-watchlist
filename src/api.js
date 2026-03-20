import axios from 'axios';

const API = axios.create({
    baseURL: 'https://movie-watchlist-api-iza9.onrender.com',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Movies
export const getAllMovies = () => API.get('/movies');
export const getMovieById = (id) => API.get(`/movies/${id}`);
export const createMovie = (data) => API.post('/movies', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// TMDB Search
export const searchTMDB = async (query) => {
    const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
    );
    return res.data.results;
};