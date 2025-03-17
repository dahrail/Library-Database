CREATE PROCEDURE AddBook(
    IN bookTitle VARCHAR(255),
    IN bookAuthor VARCHAR(255),
    IN bookISBN VARCHAR(20),
    IN bookCopies INT
)
BEGIN
    INSERT INTO books (title, author, isbn, copies)
    VALUES (bookTitle, bookAuthor, bookISBN, bookCopies);
END;

CREATE PROCEDURE BorrowItem(
    IN userId INT,
    IN itemId INT,
    IN itemType ENUM('book', 'media', 'device'),
    OUT dueDate DATE
)
BEGIN
    DECLARE borrowLimit INT;
    DECLARE borrowDuration INT;

    IF (SELECT role FROM users WHERE id = userId) = 'student' THEN
        SET borrowLimit = 3;
        SET borrowDuration = 14; -- 14 days for students
    ELSE
        SET borrowLimit = 5;
        SET borrowDuration = 30; -- 30 days for faculty
    END IF;

    IF (SELECT COUNT(*) FROM borrowings WHERE user_id = userId AND item_id = itemId AND item_type = itemType) < borrowLimit THEN
        INSERT INTO borrowings (user_id, item_id, item_type, borrow_date, due_date)
        VALUES (userId, itemId, itemType, CURDATE(), DATE_ADD(CURDATE(), INTERVAL borrowDuration DAY));
        SET dueDate = DATE_ADD(CURDATE(), INTERVAL borrowDuration DAY);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Borrow limit exceeded';
    END IF;
END;

CREATE PROCEDURE ReturnItem(
    IN userId INT,
    IN itemId INT,
    IN itemType ENUM('book', 'media', 'device'),
    OUT fineAmount DECIMAL(10, 2)
)
BEGIN
    DECLARE actualReturnDate DATE;
    DECLARE dueDate DATE;

    SELECT due_date INTO dueDate FROM borrowings WHERE user_id = userId AND item_id = itemId AND item_type = itemType;

    IF (dueDate < CURDATE()) THEN
        SET fineAmount = DATEDIFF(CURDATE(), dueDate) * 1.00; -- $1 per day late
    ELSE
        SET fineAmount = 0.00;
    END IF;

    DELETE FROM borrowings WHERE user_id = userId AND item_id = itemId AND item_type = itemType;
END;

CREATE PROCEDURE RequestHold(
    IN userId INT,
    IN itemId INT,
    IN itemType ENUM('book', 'media', 'device')
)
BEGIN
    INSERT INTO hold_requests (user_id, item_id, item_type, request_date)
    VALUES (userId, itemId, itemType, CURDATE());
END;