# Library Management System Backend

This is the backend part of the Library Management System project. It is built using Node.js and Express, and it connects to a MySQL database to manage library items, user authentication, borrowing, and fines.

## Features

- User authentication for students and faculty
- Management of library items (books, media, devices, etc.)
- Borrowing functionality with different limits for students and faculty
- Fine calculation for overdue items
- Ability to request/hold items

## Project Structure

- **config/**: Contains configuration files, including database connection settings.
- **controllers/**: Contains the logic for handling requests related to users, items, borrowing, and fines.
- **models/**: Defines the data models for users, items, copies, borrowings, and fines.
- **routes/**: Contains the route definitions for handling API requests.
- **middleware/**: Contains middleware functions for authentication checks.
- **server.js**: The main entry point for the backend application.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd library-management-system/backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up the database:
   - Create a MySQL database and run the SQL schema located in `../database/schema.sql`.

5. Configure the database connection in `config/db.config.js`.

6. Start the server:
   ```
   npm start
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/login`: Log in a user.
  - `POST /api/auth/register`: Register a new user.

- **Items**
  - `GET /api/items`: Retrieve all items.
  - `POST /api/items`: Add a new item.
  - `GET /api/items/:id`: Retrieve a specific item by ID.

- **Borrowing**
  - `POST /api/borrowings`: Borrow an item.
  - `GET /api/borrowings`: Retrieve borrowing history for a user.

- **Fines**
  - `GET /api/fines`: Retrieve fines for a user.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.