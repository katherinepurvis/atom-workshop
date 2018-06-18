import _isEmpty from 'lodash/isEmpty';
import {searchParams} from '../constants/queryParams';

export default function queryParams(state = searchParams, action) {
  switch (action.type) {

    case 'QUERYPARAMS_UPDATE': {
      if(_isEmpty(action.queryParams)) {
        return searchParams;
      } else {
        return action.queryParams;
      }
    }

    default:
      return state;
  }
}