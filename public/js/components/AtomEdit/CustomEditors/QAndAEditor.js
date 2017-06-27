import React, { PropTypes } from 'react';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import {QAItem} from './QAndAFields/QAItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';


export class QAndAEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="qaEditor">
          <ManagedField fieldLocation="data.qanda.item" name="Item">
            <QAItem onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
          </ManagedField>
          <ManagedField fieldLocation="data.qanda.typeLabel" name="Label">
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.qanda.eventImage" name="Event Image">
            <FormFieldImageSelect/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
