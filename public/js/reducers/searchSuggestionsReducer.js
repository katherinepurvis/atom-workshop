export default function suggestions(state = {}, action) {
  switch(action.type) {
  case 'SEARCH_SUGGESTIONS_CANCEL':
    return Object.assign({}, state, {
      [action.id]: {
        queryStr: '',
        query: null,
        results: null
      }
    });

  case 'SEARCH_SUGGESTIONS_UPDATE':
    return Object.assign({}, state, {
      [action.id]: Object.assign({}, state[action.id], {
        queryStr: action.queryStr
      })
    });

  case 'SEARCH_SUGGESTIONS_SEARCH_REQUEST':
    return Object.assign({}, state, {
      [action.id]: Object.assign({}, state[action.id], {
        query: action.query
      })
    });

  case 'SEARCH_SUGGESTIONS_SEARCH_RESPONSE':
    return Object.assign({}, state, {
      [action.id]: Object.assign({}, state[action.id], {
        results: action.results
      })
    });

  default:
    return state;
  }
}
