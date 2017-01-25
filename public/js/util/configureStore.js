import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import config from '../reducers/configReducer';
import error from '../reducers/errorReducer';

const rootReducer = combineReducers({
  config,
  error
});

const createStoreWithMiddleware = compose(
    applyMiddleware(
        thunkMiddleware
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}