import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login as loginAPI, register as registerAPI } from '../api';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { colors } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isRegister) {
                const res = await registerAPI(form);
                if (res.data.status === 'error') {
                    setError(res.data.message);
                    return;
                }
                setIsRegister(false);
                setError('');
                alert('Registration successful! Please login.');
            } else {
                const res = await loginAPI(form);
                if (res.data.status === 'error') {
                    setError(res.data.message);
                    return;
                }
                login({ username: res.data.username }, res.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        marginBottom: '16px',
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Animated background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a0a 50%, #0f0f0f 100%)',
                zIndex: 0,
            }} />
            <div style={{
                position: 'absolute',
                top: '-200px',
                left: '-200px',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite',
                zIndex: 0,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-200px',
                right: '-200px',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(229,9,20,0.1) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite 2s',
                zIndex: 0,
            }} />

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                input::placeholder { color: rgba(255,255,255,0.3); }
                input:focus { border-color: #e50914 !important; }
            `}</style>

            <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '420px',
                padding: '0 20px',
                animation: 'fadeIn 0.6s ease',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        display: 'inline-block',
                        background: '#e50914',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        letterSpacing: '2px',
                        marginBottom: '12px',
                    }}>
                        WATCHLIST
                    </div>
                    <p style={{ color: '#aaa', fontSize: '14px' }}>
                        Your personal cinema tracker
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                }}>
                    <h2 style={{
                        fontSize: '22px',
                        marginBottom: '24px',
                        color: '#fff',
                    }}>
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && (
                        <div style={{
                            background: 'rgba(229,9,20,0.15)',
                            border: '1px solid rgba(229,9,20,0.4)',
                            color: '#ff6b6b',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            fontSize: '13px',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                            Username
                        </label>
                        <input
                            style={inputStyle}
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                        <label style={{ color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                            Password
                        </label>
                        <input
                            style={inputStyle}
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '13px',
                                background: loading ? '#555' : '#e50914',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s',
                                marginTop: '4px',
                            }}>
                            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        color: '#aaa',
                        fontSize: '14px',
                    }}>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <span
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            style={{
                                color: '#e50914',
                                marginLeft: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}>
                            {isRegister ? 'Login' : 'Register'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;