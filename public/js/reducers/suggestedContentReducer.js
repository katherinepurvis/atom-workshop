export default function suggestedContent(state = null, action) {
  switch (action.type) {

    case 'SUGGESTED_CONTENT_GET_RECEIVE':
      return action.suggestedContent || null;

    default:
      return state;
  }
}
