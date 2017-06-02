import React, { PropTypes } from 'react';
import FormFieldTagPicker from '../../FormFields/FormFieldTagPicker';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import {StoryQuestionsQuestionSet} from './StoryQuestionFields/QuestionSet';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';


export class StoryQuestionsEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="data.storyquestions.title" name="Public Title" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.storyquestions.relatedStoryId" name="Related Tag" isRequired={true}>
            <FormFieldTagPicker/>
          </ManagedField>
          <ManagedField fieldLocation="data.storyquestions.editorialQuestions[0]" name="Editorial Questions">
            <StoryQuestionsQuestionSet onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
          </ManagedField>
          <ManagedField fieldLocation="labels[0]" name="Email List ID">
            <FormFieldTextInput/>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
