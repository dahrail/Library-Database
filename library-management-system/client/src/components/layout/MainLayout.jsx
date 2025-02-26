import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Sidebar from '../common/Sidebar';
import { Container } from 'react-bootstrap';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <Sidebar />
            <Container>
                {children}
            </Container>
            <Footer />
        </div>
    );
};

export default MainLayout;