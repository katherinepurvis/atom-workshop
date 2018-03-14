import { searchAtoms } from '../../services/capi';

function searchRequest(query) { 
  return { 
    type: 'SEARCH_SUGGESTIONS_SEARCH_REQUEST',
    query
  };
}

function searchResponse(results) {
  return {
    type: 'SEARCH_SUGGESTIONS_SEARCH_RESPONSE',
    results
  };
}

function searchError(err) {
  return {
    type: 'SEARCH_SUGGESTIONS_SEARCH_ERROR',
    err
  };
}

export function search(query) {
  return dispatch => {
    dispatch(searchRequest(query));
    searchAtoms(query)
      .then(results => dispatch(searchResponse(results)))
      .catch(err => dispatch(searchError(err)));
  };
}
