import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomHasNotificationBeenSent(atomId, questionId) {
  return {
    type:       'ATOM_HAS_NOTIFICATION_REQUEST',
    atomId, questionId,
    receivedAt: Date.now()
  };
}

function receiveAtomHasNotificationBeenSent(sent) {
  return {
    type:       'ATOM_HAS_NOTIFICATION_RECEIVE',
    sent,
    receivedAt: Date.now()
  };
}

function errorSendingNotificationList(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not check if notifications have been sent',
    error,
    receivedAt: Date.now()
  };
}

export function hasNotificationBeenSent(atomId, questionId) {
  return dispatch => {
    dispatch(requestAtomHasNotificationBeenSent(atomId, questionId));
    return AtomsApi.hasNotificationBeenSent(atomId, questionId)
      .then(res => res.json())
      .then(sent => {
        dispatch(receiveAtomHasNotificationBeenSent(sent));
        return sent;
      })
      .catch(error => dispatch(errorSendingNotificationList(error)));
  };
}
