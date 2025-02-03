export interface LibraryItem {
    id: string;
    title: string;
    type: 'book' | 'media' | 'device';
    copiesAvailable: number;
    totalCopies: number;
    borrowLimit: number;
    borrowDuration: number; // in days
    finesPerDay: number; // in currency
}

export interface User {
    id: string;
    name: string;
    userType: 'student' | 'faculty';
    borrowedItems: BorrowedItem[];
}

export interface BorrowedItem {
    itemId: string;
    borrowDate: Date;
    returnDate?: Date;
    isReturned: boolean;
}

export interface RequestItem {
    itemId: string;
    userId: string;
    requestDate: Date;
}