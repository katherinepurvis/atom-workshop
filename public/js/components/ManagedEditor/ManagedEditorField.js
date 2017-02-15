import React, {PropTypes} from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';

export const ManagedField = (props) => {
  const updateFn = (e) => {
    const newAtom = Object.assign({}, props.atom);
    _set(newAtom, props.fieldLocation, e.target.value);
    props.updateAtom(newAtom);
  };

  const hydratedChildren = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      fieldName: props.name,
      fieldLabel: props.name,
      fieldValue: _get(props.atom, props.fieldLocation),
      onUpdateField: updateFn
    });
  });
  return <div>{hydratedChildren}</div>;
};

ManagedField.propTypes = {
  fieldLocation: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default ManagedField;
