class Item {
    constructor(id, title, author, type, availableCopies, maxBorrowDays, finePerDay) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.type = type; // e.g., book, media, device
        this.availableCopies = availableCopies;
        this.maxBorrowDays = maxBorrowDays; // Different for students and faculty
        this.finePerDay = finePerDay; // Fine for late returns
    }

    // Method to borrow an item
    borrowItem(copiesRequested) {
        if (copiesRequested > this.availableCopies) {
            throw new Error('Not enough copies available');
        }
        this.availableCopies -= copiesRequested;
    }

    // Method to return an item
    returnItem(copiesReturned) {
        this.availableCopies += copiesReturned;
    }

    // Method to calculate fine based on days late
    calculateFine(daysLate) {
        if (daysLate > 0) {
            return daysLate * this.finePerDay;
        }
        return 0;
    }
}

module.exports = Item;