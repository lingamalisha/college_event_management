import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { Search, Loader2, Plus, AlertCircle, Calendar, Users, Zap, ArrowRight } from 'lucide-react';

import Footer from '../components/Footer';

const CATEGORIES = ['All', 'Tech', 'Sports', 'Cultural', 'Workshop', 'Seminar'];

const Home = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await API.get('/events');
                setEvents(data);
                setError('');
            } catch {
                setError('Could not connect to the server. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const getEventCategory = (event) => {
        const text = `${event.title || ''} ${event.description || ''}`.toLowerCase();
        if (text.includes('tech') || text.includes('code') || text.includes('hackathon') || text.includes('summit') || text.includes('developer')) return 'Tech';
        if (text.includes('sport') || text.includes('cricket') || text.includes('football') || text.includes('tournament') || text.includes('athletic')) return 'Sports';
        if (text.includes('cultur') || text.includes('art') || text.includes('music') || text.includes('dance') || text.includes('drama') || text.includes('festival')) return 'Cultural';
        if (text.includes('workshop') || text.includes('bootcamp') || text.includes('learn')) return 'Workshop';
        if (text.includes('seminar') || text.includes('talk') || text.includes('lecture') || text.includes('panel')) return 'Seminar';
        return 'Workshop'; // fallback category
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = (
            (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue?.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (activeCategory === 'All') return matchesSearch;

        const eventCategory = getEventCategory(event);
        return matchesSearch && eventCategory === activeCategory;
    });

    return (
        <div className="page-wrapper">
            {/* Hero Section */}
            <section className="hero">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: '680px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(79,70,229,0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                            <Zap size={14} /> Campus Events Hub
                        </div>
                        <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '1.25rem' }}>
                            Discover &amp; Join{' '}
                            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Amazing Events
                            </span>
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '520px' }}>
                            Stay connected with everything happening on campus. From tech fests to sports meets — find, register, and never miss out.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <a href="#events" className="btn btn-primary btn-lg">
                                Explore Events <ArrowRight size={18} />
                            </a>
                            {!user && (
                                <Link to="/signup" className="btn btn-ghost btn-lg">
                                    Create Account
                                </Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/create-event" className="btn btn-ghost btn-lg">
                                    <Plus size={18} /> New Event
                                </Link>
                            )}
                        </div>

                        {/* Stats Row */}
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                            {[
                                { icon: Calendar, label: 'Events Listed', value: events.length || '—' },
                                { icon: Users, label: 'Students Joined', value: '500+' },
                                { icon: Zap, label: 'Upcoming', value: events.filter(e => new Date(e.date) > new Date()).length || '—' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={18} style={{ color: 'var(--primary)' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)' }}>{value}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section id="events" style={{ padding: '3rem 0' }}>
                <div className="container">
                    {/* Toolbar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 className="section-title">All Events</h2>
                                <p className="section-subtitle">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <div className="search-bar" style={{ maxWidth: '280px' }}>
                                    <Search size={16} className="search-icon" />
                                    <input
                                        type="search"
                                        placeholder="Search events..."
                                        className="input-field"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        aria-label="Search events"
                                    />
                                </div>
                                {user?.role === 'admin' && (
                                    <Link to="/create-event" className="btn btn-primary btn-sm">
                                        <Plus size={15} /> Add Event
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="btn btn-sm"
                                    style={{
                                        background: activeCategory === cat ? 'var(--primary)' : 'white',
                                        color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                                        border: activeCategory === cat ? 'none' : '1.5px solid var(--border)',
                                        boxShadow: activeCategory === cat ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                            <AlertCircle size={18} />
                            <div>
                                <div style={{ fontWeight: 600 }}>Connection Issue</div>
                                <div>{error}</div>
                            </div>
                            <button onClick={() => window.location.reload()} className="btn btn-sm btn-ghost" style={{ marginLeft: 'auto' }}>Retry</button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="loading-screen">
                            <div className="spinner" />
                            <p style={{ color: 'var(--text-muted)' }}>Loading events...</p>
                        </div>
                    ) : (
                        <div className="grid-events">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map(event => (
                                    <EventCard
                                        key={event._id}
                                        event={event}
                                        onDeleteSuccess={(id) => setEvents(events.filter(e => e._id !== id))}
                                    />
                                ))
                            ) : (
                                !error && (
                                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                        <div className="empty-icon">
                                            <Calendar size={30} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>No events found</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                {searchTerm ? 'Try a different search term.' : 'No events have been created yet.'}
                                            </p>
                                        </div>
                                        {user?.role === 'admin' && (
                                            <Link to="/create-event" className="btn btn-primary">
                                                <Plus size={16} /> Create First Event
                                            </Link>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
