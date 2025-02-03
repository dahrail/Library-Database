# Library Fullstack Application

This project is a fullstack library management system that allows students and faculty to borrow books, media, and devices. It includes features for tracking item IDs, managing multiple copies, calculating fines for late returns, and enabling users to request or hold items.

## Features

- Borrowing and returning items with different limits and durations for students and faculty.
- Tracking of item IDs and management of multiple copies.
- Fine calculation for late returns.
- Ability to request or hold items.

## Project Structure

```
library-fullstack-app
├── backend
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   └── libraryController.ts
│   │   ├── models
│   │   │   └── libraryModel.ts
│   │   ├── routes
│   │   │   └── libraryRoutes.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── client
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   │   └── LibraryInterface.tsx
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- TypeScript

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the client directory and install dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the client application:
   ```
   cd ../client
   npm start
   ```

### Usage

- Access the client application in your browser at `http://localhost:3000`.
- Use the interface to borrow, return, request, or hold items.

## License

This project is licensed under the MIT License.