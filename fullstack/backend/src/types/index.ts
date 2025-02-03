export interface LibraryItem {
    id: string;
    title: string;
    type: 'book' | 'media' | 'device';
    copiesAvailable: number;
    totalCopies: number;
    borrowLimit: number;
    borrowDuration: number; // in days
    lateFeePerDay: number; // in currency
}

export interface User {
    id: string;
    name: string;
    userType: 'student' | 'faculty';
    borrowedItems: string[]; // array of LibraryItem IDs
}