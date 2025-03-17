CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    published_year YEAR,
    total_copies INT DEFAULT 0,
    available_copies INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE borrowings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    due_date DATE NOT NULL,
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE hold_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    request_date DATE NOT NULL,
    status ENUM('pending', 'fulfilled', 'canceled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE fines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrowing_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (borrowing_id) REFERENCES borrowings(id)
);

CREATE TRIGGER update_available_copies_after_borrowing
AFTER INSERT ON borrowings
FOR EACH ROW
BEGIN
    UPDATE books SET available_copies = available_copies - 1 WHERE id = NEW.book_id;
END;

CREATE TRIGGER update_available_copies_after_return
AFTER DELETE ON borrowings
FOR EACH ROW
BEGIN
    UPDATE books SET available_copies = available_copies + 1 WHERE id = OLD.book_id;
END;