import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import AddBook from "./Components/Books/AddBook";
import BookList from "./Components/Books/BookList";
import BookDetails from "./Components/Books/BookDetails";
import EditBook from "./Components/Books/EditBook";
import RequestBook from "./Components/Books/RequestBook";
import BorrowingForm from "./Components/Borrowing/BorrowingForm";
import ReturnForm from "./Components/Borrowing/ReturnForm";
import UserBorrowings from "./Components/Borrowing/UserBorrowings";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import FacultyDashboard from "./Components/Dashboard/FacultyDashboard";
import StudentDashboard from "./Components/Dashboard/StudentDashboard";
import FineReport from "./Components/Reports/FineReport";
import InventoryReport from "./Components/Reports/InventoryReport";
import BorrowingReport from "./Components/Reports/BorrowingReport";
import Header from "./Components/shared/Header";
import Footer from "./Components/shared/Footer";
import Navigation from "./Components/shared/Navigation";

function App() {
  return (
    <>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="/books/request/:id" element={<RequestBook />} />
        <Route path="/borrow" element={<BorrowingForm />} />
        <Route path="/return" element={<ReturnForm />} />
        <Route path="/my-borrowings" element={<UserBorrowings />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/reports/fines" element={<FineReport />} />
        <Route path="/reports/inventory" element={<InventoryReport />} />
        <Route path="/reports/borrowings" element={<BorrowingReport />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;