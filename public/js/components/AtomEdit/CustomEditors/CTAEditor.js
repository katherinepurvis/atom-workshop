import React, { PropTypes } from 'react';

import {ManagedForm, ManagedField} from '../../ManagedEditor';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import {isHttpsUrl} from '../../../util/validators';

export class CTAEditor extends React.Component {

  static propTypes = {
    atom: PropTypes.shape({
      type: PropTypes.string
    }).isRequired,
    onUpdate: PropTypes.func.isRequired
  }

  render () {

    return (
      <div className="editor editor-cta">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate}>
          <ManagedField fieldLocation="data.url" name="Link Url" fieldId="url" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.btnText" name="Button Text" fieldId="btntext">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.backgroundImage" name="Background Image Url" fieldId="backgroundImage" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.label" name="Background Text" fieldId="label">
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.trackingcode" name="Tracking Code" fieldId="trackingcode">
            <FormFieldTextInput />
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
