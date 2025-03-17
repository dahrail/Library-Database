import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="text-center">
                    &copy; {new Date().getFullYear()} Library Management System. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;