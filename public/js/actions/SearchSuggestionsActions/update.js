function updateRequest(id, queryStr) { 
  return { 
    type: 'SEARCH_SUGGESTIONS_UPDATE',
    queryStr,
    id
  };
}

export function update(id, queryStr) {
  return dispatch => {
    dispatch(updateRequest(id, queryStr));
  };
}
