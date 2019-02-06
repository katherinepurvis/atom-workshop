export default function audioPageData (state = null, action) {
  switch (action.type) {

    case 'REQUEST_AUDIO_PAGE_DATA': {
      const newState = {
        error: null,
        message: ''
      };
      return Object.assign({}, state, newState);
    }

    case 'RECEIVE_AUDIO_PAGE_DATA': {
      const newState = {
        message: action.message,
        audioPageData: action.audioPageData.content
      };
      return Object.assign({}, state, newState);
    }

    case 'ERROR_RECEIVING_AUDIO_PAGE_DATA': {
      const newState = {
        error: action.error,
        audioPageData: {},
        message: action.message
      };
      return Object.assign({}, state, newState);
    }

    default:
      return state;
  }
}

