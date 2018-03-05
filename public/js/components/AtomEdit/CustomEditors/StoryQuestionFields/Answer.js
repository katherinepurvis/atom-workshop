import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import SearchSelectBox from '../../../FormFields/SearchFields/SearchSelectBox';
import _get from 'lodash/fp/get';

export class StoryQuestionsAnswer extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      answerId: PropTypes.string,
      answerType: PropTypes.string
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  onUpdate = (answer) => {
    const answerWithType = Object.assign({}, answer, {
      answerType: "ATOM"
    });

    this.props.onUpdateField(answerWithType);
  }

  render () {
    const placeholder = "e.g. atom/guide/d12c3782-2d4b-4335-9701-830ac29c7d3b";

    return (
      <div className="form__field form__field--nested">
        <ManagedForm data={this.props.fieldValue} updateData={this.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="answerId" name="Answer ID" isRequired={true}>
            <FormFieldTextInput fieldPlaceholder={placeholder}/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
