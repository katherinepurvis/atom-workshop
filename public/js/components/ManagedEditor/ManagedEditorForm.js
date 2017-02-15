import React, {PropTypes} from 'react';

export const ManagedForm = (props) => {
  const hydratedChildren = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      atom: props.atom,
      updateAtom: props.updateAtom
    });
  });
  return <div>{hydratedChildren}</div>;
};

ManagedForm.propTypes = {
  updateAtom: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
};
