import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';

import configureStore from './util/configureStore';
import { routes } from './routes';

import '../styles/main.scss';

function extractConfigFromPage() {

    const configEl = document.getElementById('config');

    if (!configEl) {
        return {};
    }

    return JSON.parse(configEl.innerHTML);
}

const client = new ApolloClient();

const store = configureStore(client);
const config = extractConfigFromPage();

// Send config to store on init
store.dispatch({
    type:       'CONFIG_RECEIVED',
    config:     extractConfigFromPage(),
    receivedAt: Date.now()
});

render(
    <ApolloProvider client={client} store={store}>
      {routes}
    </ApolloProvider>
    , document.getElementById('react-mount'));