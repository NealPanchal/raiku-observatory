import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="footer-compact">
            <div className="footer-left">
                <img 
                    src="/shorthand.png" 
                    alt="RAIKU" 
                    style={{ 
                        height: '20px', 
                        width: 'auto',
                        filter: 'drop-shadow(0 0 4px rgba(192, 255, 56, 0.3))',
                        marginRight: '12px'
                    }} 
                />
                <span className="footer-text">© {currentYear} Raiku Labs. All rights reserved.</span>
            </div>

            <div className="footer-right">
                <a href="#" className="footer-link">Documentation</a>
                <a href="#" className="footer-link">API</a>
                <a href="#" className="footer-link">Support</a>
                <a href="#" className="footer-link">Status</a>
            </div>
        </footer>
    );
};

export default Footer;
