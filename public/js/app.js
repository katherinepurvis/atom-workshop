import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';


import configureStore from './util/configureStore';
import { setStore } from './util/storeAccessor';

import {BaseApp} from './BaseApp.js';

import '../styles/main.scss';

function extractConfigFromPage() {

    const configEl = document.getElementById('config');

    if (!configEl) {
        return {};
    }

    return JSON.parse(configEl.innerHTML);
}


const store = configureStore();
const config = extractConfigFromPage();

setStore(store);

// Send config to store on init
store.dispatch({
    type:       'CONFIG_RECEIVED',
    config:     extractConfigFromPage(),
    receivedAt: Date.now()
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      {Component}
    </AppContainer>,
    document.getElementById('react-mount')
  );
};


render(<BaseApp store={store} />);


//Hot Reloading code
if (module.hot) {
  module.hot.accept('./BaseApp.js', () => {
    render(<BaseApp store={store} />);
  });
}
