function updateRequest(queryStr) { 
  return { 
    type: 'SEARCH_SUGGESTIONS_UPDATE',
    queryStr
  };
}

export function update(queryStr) {
  return dispatch => {
    dispatch(updateRequest(queryStr));
  };
}
