import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomCreateNotificationList(atom) {
  return {
    type:       'ATOM_CREATE_NOTIFICATION_REQUEST',
    atom,
    receivedAt: Date.now()
  };
}

function receiveAtomCreateNotificationList(atom) {
  return {
    type:       'ATOM_CREATE_NOTIFICATION_RECEIVE',
    atom,
    receivedAt: Date.now()
  };
}

function errorCreatingNotificationList(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not create notification list',
    error,
    receivedAt: Date.now()
  };
}

export function createNotificationList(atom) {
  return dispatch => {
    dispatch(requestAtomCreateNotificationList(atom));
    return AtomsApi.createNotificationList(atom)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomCreateNotificationList(atom));
        })
        .catch(error => dispatch(errorCreatingNotificationList(error)));
  };
}
