# Library Management System

## Overview
The Library Management System is a full-stack application designed to facilitate the management of library resources, including books, media, electronics, and room reservations. It allows users to borrow items, place holds, and manage fines, while providing an administrative interface for user and resource management.

## Features
- **User Authentication**: Users can register and log in to access their accounts.
- **Resource Management**: Users can view, borrow, and hold books, media, and electronics.
- **Loan Management**: Users can track their loan history and renew loans.
- **Fine Management**: Users can view and pay fines associated with overdue items.
- **Admin Dashboard**: Admins can manage users, resources, and view system statistics.
- **Room Reservations**: Users can reserve rooms for events or meetings.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MySQL

## Project Structure
```
library-management-system
├── client                # Frontend application
│   ├── public            # Public assets
│   ├── src               # Source code for React application
│   └── README.md         # Client-side documentation
├── server                # Backend application
│   ├── config            # Configuration files
│   ├── controllers       # Request handlers
│   ├── middleware        # Middleware functions
│   ├── models            # Database models
│   ├── routes            # API routes
│   ├── utils             # Utility functions
│   ├── app.js            # Express application setup
│   ├── server.js         # Server entry point
│   └── README.md         # Server-side documentation
├── db                    # Database scripts
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Seed data
├── package.json          # Project dependencies and scripts
└── README.md             # Overall project documentation
```

## Getting Started
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd library-management-system
   ```

2. **Setup the database**:
   - Create a MySQL database and run the `db/schema.sql` to set up the tables.
   - Optionally, run `db/seed.sql` to populate the database with initial data.

3. **Install dependencies**:
   - Navigate to the `client` directory and run:
     ```
     npm install
     ```
   - Navigate to the `server` directory and run:
     ```
     npm install
     ```

4. **Run the application**:
   - Start the backend server:
     ```
     cd server
     node server.js
     ```
   - Start the frontend application:
     ```
     cd client
     npm start
     ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.