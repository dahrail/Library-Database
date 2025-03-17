CREATE TRIGGER before_borrowing
BEFORE INSERT ON borrowings
FOR EACH ROW
BEGIN
    DECLARE available_copies INT;
    
    SELECT COUNT(*) INTO available_copies
    FROM copies
    WHERE book_id = NEW.book_id AND status = 'available';
    
    IF available_copies = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No available copies for this book.';
    END IF;
END;

CREATE TRIGGER after_returning
AFTER UPDATE ON borrowings
FOR EACH ROW
BEGIN
    IF NEW.return_date IS NOT NULL THEN
        UPDATE copies
        SET status = 'available'
        WHERE book_id = NEW.book_id AND status = 'borrowed'
        LIMIT 1;
    END IF;
END;