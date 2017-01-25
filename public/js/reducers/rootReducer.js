import { combineReducers } from 'redux';
import config from './configReducer';
import error from './errorReducer';

export default combineReducers({
  config,
  error
});