import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ItemList from './components/ItemList';
import PatronDashboard from './components/PatronDashboard';
import BorrowRequest from './components/BorrowRequest';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Library Management System</h1>
        <Switch>
          <Route path="/" exact component={ItemList} />
          <Route path="/dashboard" component={PatronDashboard} />
          <Route path="/borrow" component={BorrowRequest} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;