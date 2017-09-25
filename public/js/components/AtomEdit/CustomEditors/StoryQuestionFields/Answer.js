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
      answerType: answer.answerType || "ATOM"
    });

    this.props.onUpdateField(answerWithType);
  }

  getPlaceholder = (answerType) => answerType === "CONTENT"
    ? "e.g. world/2017/sep/21/an-explainer-article"
    : "e.g. atom/guide/d12c3782-2d4b-4335-9701-830ac29c7d3b";

  render () {
    const answerType = _get(this.props, "fieldValue.answerType", "ATOM");
    const placeholder = this.getPlaceholder(answerType);

    return (
      <div className="form__field form__field--nested">
        <ManagedForm data={this.props.fieldValue} updateData={this.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="answerType" name="Answer type" isRequired={true}>
            <SearchSelectBox selectValues={["ATOM", "CONTENT"]} isRequired={true}/>
          </ManagedField>
          <ManagedField fieldLocation="answerId" name="Answer ID" isRequired={true}>
            <FormFieldTextInput fieldPlaceholder={placeholder}/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
