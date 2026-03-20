import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MovieForm from '../components/MovieForm';
import MovieList from '../components/MovieList';
import { getAllMovies, createMovie, updateMovie, deleteMovie } from '../api';

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [filter, setFilter] = useState({ status: '', genre: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { user, logout } = useAuth();
    const { colors, isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const res = await getAllMovies();
            setMovies(res.data.data);
        } catch (err) {
            setError('Failed to fetch movies.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleSubmit = async (data) => {
        try {
            if (editingMovie) {
                await updateMovie(editingMovie.id, data);
            } else {
                await createMovie(data);
            }
            setEditingMovie(null);
            setShowForm(false);
            fetchMovies();
        } catch (err) {
            setError('Failed to save movie.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;
        try {
            await deleteMovie(id);
            fetchMovies();
        } catch (err) {
            setError('Failed to delete movie.');
        }
    };

    const handleEdit = (movie) => {
        setEditingMovie(movie);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: colors.background,
            color: colors.text,
            transition: 'all 0.3s ease',
        }}>
            {/* Navbar */}
            <nav style={{
                background: colors.surface,
                borderBottom: `1px solid ${colors.border}`,
                padding: '0 32px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <div style={{
                    background: '#e50914',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    letterSpacing: '1px',
                }}>
                    WATCHLIST
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/stats')}
                        style={{
                            padding: '7px 16px',
                            background: 'transparent',
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}>
                        Stats
                    </button>
                    <button
                        onClick={toggleTheme}
                        style={{
                            padding: '7px 16px',
                            background: 'transparent',
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}>
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <span style={{ color: colors.textMuted, fontSize: '14px' }}>
                        {user?.username}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '7px 16px',
                            background: '#e50914',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}>
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
                {error && (
                    <div style={{
                        background: 'rgba(229,9,20,0.1)',
                        border: '1px solid rgba(229,9,20,0.4)',
                        color: '#ff6b6b',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>
                        {error}
                        <span onClick={() => setError(null)} style={{ float: 'right', cursor: 'pointer' }}>x</span>
                    </div>
                )}

                {/* Add Movie Button */}
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '10px 24px',
                            background: '#e50914',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                        }}>
                        + Add Movie
                    </button>
                )}

                {showForm && (
                    <MovieForm
                        onSubmit={handleSubmit}
                        editingMovie={editingMovie}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingMovie(null);
                        }}
                    />
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: colors.textMuted }}>
                        Loading movies...
                    </div>
                ) : (
                    <MovieList
                        movies={movies}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        filter={filter}
                        setFilter={setFilter}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;