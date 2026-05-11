import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, Zap, CheckCircle } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup({ name, email, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper flex-center" style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            <div className="card fade-in" style={{ padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-xl)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="nav-logo" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={32} fill="var(--primary)" color="var(--primary)" /> Evently
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Join Evently</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Start discovering and managing events today</p>
                </div>

                {error && (
                    <div className="alert alert-error mb-3">
                        <UserPlus size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label"><User size={16} /> Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="input-field"
                                style={{ paddingLeft: '44px' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label"><Mail size={16} /> Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="input-field"
                                style={{ paddingLeft: '44px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label"><Lock size={16} /> Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-field"
                                style={{ paddingLeft: '44px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Minimum 6 characters required</p>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <div className="divider" />

                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Sign In <ArrowRight size={14} /></Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
