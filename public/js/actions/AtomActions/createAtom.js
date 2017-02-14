import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomCreate(atomType) {
  return {
    type:       'ATOM_CREATE_REQUEST',
    atomType:   atomType,
    receivedAt: Date.now()
  };
}

function receiveAtomCreate(atom) {
  return {
    type:       'ATOM_CREATE_RECEIVE',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function errorCreatingAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not create atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function createAtom(atomType) {
  return dispatch => {
    dispatch(requestAtomCreate(atomType));
    return AtomsApi.createAtom(atomType)
        .then(atom => {
          dispatch(receiveAtomCreate(atom));
        })
        .catch(error => dispatch(errorCreatingAtom(error)));
  };
}
