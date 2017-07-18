import React from 'react';
import NotificationList from './NotificationList';

function AtomActions(prps) {
  if (!prps.atom) {
    return false;
  }

  if (prps.atom.atomType === 'STORYQUESTIONS') {
    return <NotificationList atom={prps.atom}/>;
  }

  return false;
}

export default AtomActions;
