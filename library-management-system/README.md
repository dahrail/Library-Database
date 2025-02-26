# Library Management System

This project is a fullstack Library Management System that allows students and faculty to borrow books, media, and devices. It includes a frontend built with React and a backend powered by Node.js with a MySQL database.

## Features

- **User Authentication**: Users can register and log in to their accounts.
- **Book Management**: Users can view available books, borrow items, and check their borrowing history.
- **Reservation System**: Users can place requests or holds on items.
- **Fine Management**: The system calculates fines for overdue items based on user type (student or faculty).
- **Dashboard**: Separate dashboards for students and faculty to manage their borrowing and reservations.

## Project Structure

```
library-management-system
├── frontend                # Frontend React application
│   ├── public
│   │   └── index.html     # Main HTML file
│   ├── src
│   │   ├── components      # React components
│   │   ├── pages          # React pages
│   │   ├── services       # API service calls
│   │   ├── App.js         # Main application component
│   │   └── index.js       # Entry point for React
│   └── package.json       # Frontend dependencies
├── backend                 # Backend Node.js application
│   ├── config              # Configuration files
│   ├── controllers         # Request handlers
│   ├── models              # Database models
│   ├── routes              # API routes
│   ├── middleware          # Middleware functions
│   ├── server.js           # Entry point for the backend
│   └── package.json        # Backend dependencies
├── database                # Database schema
│   └── schema.sql         # SQL schema for database setup
└── README.md              # Overall project documentation
```

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd library-management-system
   ```

2. Set up the database:
   - Create a MySQL database and run the `schema.sql` file located in the `database` directory to set up the necessary tables.

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```

2. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.