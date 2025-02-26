# Library Management System Frontend

This is the frontend part of the Library Management System, built using React. The application allows students and faculty to borrow books, media, and devices from the library, with different borrowing limits and durations for each user type.

## Features

- User Authentication: Users can register and log in to their accounts.
- Book Management: Users can view a list of available books and their details.
- Borrowing System: Users can borrow items, with limits based on their user type (student or faculty).
- Reservations: Users can place requests or holds on items.
- Fine Management: The system calculates fines for overdue items.

## Project Structure

- `public/index.html`: Main HTML file for the React application.
- `src/components/auth`: Contains components for user authentication (Login and Register).
- `src/components/books`: Contains components for displaying books (BookCard and BookList).
- `src/components/common`: Contains common components (Header and Footer).
- `src/components/dashboard`: Contains dashboard components for students and faculty.
- `src/pages`: Contains page components for different views (Home, Books, Borrowings, Reservations).
- `src/services`: Contains services for handling API calls related to authentication and books.
- `src/App.js`: Main component that sets up routing for the application.
- `src/index.js`: Entry point for the React application.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd library-management-system/frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Dependencies

- React
- React Router
- Axios (for API calls)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.