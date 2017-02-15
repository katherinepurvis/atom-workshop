import React, {PropTypes} from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';

export const ManagedField = (props) => {
  const updateFn = (e) => {
    const newData = Object.assign({}, props.data);
    _set(newData, props.fieldLocation, e.target.value);
    props.updateData(newData);
  };

  const hydratedChildren = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      fieldName: props.name,
      fieldLabel: props.name,
      fieldValue: _get(props.data, props.fieldLocation),
      onUpdateField: updateFn
    });
  });
  return <div>{hydratedChildren}</div>;
};

ManagedField.propTypes = {
  fieldLocation: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  updateData: PropTypes.func.isRequired
};

export default ManagedField;
