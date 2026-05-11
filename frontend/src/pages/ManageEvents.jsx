import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
    Calendar, MapPin, Trash2, Loader2, AlertCircle, Plus, 
    Search, ExternalLink, Edit2, LayoutDashboard, Users, 
    Zap, TrendingUp, Filter, MoreVertical, RefreshCcw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/events');
            setEvents(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? All registration data for this event will be permanently removed.`)) return;
        
        setDeletingId(id);
        try {
            await API.delete(`/events/${id}`);
            setEvents(events.filter(e => e._id !== id));
        } catch (err) {
            alert('Failed to delete event');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredEvents = events.filter(e => 
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const activeEvents = events.filter(e => new Date(e.date) > new Date()).length;
    const pastEvents = events.length - activeEvents;

    if (loading && events.length === 0) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Initializing dashboard...</p>
        </div>
    );

    return (
        <div className="dashboard-layout page-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ padding: '0 0.5rem 1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Main Menu</div>
                </div>
                <Link to="/manage-events" className="sidebar-item active">
                    <LayoutDashboard size={18} /> Overview
                </Link>
                <Link to="/create-event" className="sidebar-item">
                    <Plus size={18} /> Create Event
                </Link>
                <Link to="/" className="sidebar-item">
                    <Zap size={18} /> Live Site
                </Link>
                
                <div className="divider" style={{ margin: '1rem 0.5rem' }} />
                
                <div style={{ padding: '0 0.5rem 1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Account</div>
                </div>
                <button className="sidebar-item">
                    <Users size={18} /> User Management
                </button>
                <button className="sidebar-item">
                    <RefreshCcw size={18} /> Activity Log
                </button>
            </aside>

            {/* Content */}
            <main className="dashboard-content">
                <header className="section-header">
                    <div>
                        <h1 className="section-title">Events Management</h1>
                        <p className="section-subtitle">Manage, edit and monitor all campus activities</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={fetchEvents} className="btn btn-ghost btn-icon" title="Refresh Data">
                            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <Link to="/create-event" className="btn btn-primary">
                            <Plus size={18} /> Create Event
                        </Link>
                    </div>
                </header>

                {/* Quick Stats Grid */}
                <div className="grid-4 mb-4">
                    <div className="stat-card">
                        <div className="flex-between mb-2">
                            <div className="avatar" style={{ background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                                <LayoutDashboard size={18} />
                            </div>
                            <TrendingUp size={16} color="var(--success)" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{events.length}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Events</div>
                    </div>
                    <div className="stat-card">
                        <div className="flex-between mb-2">
                            <div className="avatar" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                <Zap size={18} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{activeEvents}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Upcoming Events</div>
                    </div>
                    <div className="stat-card">
                        <div className="flex-between mb-2">
                            <div className="avatar" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                                <Calendar size={18} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pastEvents}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Past Events</div>
                    </div>
                    <div className="stat-card">
                        <div className="flex-between mb-2">
                            <div className="avatar" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--secondary)' }}>
                                <Users size={18} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>2.4k</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Reach</div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card">
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="search-bar" style={{ maxWidth: '300px' }}>
                            <Search size={16} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Filter by title or venue..." 
                                className="input-field" 
                                style={{ paddingLeft: '40px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-ghost btn-sm">
                                <Filter size={14} /> Filter
                            </button>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Event Title & Info</th>
                                    <th>Venue</th>
                                    <th>Date & Time</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.length > 0 ? filteredEvents.map(event => {
                                    const isUpcoming = new Date(event.date) > new Date();
                                    return (
                                        <tr key={event._id}>
                                            <td style={{ maxWidth: '350px' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{event.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {event.description}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <MapPin size={14} style={{ color: 'var(--danger)' }} />
                                                    {event.venue}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{new Date(event.date).toLocaleDateString()}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td>
                                                <span className={`badge ${isUpcoming ? 'badge-success' : 'badge-danger'}`}>
                                                    {isUpcoming ? 'Upcoming' : 'Ended'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                    <Link to={`/event/${event._id}`} className="btn btn-ghost btn-icon btn-sm" title="View Page">
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    <Link to={`/edit-event/${event._id}`} className="btn btn-ghost btn-icon btn-sm" title="Edit Event">
                                                        <Edit2 size={16} style={{ color: 'var(--primary)' }} />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(event._id, event.title)}
                                                        disabled={deletingId === event._id}
                                                        className="btn btn-ghost btn-icon btn-sm"
                                                        title="Delete Event"
                                                    >
                                                        {deletingId === event._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} style={{ color: 'var(--danger)' }} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="empty-state">
                                                <div className="empty-icon"><Search size={24} /></div>
                                                <p>No events found matching your criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Showing {filteredEvents.length} of {events.length} events total
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageEvents;
