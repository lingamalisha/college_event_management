import React from 'react';
import { X, Calendar, MapPin, User, Clock, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const EventTicket = ({ registration, onClose }) => {
    if (!registration || !registration.event) return null;

    const event = registration.event;
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const ticketId = registration._id?.slice(-8).toUpperCase() || 'XXXXXXXX';
    const qrData = JSON.stringify({ ticketId: registration._id, event: event.title, attendee: registration.studentName });

    return (
        <div className="ticket-overlay" role="dialog" aria-modal="true" aria-label="Event Ticket" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="ticket-card fade-in">
                {/* Header */}
                <div className="ticket-header" style={{ position: 'relative' }}>
                    <button
                        onClick={onClose}
                        aria-label="Close ticket"
                        style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', color: 'white' }}
                    >
                        <X size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                        <CheckCircle size={24} style={{ color: '#86EFAC' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Registration Confirmed</span>
                    </div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '6px' }}>{event.title}</h2>
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        #{ticketId}
                    </span>
                </div>

                {/* Perforation */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 -12px', background: 'var(--bg-secondary)', position: 'relative' }}>
                    <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', marginLeft: -10, border: '1px solid var(--border)', flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 1, borderTop: '2px dashed var(--border)', margin: '0 8px' }} />
                    <div style={{ width: 20, height: 20, background: 'white', borderRadius: '50%', marginRight: -10, border: '1px solid var(--border)', flexShrink: 0 }} />
                </div>

                {/* Body */}
                <div className="ticket-body">
                    <div className="ticket-grid">
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Attendee</div>
                            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <User size={13} style={{ color: 'var(--primary)' }} /> {registration.studentName}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Date</div>
                            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Calendar size={13} style={{ color: 'var(--primary)' }} /> {formattedDate}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Time</div>
                            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={13} style={{ color: 'var(--secondary)' }} /> {formattedTime}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Venue</div>
                            <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <MapPin size={13} style={{ color: 'var(--danger)' }} /> {event.venue}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                        <div className="ticket-qr">
                            <QRCodeSVG value={qrData} size={110} level="H" />
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Scan at the venue entrance
                        </p>
                    </div>

                    <button onClick={onClose} className="btn btn-primary w-full mt-3">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventTicket;
