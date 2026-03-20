const MovieCard = ({ movie, onEdit, onDelete }) => {
    const statusColor = {
        watched: '#2ecc71',
        watching: '#f39c12',
        unwatched: '#e74c3c',
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < rating ? '#f1c40f' : '#555', fontSize: '16px' }}>
                ★
            </span>
        ));
    };

    return (
        <div style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            cursor: 'pointer',
        }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <img
                src={movie.poster_url}
                alt={movie.title}
                style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                onError={e => e.target.src = 'https://via.placeholder.com/300x280?text=No+Poster'}
            />
            <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{movie.title}</h3>
                <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '8px' }}>
                    {movie.genre} • {movie.release_year}
                </p>
                <p style={{ color: '#ccc', fontSize: '13px', marginBottom: '10px', lineHeight: '1.4' }}>
                    {movie.description.length > 80
                        ? movie.description.substring(0, 80) + '...'
                        : movie.description}
                </p>
                <div style={{ marginBottom: '10px' }}>{renderStars(movie.rating)}</div>
                <span style={{
                    background: statusColor[movie.status],
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    textTransform: 'capitalize',
                }}>
                    {movie.status}
                </span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button
                        onClick={() => onEdit(movie)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}>
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(movie.id)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: '#e50914',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;