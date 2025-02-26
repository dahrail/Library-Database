# Library Management System - Server

This is the server-side implementation of the Library Management System. The server is built using Node.js and Express, and it interacts with a MySQL database to manage users, books, loans, holds, fines, and more.

## Features

- User authentication and authorization
- Management of books, media, and electronics
- Loan management with due dates and renewals
- Hold requests for items
- Fine management for overdue items
- Room reservation system
- Event management and notifications

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MySQL (version 5.7 or higher)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd library-management-system
   ```

2. Navigate to the server directory:
   ```
   cd server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Set up the database:
   - Create a MySQL database and configure the connection in `config/db.js`.
   - Run the SQL schema in `db/schema.sql` to create the necessary tables.
   - Optionally, run `db/seed.sql` to populate the database with initial data.

### Running the Server

To start the server, run the following command:
```
npm start
```

The server will start on the specified port (default is 5000). You can access the API at `http://localhost:5000`.

### API Documentation

Refer to the individual route files in the `routes` directory for detailed information on the available endpoints and their usage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.