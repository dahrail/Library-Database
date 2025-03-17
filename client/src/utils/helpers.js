// filepath: library-management-system/library-management-system/client/src/utils/helpers.js

export const calculateFine = (dueDate, returnDate) => {
    const due = new Date(dueDate);
    const returned = new Date(returnDate);
    const timeDiff = returned - due;

    if (timeDiff <= 0) return 0; // No fine if returned on or before due date

    const daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
    const finePerDay = 1; // Define fine per day
    return daysLate * finePerDay; // Total fine
};

export const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
};

export const isUserAuthorized = (userRole, requiredRole) => {
    const rolesHierarchy = ['student', 'faculty', 'admin'];
    return rolesHierarchy.indexOf(userRole) >= rolesHierarchy.indexOf(requiredRole);
};