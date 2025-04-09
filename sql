-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: team7library.mysql.database.azure.com    Database: librarynew
-- ------------------------------------------------------
-- Server version	8.0.40-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `BookID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(250) NOT NULL,
  `Author` varchar(250) DEFAULT NULL,
  `Genre` varchar(50) DEFAULT NULL,
  `PublicationYear` int DEFAULT NULL,
  `Publisher` varchar(100) DEFAULT NULL,
  `Language` varchar(50) DEFAULT NULL,
  `Format` varchar(50) DEFAULT NULL,
  `ISBN` varchar(13) NOT NULL,
  PRIMARY KEY (`BookID`),
  UNIQUE KEY `ISBN` (`ISBN`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,'1984','George Orwell','Fiction',1949,'Secker & Warburg','English','Hardback','9780451524935');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_inventory`
--

DROP TABLE IF EXISTS `book_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_inventory` (
  `BookInventoryID` int NOT NULL AUTO_INCREMENT,
  `BookID` int NOT NULL,
  `TotalCopies` int NOT NULL,
  `AvailableCopies` int NOT NULL,
  `ShelfLocation` varchar(50) NOT NULL,
  PRIMARY KEY (`BookInventoryID`),
  KEY `BookID` (`BookID`),
  CONSTRAINT `book_inventory_ibfk_1` FOREIGN KEY (`BookID`) REFERENCES `book` (`BookID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `book_inventory_chk_1` CHECK ((`AvailableCopies` <= `TotalCopies`))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_inventory`
--

LOCK TABLES `book_inventory` WRITE;
/*!40000 ALTER TABLE `book_inventory` DISABLE KEYS */;
INSERT INTO `book_inventory` VALUES (1,1,2,2,'100');
/*!40000 ALTER TABLE `book_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device`
--

DROP TABLE IF EXISTS `device`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device` (
  `DeviceID` int NOT NULL AUTO_INCREMENT,
  `Type` enum('Headphone','Ipad','Laptop') NOT NULL,
  `Brand` varchar(50) DEFAULT NULL,
  `Model` varchar(50) DEFAULT NULL,
  `SerialNumber` varchar(50) NOT NULL,
  PRIMARY KEY (`DeviceID`),
  UNIQUE KEY `SerialNumber` (`SerialNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device`
--

LOCK TABLES `device` WRITE;
/*!40000 ALTER TABLE `device` DISABLE KEYS */;
/*!40000 ALTER TABLE `device` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_inventory`
--

DROP TABLE IF EXISTS `device_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_inventory` (
  `DeviceInventoryID` int NOT NULL AUTO_INCREMENT,
  `DeviceID` int NOT NULL,
  `TotalCopies` int NOT NULL,
  `AvailableCopies` int NOT NULL,
  `ShelfLocation` varchar(50) NOT NULL,
  PRIMARY KEY (`DeviceInventoryID`),
  KEY `DeviceID` (`DeviceID`),
  CONSTRAINT `device_inventory_ibfk_1` FOREIGN KEY (`DeviceID`) REFERENCES `device` (`DeviceID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `device_inventory_chk_1` CHECK ((`AvailableCopies` <= `TotalCopies`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_inventory`
--

LOCK TABLES `device_inventory` WRITE;
/*!40000 ALTER TABLE `device_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `EventID` int NOT NULL AUTO_INCREMENT,
  `EventCategory` enum('Workshops','Seminar','Conference') NOT NULL,
  `UserID` int NOT NULL,
  `EventName` varchar(250) NOT NULL,
  `RoomID` int NOT NULL,
  `StartAt` datetime NOT NULL,
  `EndAt` datetime NOT NULL,
  `MaxAttendees` int DEFAULT NULL,
  `EventDescription` varchar(250) DEFAULT NULL,

  PRIMARY KEY (`EventID`),
  KEY `UserID` (`UserID`),
  KEY `RoomID` (`RoomID`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `room` (`RoomID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_attendee`
--

DROP TABLE IF EXISTS `event_attendee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_attendee` (
  `EventAttendeeID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `EventID` int NOT NULL,
  `CheckedIn` tinyint(1) DEFAULT NULL,
  `CheckedInAt` datetime DEFAULT NULL,
  PRIMARY KEY (`EventAttendeeID`),
  KEY `UserID` (`UserID`),
  KEY `EventID` (`EventID`),
  CONSTRAINT `event_attendee_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `event_attendee_ibfk_2` FOREIGN KEY (`EventID`) REFERENCES `event` (`EventID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_attendee`
--

LOCK TABLES `event_attendee` WRITE;
/*!40000 ALTER TABLE `event_attendee` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_attendee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fine`
--

DROP TABLE IF EXISTS `fine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fine` (
  `FineID` int NOT NULL AUTO_INCREMENT,
  `LoanID` int NOT NULL,
  `Amount` decimal(10,2) DEFAULT '0.00',
  `PaymentStatus` enum('Paid','Unpaid') DEFAULT NULL,
  PRIMARY KEY (`FineID`),
  UNIQUE KEY `LoanID` (`LoanID`),
  CONSTRAINT `fine_ibfk_1` FOREIGN KEY (`LoanID`) REFERENCES `loan` (`LoanID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fine`
--

LOCK TABLES `fine` WRITE;
/*!40000 ALTER TABLE `fine` DISABLE KEYS */;
/*!40000 ALTER TABLE `fine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hold`
--

DROP TABLE IF EXISTS `hold`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hold` (
  `HoldID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ItemType` enum('Book','Media','Device') NOT NULL,
  `ItemID` int NOT NULL,
  `RequestAT` datetime NOT NULL,
  `HoldStatus` enum('Pending','Active','Fulfilled','Canceled') NOT NULL,
  PRIMARY KEY (`HoldID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `hold_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hold`
--

LOCK TABLES `hold` WRITE;
/*!40000 ALTER TABLE `hold` DISABLE KEYS */;
/*!40000 ALTER TABLE `hold` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `library_card`
--

DROP TABLE IF EXISTS `library_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `library_card` (
  `LibraryCardID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `IssueDate` date NOT NULL,
  `ExpirationDate` date NOT NULL,
  `LibraryCardStatus` enum('Active','Expired','Lost') DEFAULT NULL,
  PRIMARY KEY (`LibraryCardID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `library_card_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `library_card`
--

LOCK TABLES `library_card` WRITE;
/*!40000 ALTER TABLE `library_card` DISABLE KEYS */;
/*!40000 ALTER TABLE `library_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan`
--

DROP TABLE IF EXISTS `loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan` (
  `LoanID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `ItemType` enum('Book','Media','Device') DEFAULT NULL,
  `ItemID` int NOT NULL,
  `BorrowedAt` datetime NOT NULL,
  `DueAT` datetime NOT NULL,
  `ReturnedAt` datetime DEFAULT NULL,
  `RenewalCount` datetime DEFAULT NULL,
  PRIMARY KEY (`LoanID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `loan_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan`
--

LOCK TABLES `loan` WRITE;
/*!40000 ALTER TABLE `loan` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loan_limit`
--

DROP TABLE IF EXISTS `loan_limit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan_limit` (
  `LoanLimitID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `LoanPeriod` int NOT NULL,
  `BookLimit` int NOT NULL,
  `NumberBookBorrowed` int NOT NULL,
  `MediaLimit` int NOT NULL,
  `NumberMediaBorrowed` int NOT NULL,
  `DeviceLimit` int NOT NULL,
  `NumberDeviceBorrowed` int NOT NULL,
  PRIMARY KEY (`LoanLimitID`),
  UNIQUE KEY `UserID` (`UserID`),
  CONSTRAINT `loan_limit_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loan_limit`
--

LOCK TABLES `loan_limit` WRITE;
/*!40000 ALTER TABLE `loan_limit` DISABLE KEYS */;
/*!40000 ALTER TABLE `loan_limit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `MediaID` int NOT NULL AUTO_INCREMENT,
  `Type` enum('Music','Movie') NOT NULL,
  `Title` varchar(250) NOT NULL,
  `Author` varchar(250) DEFAULT NULL,
  `Genre` varchar(50) DEFAULT NULL,
  `PublicationYear` int DEFAULT NULL,
  `Language` varchar(50) DEFAULT NULL,
  `Format` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`MediaID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_inventory`
--

DROP TABLE IF EXISTS `media_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_inventory` (
  `MediaInventoryID` int NOT NULL AUTO_INCREMENT,
  `MediaID` int NOT NULL,
  `TotalCopies` int NOT NULL,
  `AvailableCopies` int NOT NULL,
  `ShelfLocation` varchar(50) NOT NULL,
  PRIMARY KEY (`MediaInventoryID`),
  KEY `MediaID` (`MediaID`),
  CONSTRAINT `media_inventory_ibfk_1` FOREIGN KEY (`MediaID`) REFERENCES `media` (`MediaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `media_inventory_chk_1` CHECK ((`AvailableCopies` <= `TotalCopies`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_inventory`
--

LOCK TABLES `media_inventory` WRITE;
/*!40000 ALTER TABLE `media_inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `NotificationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `MessageType` enum('Due_Date_Reminder','Overdue_Alert','Hold_Ready') DEFAULT NULL,
  `SentAt` datetime DEFAULT NULL,
  `Acknowledged` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`NotificationID`),
  KEY `NOTIFICATION` (`UserID`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `RoomID` int NOT NULL AUTO_INCREMENT,
  `RoomNumber` varchar(50) NOT NULL,
  `RoomName` varchar(50) DEFAULT NULL,
  `Capacity` int DEFAULT NULL,
  `Notes` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`RoomID`),
  UNIQUE KEY `RoomNumber` (`RoomNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_reservation`
--

DROP TABLE IF EXISTS `room_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_reservation` (
  `RoomReservationID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `RoomID` int NOT NULL,
  `StartAt` datetime NOT NULL,
  `EndAt` datetime NOT NULL,
  PRIMARY KEY (`RoomReservationID`),
  KEY `UserID` (`UserID`),
  KEY `RoomID` (`RoomID`),
  CONSTRAINT `room_reservation_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `room_reservation_ibfk_2` FOREIGN KEY (`RoomID`) REFERENCES `room` (`RoomID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_reservation`
--

LOCK TABLES `room_reservation` WRITE;
/*!40000 ALTER TABLE `room_reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `room_reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `PhoneNumber` int DEFAULT NULL,
  `Role` enum('Student','Faculty','Admin') NOT NULL,
  `AccountCreateAt` datetime NOT NULL,
  `AccountStatus` enum('Active','Suspended') DEFAULT 'Active',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`,`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','adminpass','Team7','Admin','a@ex.com',5,'Admin','2025-03-20 10:27:15','Active');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 18:09:24
