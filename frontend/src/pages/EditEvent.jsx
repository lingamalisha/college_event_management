import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api';
import { Calendar, MapPin, Type, AlignLeft, Loader2, Save, ArrowLeft, Edit3, Sparkles } from 'lucide-react';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        venue: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await API.get(`/events/${id}`);
                let formattedDate = '';
                if (data.date) {
                    const parsedDate = new Date(data.date);
                    if (!isNaN(parsedDate.getTime())) {
                        formattedDate = parsedDate.toISOString().slice(0, 16);
                    }
                }
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    date: formattedDate,
                    venue: data.venue || ''
                });
            } catch {
                setError('Failed to load event details. Please verify the event ID.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await API.put(`/events/${id}`, formData);
            navigate('/manage-events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event. Please check your connection.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)' }}>Fetching event data...</p>
        </div>
    );

    return (
        <div className="page-wrapper" style={{ background: 'var(--bg-secondary)', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="flex-between mb-4">
                    <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="badge badge-primary"><Sparkles size={14} /> Update Mode</div>
                </div>

                <div className="card fade-in" style={{ padding: '3rem', boxShadow: 'var(--shadow-xl)' }}>
                    <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <div className="avatar avatar-lg" style={{ margin: '0 auto 1.5rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                            <Edit3 size={24} />
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                            Edit <span style={{ color: 'var(--primary)' }}>Event Details</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
                            Update the information for "{formData.title}"
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <Edit3 size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div className="form-group">
                            <label className="form-label"><Type size={16} /> Event Title</label>
                            <input
                                type="text"
                                name="title"
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
                                <label className="form-label"><MapPin size={16} /> Venue</label>
                                <input
                                    type="text"
                                    name="venue"
                                    className="input-field"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label"><AlignLeft size={16} /> Description</label>
                            <textarea
                                name="description"
                                className="input-field"
                                style={{ minHeight: '160px' }}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="flex-center" style={{ marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary btn-lg w-full" style={{ maxWidth: '300px' }} disabled={saving}>
                                {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
