import React, { PropTypes } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';


import FormFieldTextInput from '../../FormFields/FormFieldTextInput';

const isValidHttpsUrl = (value) => {
  const stringValue = typeof value === 'string' ? value : '';

  if (stringValue.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
    return true;
  } else {
    return "Not a HTTPS url";
  }
};


export class CTAEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  render () {

    const ManagedAtomEditorForm = (props) => {
      const hydratedChildren = React.Children.map(props.children, (child) => {
        return React.cloneElement(child, {
          atom: props.atom,
          updateAtom: props.updateAtom
        });
      });
      return <div>{hydratedChildren}</div>;
    };

    const ManagedField = (props) => {

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

    return (
      <div className="editor editor-cta">
        <ManagedAtomEditorForm atom={this.props.atom} updateAtom={this.props.onUpdate}>
          <ManagedField fieldLocation="data.url" name="Link Url" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.btnText" name="Button Text">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.backgroundImage" name="Background Image Url" customValidation={isValidHttpsUrl}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.label" name="Background Text">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.trackingcode" name="Tracking Code">
            <FormFieldTextInput />
          </ManagedField>
        </ManagedAtomEditorForm>
      </div>
    );
  }
}
