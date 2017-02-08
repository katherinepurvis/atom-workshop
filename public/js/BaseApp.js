import React from 'react';
import { Provider } from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';

import ReactApp from './components/ReactApp';

export class BaseApp extends React.Component {
  render () {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory}>
          <Route path="/" component={ReactApp}></Route>
        </Router>
      </Provider>
    )
  }
}
