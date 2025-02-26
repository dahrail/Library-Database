-- Users Table
CREATE TABLE users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  FirstName VARCHAR(100),
  LastName VARCHAR(100),
  Role ENUM('Student', 'Faculty', 'Admin'),
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(100) NOT NULL,
  PhoneNumber VARCHAR(20),
  RegistrationDate DATE,
  AccountStatus ENUM('Active', 'Suspended'),
  BorrowLimit INT
);

-- Admins Table
CREATE TABLE admins (
  AdminID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT UNIQUE NOT NULL,
  Username VARCHAR(50) UNIQUE NOT NULL,
  FirstName VARCHAR(100),
  LastName VARCHAR(100),
  Password VARCHAR(255) NOT NULL,
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- Library Cards Table
CREATE TABLE library_cards (
  LibraryCardID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  IssueDate DATE NOT NULL,
  ExpirationDate DATE NOT NULL,
  Status ENUM('Active', 'Expired', 'Lost') NOT NULL,
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- Book Table
CREATE TABLE book (
  BookID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(200) NOT NULL,
  AuthorCreator VARCHAR(200),
  Genre ENUM('Fiction', 'Non-Fiction', 'Reference', 'Biography', 'Science', 'History', 'Arts', 'Other'),
  PublicationYear INT,
  Publisher VARCHAR(100),
  Language VARCHAR(50),
  Format VARCHAR(50),
  ISBN10 VARCHAR(10) UNIQUE,
  ISBN13 VARCHAR(13) UNIQUE,
  ConditionStatus ENUM('New', 'Good', 'Worn', 'Damaged')
);

-- Book Inventory Table
CREATE TABLE BookInventory (
  BookInventoryID INT AUTO_INCREMENT PRIMARY KEY,
  BookID INT NOT NULL,
  TotalCopies INT NOT NULL DEFAULT 0,
  AvailableCopies INT NOT NULL DEFAULT 0,
  ShelfLocation VARCHAR(50),
  FOREIGN KEY (BookID) REFERENCES book(BookID)
);

-- Media Table
CREATE TABLE media (
  MediaID INT AUTO_INCREMENT PRIMARY KEY,
  Title VARCHAR(200) NOT NULL,
  AuthorCreator VARCHAR(200),
  Genre VARCHAR(100),
  PublicationYear INT,
  Publisher VARCHAR(100),
  Language VARCHAR(50),
  Format VARCHAR(50) NOT NULL,
  ConditionStatus ENUM('New', 'Good', 'Worn', 'Damaged')
);

-- Media Inventory Table
CREATE TABLE MediaInventory (
  MediaInventoryID INT AUTO_INCREMENT PRIMARY KEY,
  MediaID INT NOT NULL,
  TotalCopies INT NOT NULL DEFAULT 0,
  AvailableCopies INT NOT NULL DEFAULT 0,
  ShelfLocation VARCHAR(50),
  FOREIGN KEY (MediaID) REFERENCES media(MediaID)
);

-- Electronics Table
CREATE TABLE electronics (
  DeviceID INT AUTO_INCREMENT PRIMARY KEY,
  Brand VARCHAR(100) NOT NULL,
  Model VARCHAR(100) NOT NULL,
  SerialNumber VARCHAR(100) UNIQUE,
  Status ENUM('Available', 'Loaned', 'Maintenance', 'Lost') NOT NULL DEFAULT 'Available',
  PurchaseDate DATE,
  Notes TEXT
);

-- Loans Table
CREATE TABLE loans (
  LoanID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  LoanType ENUM('book', 'media', 'electronic') NOT NULL,
  BorrowedAt DATETIME NOT NULL,
  DueAt DATETIME NOT NULL,
  ReturnedAt DATETIME,
  RenewalCount INT NOT NULL DEFAULT 0,
  Status ENUM('Active', 'Returned', 'Overdue') NOT NULL DEFAULT 'Active',
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- Holds Table
CREATE TABLE holds (
  HoldID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  ItemID INT NOT NULL,
  ItemType ENUM('Book', 'Media', 'Electronics') NOT NULL,
  RequestedAt DATETIME NOT NULL,
  HoldStatus ENUM('Pending', 'Active', 'Fulfilled', 'Canceled') NOT NULL DEFAULT 'Pending',
  NotificationSent BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- Rooms Table
CREATE TABLE Rooms (
  RoomID INT AUTO_INCREMENT PRIMARY KEY,
  RoomNumber VARCHAR(50) UNIQUE NOT NULL,
  Capacity INT NOT NULL,
  RoomName VARCHAR(50),
  Notes TEXT,
  Status ENUM('Available', 'Maintenance', 'Reserved') NOT NULL DEFAULT 'Available'
);

-- Room Reservation Table
CREATE TABLE RoomReservation (
  RoomReservationID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  RoomID INT NOT NULL,
  StartTime DATETIME NOT NULL,
  EndTime DATETIME NOT NULL,
  Purpose VARCHAR(200),
  Status ENUM('Pending', 'Confirmed', 'Canceled', 'Completed') NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (UserID) REFERENCES users(UserID),
  FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

-- Fines Table
CREATE TABLE fines (
  FineID INT AUTO_INCREMENT PRIMARY KEY,
  LoanID INT NOT NULL,
  UserID INT NOT NULL,
  Amount DECIMAL(10, 2) NOT NULL,
  IssuedDate DATETIME NOT NULL,
  PaidDate DATETIME,
  Status ENUM('Paid', 'Unpaid') NOT NULL DEFAULT 'Unpaid',
  FOREIGN KEY (LoanID) REFERENCES loans(LoanID),
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- Notifications Table
CREATE TABLE notifications (
  NotificationID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  MessageType ENUM('Due Date Reminder', 'Overdue Alert', 'Hold Ready', 'Event Reminder', 'System Notice') NOT NULL,
  MessageContent TEXT NOT NULL,
  SentDateTime DATETIME NOT NULL,
  Acknowledged BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- Events Table
CREATE TABLE events (
  EventID INT AUTO_INCREMENT PRIMARY KEY,
  HostUserID INT NOT NULL,
  EventName VARCHAR(200) NOT NULL,
  Description TEXT,
  StartTime DATETIME NOT NULL,
  EndTime DATETIME NOT NULL,
  RoomID INT,
  MaxAttendees INT,
  Status ENUM('Scheduled', 'Canceled', 'Completed') NOT NULL DEFAULT 'Scheduled',
  FOREIGN KEY (HostUserID) REFERENCES users(UserID),
  FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);

-- Event Attendees Table
CREATE TABLE eventAttendees (
  EventAttendeeID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT NOT NULL,
  EventID INT NOT NULL,
  RegisteredDate DATETIME NOT NULL,
  CheckedIn BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (UserID) REFERENCES users(UserID),
  FOREIGN KEY (EventID) REFERENCES events(EventID)
);