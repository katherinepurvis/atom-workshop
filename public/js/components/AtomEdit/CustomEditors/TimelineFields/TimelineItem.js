import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldsScribeEditor from '../../../FormFields/FormFieldScribeEditor';
import FormFieldDateTextInput from '../../../FormFields/FormFieldDateTextInput';
import FormFieldRadioButtons from '../../../FormFields/FormFieldRadioButtons';
import FormFieldCheckbox from "../../../FormFields/FormFieldCheckbox";

export class TimelineItem extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      toDate: PropTypes.number,
      body: PropTypes.string,
      dateFormat: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

    state = {
        dateRangeRequired: typeof this.props.fieldValue === PropTypes.shape({
            title: PropTypes.string,
            date: PropTypes.number,
            toDate: PropTypes.number,
            body: PropTypes.string,
            dateFormat: PropTypes.string
        }),
    };


  dateFormats = [
      {
          value: 'day-month-year',
          name: 'Calendar date e.g. Monday 13th July 2017'
      },
      {
          value: 'month-year',
          name: 'Month & year e.g. July 2017'
      },
      {
          value: 'year',
          name: 'Year e.g. 2017'
      }
  ]


  updateItem = (item) => {
      this.props.onUpdateField(item);
  }

  getDateFormat = () => {
      const existingData = this.props.fieldValue || {};
      return this.dateFormats.find(dateFormat => dateFormat.value === existingData.dateFormat);
  }

  updateDateRange = (dateRangeRequired) => {
      this.setState({
          dateRangeRequired: dateRangeRequired
      });
    };


  render () {
    const value = this.props.fieldValue || {
      title: " ",
      date: Date.now(),
      body: " ",
      dateFormat: " "
    };

    return (
      <div className="form__field form__field--nested">
        <ManagedForm data={value} updateData={this.updateItem} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="timelineEditor">
          <ManagedField fieldLocation="date" name="Date" isRequired={true}>
            <FormFieldDateTextInput/>
          </ManagedField>
          <FormFieldCheckbox fieldName="ranged-date" fieldLabel="Want a date range?" fieldValue={this.state.dateRangeRequired} onUpdateField={this.updateDateRange.bind(this)}/>
          <ManagedField isRequired={false} fieldLocation="toDate">
            <FormFieldDateTextInput fieldName="ranged-date" disabled={!this.state.dateRangeRequired}/>
          </ManagedField>
          <ManagedField fieldLocation="dateFormat" name="Date Format" isRequired={false}>
            <FormFieldRadioButtons
                fieldLabel="Date Format"
                selectValues={this.dateFormats.map(dateFormat => dateFormat.value)}
                selectLabels={this.dateFormats.map(dateFormat => dateFormat.name)}
                fieldValue={this.getDateFormat() ? this.getDateFormat().value : 'day-month-year'}
                fieldCaption="will default to calendar date if left blank"/>
          </ManagedField>
          <ManagedField fieldLocation="title" name="Title" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="body" name="Body">
            <FormFieldsScribeEditor showWordCount={true} suggestedLength={150} showToolbar={false} tooLongMsg={"Remember that snippets should be concise"}/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
