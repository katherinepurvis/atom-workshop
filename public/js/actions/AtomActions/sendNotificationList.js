import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomSendNotificationList(atom) {
  return {
    type:       'ATOM_SEND_NOTIFICATION_REQUEST',
    atom,
    receivedAt: Date.now()
  };
}

function receiveAtomSendNotificationList(atom) {
  return {
    type:       'ATOM_SEND_NOTIFICATION_RECEIVE',
    atom,
    receivedAt: Date.now()
  };
}

function errorSendingNotificationList(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not send email to notification list',
    error,
    receivedAt: Date.now()
  };
}

export function sendNotificationList(atom) {
  return dispatch => {
    dispatch(requestAtomSendNotificationList(atom));
    return AtomsApi.sendNotificationList(atom)
      .then(res => res.json())
      .then(atom => {
        dispatch(receiveAtomSendNotificationList(atom));
      })
      .catch(error => dispatch(errorSendingNotificationList(error)));
  };
}
