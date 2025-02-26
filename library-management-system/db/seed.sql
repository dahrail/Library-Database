-- Users
INSERT INTO users (FirstName, LastName, Role, Email, Password, PhoneNumber, RegistrationDate, AccountStatus, BorrowLimit) VALUES
('John', 'Doe', 'Student', 'john.doe@example.com', 'hashed_password_1', '1234567890', CURDATE(), 'Active', 5),
('Jane', 'Smith', 'Faculty', 'jane.smith@example.com', 'hashed_password_2', '0987654321', CURDATE(), 'Active', 10),
('Admin', 'User', 'Admin', 'admin@example.com', 'hashed_password_3', '1122334455', CURDATE(), 'Active', 0);

-- Admins
INSERT INTO admins (UserID, Username, FirstName, LastName, Password) VALUES
(3, 'adminUser', 'Admin', 'User', 'hashed_admin_password');

-- Library Cards
INSERT INTO library_cards (UserID, IssueDate, ExpirationDate, Status) VALUES
(1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'Active'),
(2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), 'Active');

-- Books
INSERT INTO book (Title, AuthorCreator, Genre, PublicationYear, Publisher, Language, Format, ISBN10, ISBN13, ConditionStatus) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 1925, 'Scribner', 'English', 'Hardcover', '0743273567', '9780743273565', 'Good'),
('1984', 'George Orwell', 'Fiction', 1949, 'Secker & Warburg', 'English', 'Paperback', '0451524934', '9780451524935', 'Worn');

-- Book Inventory
INSERT INTO BookInventory (BookID, TotalCopies, AvailableCopies, ShelfLocation) VALUES
(1, 5, 5, 'A1'),
(2, 3, 2, 'B2');

-- Media
INSERT INTO media (Title, AuthorCreator, Genre, PublicationYear, Publisher, Language, Format, ConditionStatus) VALUES
('Inception', 'Christopher Nolan', 'Science Fiction', 2010, 'Warner Bros.', 'English', 'Blu-ray', 'Good'),
('The Godfather', 'Francis Ford Coppola', 'Crime', 1972, 'Paramount Pictures', 'English', 'DVD', 'Worn');

-- Media Inventory
INSERT INTO MediaInventory (MediaID, TotalCopies, AvailableCopies, ShelfLocation) VALUES
(1, 4, 4, 'C1'),
(2, 2, 1, 'D2');

-- Electronics
INSERT INTO electronics (Brand, Model, SerialNumber, Status, PurchaseDate, Notes) VALUES
('Apple', 'iPad Pro', 'SN123456789', 'Available', CURDATE(), 'Latest model'),
('Dell', 'XPS 13', 'SN987654321', 'Available', CURDATE(), 'Lightweight laptop');

-- Loans
INSERT INTO loans (UserID, ItemID, LoanType, BorrowedAt, DueAt, RenewalCount, Status) VALUES
(1, 1, 'book', NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 0, 'Active'),
(2, 2, 'media', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 0, 'Active');

-- Holds
INSERT INTO holds (UserID, ItemID, ItemType, RequestedAt, HoldStatus, NotificationSent) VALUES
(1, 1, 'Book', NOW(), 'Pending', false),
(2, 2, 'Media', NOW(), 'Pending', false);

-- Fines
INSERT INTO fines (LoanID, UserID, Amount, IssuedDate, Status) VALUES
(1, 1, 5.00, NOW(), 'Unpaid'),
(2, 2, 10.00, NOW(), 'Unpaid');