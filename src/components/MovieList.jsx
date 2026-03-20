import MovieCard from './MovieCard';

const MovieList = ({ movies, onEdit, onDelete, filter, setFilter }) => {
    const genres = [...new Set(movies.map(m => m.genre))];

    const filtered = movies.filter(movie => {
        if (filter.status && movie.status !== filter.status) return false;
        if (filter.genre && movie.genre !== filter.genre) return false;
        return true;
    });

    const selectStyle = {
        padding: '8px 14px',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '13px',
        cursor: 'pointer',
        outline: 'none',
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <h2 style={{ fontSize: '20px' }}>
                    My Watchlist
                    <span style={{ color: '#aaa', fontSize: '14px', marginLeft: '10px' }}>
                        ({filtered.length} movies)
                    </span>
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                        style={selectStyle}
                        value={filter.status}
                        onChange={e => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="watched">Watched</option>
                        <option value="watching">Watching</option>
                        <option value="unwatched">Unwatched</option>
                    </select>
                    <select
                        style={selectStyle}
                        value={filter.genre}
                        onChange={e => setFilter({ ...filter, genre: e.target.value })}
                    >
                        <option value="">All Genres</option>
                        {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px',
                    color: '#555',
                    fontSize: '16px',
                }}>
                    No movies found. Add your first movie above!
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                }}>
                    {filtered.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieList;