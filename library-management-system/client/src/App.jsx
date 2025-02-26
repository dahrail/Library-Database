import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookList from './components/books/BookList';
import BookDetail from './components/books/BookDetail';
import LoanHistory from './components/loans/LoanHistory';
import NewLoan from './components/loans/NewLoan';
import HoldsList from './components/holds/HoldsList';
import CreateHold from './components/holds/CreateHold';
import FinesList from './components/fines/FinesList';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/books" component={BookList} />
          <Route path="/books/:id" component={BookDetail} />
          <Route path="/loans" component={LoanHistory} />
          <Route path="/loans/new" component={NewLoan} />
          <Route path="/holds" component={HoldsList} />
          <Route path="/holds/new" component={CreateHold} />
          <Route path="/fines" component={FinesList} />
          <Route path="/admin/dashboard" component={Dashboard} />
          <Route path="/admin/users" component={UserManagement} />
        </Switch>
      </MainLayout>
    </Router>
  );
};

export default App;