import {combineReducers } from 'redux';

import config from '../reducers/configReducer';
import error from '../reducers/errorReducer';
import atom from '../reducers/atomReducer';

export const rootReducer = combineReducers({
  config,
  error,
  atom
});
