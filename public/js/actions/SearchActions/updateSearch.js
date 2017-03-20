//NOTE: THIS JUST SAVES THE SEARCH PARAMS TO THE REDUX STORE
export function updateSearch(search) {
  return {
    type:       'SEARCH_UPDATE_REQUEST',
    search:      search,
    receivedAt: Date.now()
  };
}
