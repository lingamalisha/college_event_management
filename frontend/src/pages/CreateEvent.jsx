import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { Calendar, MapPin, Type, AlignLeft, Loader2, Send, ArrowLeft, Zap, Sparkles } from 'lucide-react';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        venue: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/events', formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event. Please verify all fields.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="page-wrapper" style={{ background: 'var(--bg-secondary)', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="flex-between mb-4">
                    <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="badge badge-success"><Sparkles size={14} /> Admin Access</div>
                </div>

                <div className="card fade-in" style={{ padding: '3rem', boxShadow: 'var(--shadow-xl)' }}>
                    <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <div className="avatar avatar-lg" style={{ margin: '0 auto 1.5rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                            <Zap size={24} />
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                            Launch <span style={{ color: 'var(--primary)' }}>New Event</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                            Ready to host something amazing? Fill in the details below.
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <Zap size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div className="form-group">
                            <label className="form-label"><Type size={16} /> Event Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Annual Tech Symposium 2024"
                                className="input-field"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label"><Calendar size={16} /> Date & Time</label>
                                <input
                                    type="datetime-local"
                                    name="date"
                                    className="input-field"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label"><MapPin size={16} /> Venue / Location</label>
                                <input
                                    type="text"
                                    name="venue"
                                    placeholder="e.g. Main Auditorium"
                                    className="input-field"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label"><AlignLeft size={16} /> Detailed Description</label>
                            <textarea
                                name="description"
                                placeholder="Tell the students about the event, its highlights, and why they should join..."
                                className="input-field"
                                style={{ minHeight: '160px' }}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="flex-center" style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ maxWidth: '300px' }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Publish Event</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateEvent;
