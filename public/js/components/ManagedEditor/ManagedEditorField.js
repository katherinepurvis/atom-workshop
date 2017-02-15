import React, {PropTypes} from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';
import validateField from '../../util/validateField';

export const ManagedField = (props) => {
  const updateFn = (e) => {
    const newData = Object.assign({}, props.data);
    _set(newData, props.fieldLocation, e.target.value);
    props.updateData(newData);
    validateField(props.fieldId, _get(props.data, props.fieldLocation), props.isRequired, props.customValidation);
  };

  const hydratedChildren = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      fieldName: props.fieldId,
      fieldLabel: props.name,
      fieldValue: _get(props.data, props.fieldLocation),
      onUpdateField: updateFn
    });
  });

  console.log(hydratedChildren);
  return <div>{hydratedChildren}</div>;
};

ManagedField.propTypes = {
  fieldLocation: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  updateData: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  customValidation: PropTypes.array
};

export default ManagedField;
