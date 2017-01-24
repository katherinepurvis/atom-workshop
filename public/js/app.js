import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './util/configureStore';
import { routes } from './routes';

import '../styles/main.scss';

const store = configureStore();

render(
    <Provider store={store}>
      {routes}
    </Provider>
    , document.getElementById('react-mount'));