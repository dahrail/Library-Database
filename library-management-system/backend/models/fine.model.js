class Fine {
    constructor(id, userId, itemId, amount, dueDate, returnedDate) {
        this.id = id;
        this.userId = userId;
        this.itemId = itemId;
        this.amount = amount;
        this.dueDate = dueDate;
        this.returnedDate = returnedDate;
    }

    static calculateFine(dueDate, returnedDate) {
        const finePerDay = 1; // Example fine amount per day
        const daysLate = Math.ceil((returnedDate - dueDate) / (1000 * 60 * 60 * 24));
        return daysLate > 0 ? daysLate * finePerDay : 0;
    }

    static async createFine(userId, itemId, amount, dueDate) {
        // Logic to create a fine in the database
    }

    static async getFinesByUserId(userId) {
        // Logic to retrieve fines for a specific user
    }

    static async payFine(fineId) {
        // Logic to mark a fine as paid in the database
    }
}

module.exports = Fine;