import React, { useState } from 'react';

export default function Registration({ onRegisterSuccess, onGoToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanUsername = username.trim();

        if (!cleanUsername || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (cleanUsername.length < 3) {
            setError('Username must be at least 3 characters.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: cleanUsername, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed.');
                return;
            }

            // Successfully registered, log in or notify success
            if (onRegisterSuccess) {
                onRegisterSuccess(cleanUsername);
            }
        } catch (err) {
            setError('Unable to connect to the authentication server.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body" style={{ width: '100vw', height: '100vh', margin: 0 }}>
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <i className="fa-solid fa-helmet-safety"></i>
                    </div>
                    <h1 className="login-title">DAB Enterprise LTD</h1>
                    <p className="login-subtitle">Sales Record Management System</p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="reg-username" className="form-label">Username</label>
                        <div className="search-input-wrapper" style={{ minWidth: '100%' }}>
                            <i className="fa-solid fa-user"></i>
                            <input
                                type="text"
                                id="reg-username"
                                className="form-control"
                                placeholder="Choose a username (min 3 chars)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <label htmlFor="reg-password" className="form-label">Password</label>
                        <div className="search-input-wrapper" style={{ minWidth: '100%' }}>
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                id="reg-password"
                                className="form-control"
                                placeholder="Choose a password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
                        <div className="search-input-wrapper" style={{ minWidth: '100%' }}>
                            <i className="fa-solid fa-lock"></i>
                            <input
                                type="password"
                                id="reg-confirm"
                                className="form-control"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin"></i> Creating...</span>
                        ) : (
                            <span><i className="fa-solid fa-user-plus"></i> Register</span>
                        )}
                    </button>
                </form>

                {onGoToLogin && (
                    <div style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={onGoToLogin}
                            className="btn btn-link"
                            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
                            disabled={loading}
                        >
                            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '0.5rem' }} />
                            Back to Sign In
                        </button>
                    </div>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Kigali City, Rwanda &copy; 2026. All rights reserved.
                </div>
            </div>
        </div>
    );
}
