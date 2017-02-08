import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import {rootReducer} from '../reducers/rootReducer.js';

const createStoreWithMiddleware = compose(
    applyMiddleware(
        thunkMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function configureStore(initialState) {

  const store = createStoreWithMiddleware(rootReducer, initialState);

  //Hot Reloading code
  if (module.hot) {
    module.hot.accept('../reducers/rootReducer.js', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
