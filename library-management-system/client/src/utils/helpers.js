// This file contains utility functions used throughout the application.

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const calculateFine = (dueDate, returnDate, fineRate) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const daysLate = Math.max(0, Math.ceil((returned - due) / (1000 * 60 * 60 * 24)));
    return daysLate * fineRate;
};

export const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
};

export const getUserRole = (user) => {
    return user?.Role || 'Guest';
};