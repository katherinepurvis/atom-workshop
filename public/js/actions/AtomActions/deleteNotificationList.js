import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomDeleteNotificationList(atom) {
  return {
    type:       'ATOM_DELETE_NOTIFICATION_REQUEST',
    atom,
    receivedAt: Date.now()
  };
}

function receiveAtomDeleteNotificationList(atom) {
  return {
    type:       'ATOM_DELETE_NOTIFICATION_RECEIVE',
    atom,
    receivedAt: Date.now()
  };
}

function errorCreatingNotificationList(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not delete notification list',
    error,
    receivedAt: Date.now()
  };
}

export function deleteNotificationList(atom) {
  return dispatch => {
    dispatch(requestAtomDeleteNotificationList(atom));
    return AtomsApi.deleteNotificationList(atom)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomDeleteNotificationList(atom));
        })
        .catch(error => dispatch(errorCreatingNotificationList(error)));
  };
}
