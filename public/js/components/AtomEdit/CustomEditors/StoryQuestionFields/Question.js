import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../../FormFields/FormFieldArrayWrapper';
import {StoryQuestionsAnswer} from './Answer';
import uuidv4 from 'uuid/v4';

export class StoryQuestionsQuestion extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      questionId: PropTypes.string,
      questionText: PropTypes.string,
      answers: PropTypes.array
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateQuestion = (questionObject) => {
    const questionWithId = Object.assign({}, questionObject, {
      questionId: questionObject.questionId || uuidv4()
    });

    this.props.onUpdateField(questionWithId);
  }

  render () {
    const answersCount = (this.props.fieldValue && this.props.fieldValue.answers) ? this.props.fieldValue.answers.length : 0;

    return (
      <div className="form__field form__field--nested">
        <ManagedForm data={this.props.fieldValue} updateData={this.updateQuestion} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="questionText" name="Question" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="answers" name={`Answers (${answersCount})`} >
            <FormFieldArrayWrapper>
              <StoryQuestionsAnswer/>
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
