import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getAllMovies } from '../api';

const Stats = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { colors, isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        getAllMovies().then(res => {
            setMovies(res.data.data);
            setLoading(false);
        });
    }, []);

    const total = movies.length;
    const watched = movies.filter(m => m.status === 'watched').length;
    const watching = movies.filter(m => m.status === 'watching').length;
    const unwatched = movies.filter(m => m.status === 'unwatched').length;
    const avgRating = total > 0
        ? (movies.reduce((sum, m) => sum + m.rating, 0) / total).toFixed(1)
        : 0;

    const genreCounts = movies.reduce((acc, m) => {
        acc[m.genre] = (acc[m.genre] || 0) + 1;
        return acc;
    }, {});

    const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const statCard = (label, value, color) => (
        <div style={{
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            borderTop: `3px solid ${color}`,
        }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color }}>{value}</div>
            <div style={{ color: colors.textMuted, fontSize: '14px', marginTop: '6px' }}>{label}</div>
        </div>
    );

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
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '7px 16px',
                            background: 'transparent',
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '13px',
                        }}>
                        Back to Dashboard
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
                </div>
            </nav>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '32px' }}>Your Watchlist Stats</h1>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: colors.textMuted }}>
                        Loading stats...
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '16px',
                            marginBottom: '40px',
                        }}>
                            {statCard('Total Movies', total, '#e50914')}
                            {statCard('Watched', watched, '#2ecc71')}
                            {statCard('Watching', watching, '#f39c12')}
                            {statCard('Unwatched', unwatched, '#e74c3c')}
                            {statCard('Avg Rating', `${avgRating}★`, '#f1c40f')}
                        </div>

                        {/* Genre Breakdown */}
                        <div style={{
                            background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '12px',
                            padding: '24px',
                            marginBottom: '24px',
                        }}>
                            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Top Genres</h2>
                            {topGenres.length === 0 ? (
                                <p style={{ color: colors.textMuted }}>No data yet.</p>
                            ) : (
                                topGenres.map(([genre, count]) => (
                                    <div key={genre} style={{ marginBottom: '14px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '6px',
                                            fontSize: '14px',
                                        }}>
                                            <span>{genre}</span>
                                            <span style={{ color: colors.textMuted }}>{count} movies</span>
                                        </div>
                                        <div style={{
                                            background: colors.surface2,
                                            borderRadius: '4px',
                                            height: '8px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                width: `${(count / total) * 100}%`,
                                                background: '#e50914',
                                                height: '100%',
                                                borderRadius: '4px',
                                                transition: 'width 0.5s ease',
                                            }} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Watch Progress */}
                        <div style={{
                            background: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '12px',
                            padding: '24px',
                        }}>
                            <h2 style={{ fontSize: '18px', marginBottom: '20px' }}>Watch Progress</h2>
                            <div style={{
                                display: 'flex',
                                height: '20px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                marginBottom: '16px',
                            }}>
                                <div style={{ width: `${(watched / total) * 100}%`, background: '#2ecc71' }} />
                                <div style={{ width: `${(watching / total) * 100}%`, background: '#f39c12' }} />
                                <div style={{ width: `${(unwatched / total) * 100}%`, background: '#e74c3c' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
                                <span style={{ color: '#2ecc71' }}>Watched {total > 0 ? Math.round((watched/total)*100) : 0}%</span>
                                <span style={{ color: '#f39c12' }}>Watching {total > 0 ? Math.round((watching/total)*100) : 0}%</span>
                                <span style={{ color: '#e74c3c' }}>Unwatched {total > 0 ? Math.round((unwatched/total)*100) : 0}%</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Stats;