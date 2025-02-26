import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BookList from '../components/books/BookList';

const HomePage = () => {
    return (
        <div>
            <Header />
            <h1>Welcome to the Library Management System</h1>
            <p>Borrow books, media, and devices with ease!</p>
            <BookList />
            <Footer />
        </div>
    );
};

export default HomePage;