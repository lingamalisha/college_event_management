import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import EventTicket from '../components/EventTicket';
import { 
    Calendar, MapPin, User, CheckCircle, Loader2, ArrowLeft, 
    Trash2, Phone, Mail, UserCircle, Clock, Share2, Info, Edit2, Zap
} from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        studentName: user?.name || '',
        studentEmail: user?.email || '',
        studentPhone: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await API.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError('Failed to load event details. The event might have been removed.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                studentName: user.name,
                studentEmail: user.email
            }));
        }
    }, [user]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: `/event/${id}` } });
            return;
        }
        setRegistering(true);
        setError('');
        try {
            const { data } = await API.post('/registrations', {
                eventId: id,
                ...formData
            });
            const completeRegData = { ...data, event: event };
            setRegistrationData(completeRegData);
            setRegistered(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for event. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this event? All registrations will be lost.")) return;
        
        setDeleting(true);
        try {
            await API.delete(`/events/${id}`);
            navigate('/');
        } catch {
            setError('Failed to delete event');
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Loading event details...</p>
        </div>
    );

    if (error && !event) return (
        <div className="container flex-center" style={{ minHeight: '60vh' }}>
            <div className="text-center card" style={{ padding: '3rem', maxWidth: '500px' }}>
                <div className="empty-icon" style={{ margin: '0 auto 1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                    <Info size={32} />
                </div>
                <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>{error}</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">
                    <ArrowLeft size={18} /> Back to Events
                </button>
            </div>
        </div>
    );

    const eventDate = new Date(event.date);
    const fullDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    const fullTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="page-wrapper" style={{ background: 'var(--bg-secondary)', paddingBottom: '5rem' }}>
            {registered && registrationData && (
                <EventTicket 
                    registration={registrationData} 
                    onClose={() => setRegistered(false)} 
                />
            )}

            {/* Header / Banner */}
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '4rem 0 8rem' }}>
                <div className="container">
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-sm"
                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', marginBottom: '2rem' }}
                    >
                        <ArrowLeft size={16} /> Back to Events
                    </button>
                    
                    <div className="flex-between" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem' }}>
                                <Zap size={14} /> Upcoming Event
                            </div>
                            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                                {event.title}
                            </h1>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'rgba(255,255,255,0.9)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Calendar size={20} />
                                    <span>{fullDate}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Clock size={20} />
                                    <span>{fullTime}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <MapPin size={20} />
                                    <span>{event.venue}</span>
                                </div>
                            </div>
                        </div>

                        {user?.role === 'admin' && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/edit-event/${id}`} className="btn btn-secondary" style={{ background: 'white', border: 'none' }}>
                                    <Edit2 size={18} /> Edit
                                </Link>
                                <button onClick={handleDelete} disabled={deleting} className="btn btn-danger" style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: 'white' }}>
                                    {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
                    
                    {/* Description Area */}
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <div className="avatar" style={{ width: '40px', height: '40px' }}>
                                <Info size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Event Description</h3>
                        </div>
                        <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                            {event.description}
                        </div>

                        <div className="divider" />

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="avatar" style={{ background: 'var(--bg-secondary)', color: 'var(--primary)' }}>
                                    <UserCircle size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Organizer</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{event.createdBy?.name || 'Admin'}</div>
                                </div>
                            </div>
                            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
                                <Share2 size={14} /> Share Event
                            </button>
                        </div>
                    </div>

                    {/* Registration Sidebar */}
                    <div className="card" style={{ padding: '2rem', position: 'sticky', top: '100px', borderTop: '4px solid var(--primary)' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Reserve Your Spot</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Free entry for all registered students.</p>
                        </div>

                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ paddingLeft: '38px' }}
                                        placeholder="Full Name"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="email"
                                        className="input-field"
                                        style={{ paddingLeft: '38px' }}
                                        placeholder="Email Address"
                                        value={formData.studentEmail}
                                        onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                    <input
                                        type="tel"
                                        className="input-field"
                                        style={{ paddingLeft: '38px' }}
                                        placeholder="Phone Number"
                                        value={formData.studentPhone}
                                        onChange={(e) => setFormData({...formData, studentPhone: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="alert alert-error">{error}</div>}

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full mt-1"
                                disabled={registering}
                            >
                                {registering ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} /> Register Now</>}
                            </button>
                        </form>
                        
                        {!user && (
                            <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
                            </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetails;
