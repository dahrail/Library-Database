import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LibraryInterface from './components/LibraryInterface';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LibraryInterface} />
        {/* Additional routes can be added here */}
      </Switch>
    </Router>
  );
};

export default App;