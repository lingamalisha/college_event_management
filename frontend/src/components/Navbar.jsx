import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, PlusCircle, LayoutDashboard, ChevronDown, Ticket, Zap } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <nav className="nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to="/" className="nav-logo" aria-label="Evently Home">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} style={{ color: '#4F46E5' }} />
                        Evently
                    </span>
                </Link>
                <div className="nav-links" style={{ display: 'flex', gap: '4px' }}>
                    <Link
                        to="/"
                        className="nav-link"
                        style={{ color: isActive('/') ? 'var(--primary)' : undefined, background: isActive('/') ? 'rgba(79,70,229,0.08)' : undefined }}
                        aria-current={isActive('/') ? 'page' : undefined}
                    >
                        Events
                    </Link>
                    {user?.role === 'admin' && (
                        <>
                            <Link
                                to="/manage-events"
                                className="nav-link"
                                style={{ color: isActive('/manage-events') ? 'var(--primary)' : undefined, background: isActive('/manage-events') ? 'rgba(79,70,229,0.08)' : undefined }}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/create-event"
                                className="nav-link"
                                style={{ color: isActive('/create-event') ? 'var(--primary)' : undefined, background: isActive('/create-event') ? 'rgba(79,70,229,0.08)' : undefined }}
                            >
                                Create Event
                            </Link>
                        </>
                    )}
                    {user && user.role !== 'admin' && (
                        <Link
                            to="/my-registrations"
                            className="nav-link"
                            style={{ color: isActive('/my-registrations') ? 'var(--primary)' : undefined, background: isActive('/my-registrations') ? 'rgba(79,70,229,0.08)' : undefined }}
                        >
                            My Tickets
                        </Link>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user ? (
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-label="Open user menu"
                            aria-expanded={isDropdownOpen}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '6px 12px 6px 6px',
                                background: 'white', border: '1.5px solid var(--border)',
                                borderRadius: '999px', cursor: 'pointer',
                                transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                {initials}
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)' }}>
                                {user.name.split(' ')[0]}
                            </span>
                            <ChevronDown size={14} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                        </button>

                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px' }}>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text)' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                    <span className="badge badge-primary" style={{ marginTop: '6px', fontSize: '0.7rem' }}>{user.role}</span>
                                </div>

                                {user.role === 'admin' ? (
                                    <>
                                        <Link to="/manage-events" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to="/create-event" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <PlusCircle size={16} /> Create Event
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/my-registrations" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                        <Ticket size={16} /> My Tickets
                                    </Link>
                                )}
                                <div className="dropdown-divider" />
                                <button className="dropdown-item danger" onClick={handleLogout}>
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                        <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
