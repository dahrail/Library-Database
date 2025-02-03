export class LibraryItem {
    id: string;
    title: string;
    type: 'book' | 'media' | 'device';
    copiesAvailable: number;
    borrowingLimit: number;
    borrowingDuration: number; // in days
    lateFeePerDay: number; // in currency unit

    constructor(id: string, title: string, type: 'book' | 'media' | 'device', copiesAvailable: number, borrowingLimit: number, borrowingDuration: number, lateFeePerDay: number) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.copiesAvailable = copiesAvailable;
        this.borrowingLimit = borrowingLimit;
        this.borrowingDuration = borrowingDuration;
        this.lateFeePerDay = lateFeePerDay;
    }

    calculateLateFee(daysLate: number): number {
        return daysLate > 0 ? daysLate * this.lateFeePerDay : 0;
    }

    updateCopies(count: number): void {
        this.copiesAvailable += count;
    }
}