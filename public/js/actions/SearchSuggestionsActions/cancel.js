function cancelRequest(id) { 
  return { 
    type: 'SEARCH_SUGGESTIONS_CANCEL',
    id
  };
}

export function cancel(id) {
  return dispatch => {
    dispatch(cancelRequest(id));
  };
}
