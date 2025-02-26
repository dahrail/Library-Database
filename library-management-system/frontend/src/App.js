import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BorrowingsPage from './pages/BorrowingsPage';
import ReservationsPage from './pages/ReservationsPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/dashboard/StudentDashboard';
import FacultyDashboard from './components/dashboard/FacultyDashboard';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/books" component={BooksPage} />
        <Route path="/borrowings" component={BorrowingsPage} />
        <Route path="/reservations" component={ReservationsPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/student-dashboard" component={StudentDashboard} />
        <Route path="/faculty-dashboard" component={FacultyDashboard} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;