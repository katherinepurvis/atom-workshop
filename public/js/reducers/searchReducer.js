export default function search(state = null, action) {
  switch (action.type) {
    case 'SEARCH_UPDATE_REQUEST':
      return action.search || false;

    default:
      return state;
  }
}
