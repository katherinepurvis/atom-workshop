import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldArrayWrapper from '../../../FormFields/FormFieldArrayWrapper';
import {StoryQuestionsQuestion} from './Question.js';
import uuidv4 from 'uuid/v4';


export class StoryQuestionsQuestionSet extends React.Component {
  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.shape({
      questionSetId: PropTypes.string,
      questionSetTitle: PropTypes.string,
      questions: PropTypes.array
    }),
    fieldPlaceholder: PropTypes.string,
    onUpdateField: PropTypes.func,
    onFormErrorsUpdate: PropTypes.func
  };

  updateQuestionSet = (questionSet) => {
    const questionSetId = questionSet.questionSetId || uuidv4();
    const questionSetWithIdAndTitle = Object.assign({}, questionSet, {
      questionSetId: questionSetId, 
      questionSetTitle: questionSetId
    });

    this.props.onUpdateField(questionSetWithIdAndTitle);
  }

  render () {
    const value = this.props.fieldValue || {
      questionSetId: "",
      questionSetTitle: "",
      questions: []
    };
    return (
      <div className="form__field">
        <ManagedForm data={value} updateData={this.updateQuestionSet} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="questions" name="Questions" isRequired={true}>
            <FormFieldArrayWrapper>
              <StoryQuestionsQuestion />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
