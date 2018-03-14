function cancelRequest() { 
  return { 
    type: 'SEARCH_SUGGESTIONS_CANCEL'
  };
}

export function cancel() {
  return dispatch => {
    dispatch(cancelRequest());
  };
}
