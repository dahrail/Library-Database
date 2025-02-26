import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Library Management System. All rights reserved.</p>
                <p>Contact us: support@librarymanagement.com</p>
            </div>
        </footer>
    );
};

export default Footer;