import React from 'react';
import { withTranslation } from 'react-i18next';
import { Router, Route, Switch } from 'react-router-dom';
import { browserHistory } from './utils/history';
import Layout from './pages/layout';
import { routes, privateRoutes } from './Routes';

function App() {
  return (
    <div className="App bg-app">
      <Router history={browserHistory}>
        <Switch>
          <Route path={[...routes, ...privateRoutes].map((item) => item.path)} component={Layout} />
        </Switch>
      </Router>
    </div>
  );
}

export default withTranslation()(App);

