import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Trash2, Loader2, Edit2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const EVENT_COLORS = [
    'linear-gradient(135deg, #4F46E5, #7C3AED)',
    'linear-gradient(135deg, #0891B2, #06B6D4)',
    'linear-gradient(135deg, #059669, #10B981)',
    'linear-gradient(135deg, #D97706, #F59E0B)',
    'linear-gradient(135deg, #DC2626, #EF4444)',
    'linear-gradient(135deg, #7C3AED, #EC4899)',
];

const getColorIndex = (id = '') => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % EVENT_COLORS.length;
};

const EventCard = ({ event, onDeleteSuccess, onViewTicket }) => {
    const { user } = useAuth();
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    if (!event) return null;

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const isPast = eventDate < new Date();
    const gradient = EVENT_COLORS[getColorIndex(event._id)];

    const titleInitials = event.title 
        ? event.title.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() 
        : 'EV';

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await API.delete(`/events/${event._id}`);
            if (onDeleteSuccess) onDeleteSuccess(event._id);
        } catch {
            alert('Failed to delete event');
            setDeleting(false);
        }
    };

    return (
        <article className="event-card card-hover" aria-label={`Event: ${event.title}`}>
            {/* Color Banner */}
            <div className="event-card-image" style={{ background: gradient }}>
                <div style={{
                    fontSize: '2.5rem', fontWeight: 900,
                    color: 'rgba(255,255,255,0.25)', fontFamily: 'Plus Jakarta Sans, sans-serif',
                    letterSpacing: '-2px', userSelect: 'none'
                }}>
                    {titleInitials}
                </div>
                {isPast && (
                    <span className="badge" style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'rgba(0,0,0,0.5)', color: 'white', backdropFilter: 'blur(4px)'
                    }}>Ended</span>
                )}
                {user?.role === 'admin' && !onViewTicket && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/edit-event/${event._id}`); }}
                            className="btn btn-sm"
                            style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--primary)', padding: '6px', borderRadius: '8px' }}
                            title="Edit Event"
                        >
                            <Edit2 size={13} />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="btn btn-sm"
                            style={{ background: 'rgba(239,68,68,0.9)', color: 'white', padding: '6px', borderRadius: '8px' }}
                            title="Delete Event"
                        >
                            {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="event-card-body">
                <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', lineHeight: '1.3', marginBottom: '6px' }}>
                        {event.title}
                    </h3>
                    <p style={{ fontSize: '0.8375rem', color: 'var(--text-muted)', lineHeight: '1.5',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {event.description}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span>{formattedDate}</span>
                        <span style={{ color: 'var(--border)' }}>•</span>
                        <Clock size={13} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                        <span>{formattedTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        <MapPin size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</span>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                    {onViewTicket ? (
                        <button onClick={onViewTicket} className="btn btn-secondary w-full btn-sm" style={{ justifyContent: 'center' }}>
                            View Ticket <ArrowRight size={14} />
                        </button>
                    ) : (
                        <Link to={`/event/${event._id}`} className="btn btn-primary w-full btn-sm" style={{ justifyContent: 'center' }}>
                            View Details <ArrowRight size={14} />
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
};

export default EventCard;
