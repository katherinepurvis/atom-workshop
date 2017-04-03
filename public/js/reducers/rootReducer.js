import {combineReducers } from 'redux';

import config from '../reducers/configReducer';
import presenceClient from '../reducers/presenceClientReducer';
import presence from '../reducers/presenceReducer';
import error from '../reducers/errorReducer';
import formErrors from '../reducers/formErrorsReducer';
import atom from '../reducers/atomReducer';
import saveState from '../reducers/saveStateReducer';
import atomList from '../reducers/atomListReducer';
import atomUsages from '../reducers/atomUsagesReducer';
import externalAtom from '../reducers/externalAtomReducer';
import queryParams from '../reducers/queryParamsReducer';

export const rootReducer = combineReducers({
  config,
  presenceClient,
  presence,
  error,
  formErrors,
  atom,
  saveState,
  atomList,
  atomUsages,
  externalAtom,
  queryParams
});
