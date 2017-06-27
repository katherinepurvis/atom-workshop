import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldDateInput from '../../../FormFields/FormFieldDateInput';
import FormFieldTextArea from '../../../FormFields/FormFieldTextArea';

export class TimelineItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.date,
      body: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateItem = (item) => {
    this.props.onUpdateField(item);
  }

  render () {
    const value = this.props.fieldValue || {
      title: "",
      date: Date.now(),
      body: ""
    };
    return (
      <div className="form__field">
        <ManagedForm data={value} updateData={this.updateItem} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="timelineEditor">
        <ManagedField fieldLocation="date" name="Date" isRequired={true}>
          <FormFieldDateInput isOutsideRange={() => false}/>
        </ManagedField>
          <ManagedField fieldLocation="title" name="Title" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="body" name="Body">
            <FormFieldTextArea/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
