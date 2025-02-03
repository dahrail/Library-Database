# Library App

## Overview
The Library App is a fullstack application that allows students and faculty to borrow books, media, and devices from a library. It manages borrowing limits, due dates, fines, and holds/requests for items.

## Features
- Borrowing functionality with different limits for students and faculty.
- Ability to request/hold items.
- Management of due dates and fines for late returns.
- User dashboard for tracking borrowed items and fines.

## Project Structure
```
library-app
├── client                # React frontend
│   ├── public
│   │   └── index.html    # Main HTML file
│   ├── src
│   │   ├── App.js        # Main React component
│   │   ├── index.js      # Entry point for React app
│   │   ├── components     # React components
│   │   │   ├── BorrowRequest.js
│   │   │   ├── ItemList.js
│   │   │   └── PatronDashboard.js
│   │   └── styles.css    # CSS styles
│   └── package.json      # Client dependencies
├── server                # Node.js backend
│   ├── controllers
│   │   └── libraryController.js  # Business logic
│   ├── models
│   │   └── libraryModel.js       # Database models
│   ├── routes
│   │   └── libraryRoutes.js      # API routes
│   ├── app.js            # Entry point for server
│   └── package.json      # Server dependencies
├── package.json          # Overall project dependencies
└── README.md             # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd library-app
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application
1. Start the server:
   ```
   cd server
   npm start
   ```

2. Start the client:
   ```
   cd ../client
   npm start
   ```

### Usage
- Access the application in your browser at `http://localhost:3000`.
- Users can log in as students or faculty to manage their borrowing activities.

## Contributing
Feel free to submit issues or pull requests for improvements and bug fixes.