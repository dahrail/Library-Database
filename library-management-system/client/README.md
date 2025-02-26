# Library Management System - Client

This is the client-side of the Library Management System built using React. The application allows students and faculty to manage their library accounts, borrow books, media, and electronics, and handle fines and holds.

## Features

- **User Authentication**: Users can register and log in to their accounts.
- **Book Management**: Users can view a list of available books and see detailed information about each book.
- **Loan Management**: Users can view their loan history and create new loans for items.
- **Hold Management**: Users can place holds on items and view their current holds.
- **Fine Management**: Users can view any fines associated with their account.
- **Admin Dashboard**: Admin users can manage user accounts and view system statistics.

## Project Structure

- **public/**: Contains static files like `index.html` and `favicon.ico`.
- **src/**: Contains all the React components, context, hooks, services, and utility functions.
  - **components/**: Organized by feature (auth, books, loans, holds, fines, admin, common, layout).
  - **context/**: Contains context for managing authentication state.
  - **hooks/**: Custom hooks for handling authentication logic.
  - **services/**: API service files for handling requests to the backend.
  - **utils/**: Utility functions used throughout the application.
- **package.json**: Contains project dependencies and scripts.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the client directory:
   ```
   cd library-management-system/client
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you would like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.