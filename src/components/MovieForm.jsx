import { useState, useEffect } from 'react';
import { searchTMDB } from '../api';
import { useTheme } from '../context/ThemeContext';

const MovieForm = ({ onSubmit, editingMovie, onCancel }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        genre: '',
        release_year: '',
        poster_url: '',
        rating: 1,
        status: 'unwatched',
    });
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        if (editingMovie) setForm(editingMovie);
    }, [editingMovie]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSearch = async () => {
        if (!search.trim()) return;
        setSearching(true);
        try {
            const results = await searchTMDB(search);
            setSearchResults(results.slice(0, 5));
        } catch (err) {
            console.error('TMDB search failed');
        } finally {
            setSearching(false);
        }
    };

    const handleSelectMovie = (movie) => {
        setForm({
            title: movie.title,
            description: movie.overview || '',
            genre: '',
            release_year: movie.release_date
                ? parseInt(movie.release_date.split('-')[0])
                : '',
            poster_url: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '',
            rating: 1,
            status: 'unwatched',
        });
        setSearchResults([]);
        setSearch('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...form,
            release_year: parseInt(form.release_year),
            rating: parseInt(form.rating),
        });
        setForm({
            title: '',
            description: '',
            genre: '',
            release_year: '',
            poster_url: '',
            rating: 1,
            status: 'unwatched',
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        background: colors.surface2,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        color: colors.text,
        fontSize: '14px',
        outline: 'none',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        color: colors.textMuted,
        fontSize: '13px',
    };

    return (
        <div style={{
            background: colors.surface,
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '32px',
            border: `1px solid ${colors.border}`,
        }}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', color: colors.text }}>
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
            </h2>

            {/* TMDB Search */}
            {!editingMovie && (
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>Search from TMDB (auto-fill details)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            style={{ ...inputStyle, flex: 1 }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder="Search for a movie..."
                        />
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={searching}
                            style={{
                                padding: '10px 20px',
                                background: '#e50914',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                            }}>
                            {searching ? '...' : 'Search'}
                        </button>
                    </div>

                    {searchResults.length > 0 && (
                        <div style={{
                            background: colors.surface2,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            marginTop: '8px',
                            overflow: 'hidden',
                        }}>
                            {searchResults.map(movie => (
                                <div
                                    key={movie.id}
                                    onClick={() => handleSelectMovie(movie)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        cursor: 'pointer',
                                        borderBottom: `1px solid ${colors.border}`,
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = colors.border}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {movie.poster_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                            alt={movie.title}
                                            style={{ width: '36px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                    <div>
                                        <div style={{ fontSize: '14px', color: colors.text }}>{movie.title}</div>
                                        <div style={{ fontSize: '12px', color: colors.textMuted }}>
                                            {movie.release_date?.split('-')[0]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Title</label>
                        <input style={inputStyle} name="title" value={form.title} onChange={handleChange} placeholder="Movie title" required />
                    </div>
                    <div>
                        <label style={labelStyle}>Genre</label>
                        <input style={inputStyle} name="genre" value={form.genre} onChange={handleChange} placeholder="e.g. Sci-Fi, Action" required />
                    </div>
                    <div>
                        <label style={labelStyle}>Release Year</label>
                        <input style={inputStyle} name="release_year" value={form.release_year} onChange={handleChange} placeholder="e.g. 2024" type="number" required />
                    </div>
                    <div>
                        <label style={labelStyle}>Poster URL</label>
                        <input style={inputStyle} name="poster_url" value={form.poster_url} onChange={handleChange} placeholder="https://..." required />
                    </div>
                    <div>
                        <label style={labelStyle}>Rating (1-5)</label>
                        <select style={inputStyle} name="rating" value={form.rating} onChange={handleChange}>
                            {[1, 2, 3, 4, 5].map(r => (
                                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Status</label>
                        <select style={inputStyle} name="status" value={form.status} onChange={handleChange}>
                            <option value="unwatched">Unwatched</option>
                            <option value="watching">Watching</option>
                            <option value="watched">Watched</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                        style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Movie description"
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 24px',
                            background: '#e50914',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}>
                        {editingMovie ? 'Update Movie' : 'Add Movie'}
                    </button>
                    {editingMovie && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                padding: '10px 24px',
                                background: colors.surface2,
                                color: colors.text,
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default MovieForm;