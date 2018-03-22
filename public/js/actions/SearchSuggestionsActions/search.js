import { searchAtoms } from '../../services/capi';

function searchRequest(id, query) { 
  return { 
    type: 'SEARCH_SUGGESTIONS_SEARCH_REQUEST',
    query,
    id
  };
}

function searchResponse(id, results) {
  return {
    type: 'SEARCH_SUGGESTIONS_SEARCH_RESPONSE',
    results,
    id
  };
}

function searchError(id, err) {
  return {
    type: 'SEARCH_SUGGESTIONS_SEARCH_ERROR',
    err,
    id
  };
}

export function search(id, query) {
  return dispatch => {
    dispatch(searchRequest(id, query));
    searchAtoms(query)
      .then(results => dispatch(searchResponse(id, results)))
      .catch(err => dispatch(searchError(id, err)));
  };
}
