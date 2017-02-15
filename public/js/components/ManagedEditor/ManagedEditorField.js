import React, {PropTypes} from 'react';
import _get from 'lodash/fp/get';
import _set from 'lodash/fp/set';

export class ManagedField extends React.Component {

  static propTypes = {
    fieldLocation: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    updateData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    name: PropTypes.string
  };

  updateFn = (newValue) => {
    this.props.updateData(_set(this.props.fieldLocation, newValue, this.props.data));
  }

  render () {
    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        fieldName: this.props.name,
        fieldLabel: this.props.name,
        fieldValue: _get(this.props.fieldLocation, this.props.data),
        onUpdateField: this.updateFn
      });
    });
    return <div>{hydratedChildren}</div>;

  }
}
