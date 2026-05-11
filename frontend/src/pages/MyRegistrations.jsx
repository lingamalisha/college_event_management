import React, { useState, useEffect } from 'react';
import API from '../api';
import EventCard from '../components/EventCard';
import EventTicket from '../components/EventTicket';
import { 
    Calendar, Loader2, Sparkles, AlertCircle, LayoutDashboard, 
    Ticket, Search, Plus, Filter, Zap, RefreshCcw, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/registrations/my');
            setRegistrations(data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch registrations', err);
            setError('Could not load your registrations. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = registrations.filter(reg => 
        reg.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && registrations.length === 0) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Retrieving your tickets...</p>
        </div>
    );

    return (
        <div className="dashboard-layout page-wrapper">
            {selectedRegistration && (
                <EventTicket 
                    registration={selectedRegistration} 
                    onClose={() => setSelectedRegistration(null)} 
                />
            )}

            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ padding: '0 0.5rem 1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Personal</div>
                </div>
                <Link to="/my-registrations" className="sidebar-item active">
                    <Ticket size={18} /> My Tickets
                </Link>
                <Link to="/" className="sidebar-item">
                    <Zap size={18} /> Discover Events
                </Link>
                
                <div className="divider" style={{ margin: '1rem 0.5rem' }} />
                
                <div style={{ padding: '0 0.5rem 1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Support</div>
                </div>
                <button className="sidebar-item">
                    <AlertCircle size={18} /> Help Center
                </button>
            </aside>

            {/* Content */}
            <main className="dashboard-content">
                <header className="section-header">
                    <div>
                        <h1 className="section-title">My Event Tickets</h1>
                        <p className="section-subtitle">Manage your registrations and access your entry tickets</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={fetchRegistrations} className="btn btn-ghost btn-icon" title="Refresh">
                            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <Link to="/" className="btn btn-primary">
                            <Plus size={18} /> Find More Events
                        </Link>
                    </div>
                </header>

                {error && (
                    <div className="alert alert-error mb-4">
                        <AlertCircle size={18} />
                        <div>
                            <div style={{ fontWeight: 600 }}>Sync Issue</div>
                            <div>{error}</div>
                        </div>
                    </div>
                )}

                <div className="card mb-4" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="search-bar" style={{ maxWidth: '350px' }}>
                        <Search size={16} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search your tickets..." 
                            className="input-field" 
                            style={{ paddingLeft: '40px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-ghost btn-sm">
                        <Filter size={14} /> Recently Added
                    </button>
                </div>

                <div className="grid-events">
                    {filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map(reg => (
                            <EventCard 
                                key={reg._id} 
                                event={reg.event} 
                                onViewTicket={() => setSelectedRegistration(reg)}
                                onDeleteSuccess={(id) => setRegistrations(registrations.filter(r => r.event._id !== id))}
                            />
                        ))
                    ) : (
                        !error && (
                            <div className="card empty-state" style={{ gridColumn: '1 / -1', padding: '5rem 2rem' }}>
                                <div className="empty-icon" style={{ background: 'rgba(79, 70, 229, 0.05)', color: 'var(--primary)' }}>
                                    <Sparkles size={32} />
                                </div>
                                <div style={{ maxWidth: '400px' }}>
                                    <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Your ticket box is empty</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        {searchTerm ? "No tickets found matching your search." : "You haven't registered for any events yet. Explore upcoming campus activities and join in!"}
                                    </p>
                                    {!searchTerm && (
                                        <Link to="/" className="btn btn-primary">
                                            Explore Events <ArrowRight size={18} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyRegistrations;
