export default function suggestions(state = { queryStr: '', query: null, results: null }, action) {
  switch(action.type) {
  case 'SEARCH_SUGGESTIONS_CANCEL':
    return {
      queryStr: '',
      query: null,
      results: null
    };

  case 'SEARCH_SUGGESTIONS_UPDATE':
    return Object.assign({}, state, {
      queryStr: action.queryStr
    });

  case 'SEARCH_SUGGESTIONS_SEARCH_REQUEST':
    return Object.assign({}, state, {
      query: action.query
    });

  case 'SEARCH_SUGGESTIONS_SEARCH_RESPONSE':
    return Object.assign({}, state, {
      results: action.results
    });

  default:
    return state;
  }
}
