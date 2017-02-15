import React, {PropTypes} from 'react';

export const ManagedForm = (props) => {
  const hydratedChildren = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      data: props.data,
      updateData: props.updateData
    });
  });
  return <div>{hydratedChildren}</div>;
};

ManagedForm.propTypes = {
  updateData: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired
};
