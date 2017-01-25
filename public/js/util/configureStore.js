import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

//import all reducers
import config from '../reducers/configReducer';
import error from '../reducers/errorReducer';


export default function configureStore(client) {

  //combine reducers
  const rootReducer = combineReducers({
    config,
    error,
    apollo: client.reducer() || {}
  });

  return createStore(
      rootReducer,
      compose(
          applyMiddleware(
              thunkMiddleware,
              client.middleware()
          ),
          window.devToolsExtension ? window.devToolsExtension() : f => f
      )
  );
};