import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="nav-logo" style={{ fontSize: '1.25rem' }}>
                        <Zap size={18} fill="var(--primary)" color="var(--primary)" /> Evently
                    </div>
                    <p style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        The official platform for campus event discovery and management. 
                        Stay connected with everything happening at your college.
                    </p>
                    <div className="divider" style={{ width: '100%', maxWidth: '200px', margin: '0.5rem 0' }} />
                    <p>&copy; {new Date().getFullYear()} Evently. Built for students, by students.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
