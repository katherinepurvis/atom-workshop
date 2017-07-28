import React, { PropTypes } from 'react';
import FormFieldTagPicker from '../../FormFields/FormFieldTagPicker';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldCheckbox from '../../FormFields/FormFieldCheckbox';
import {StoryQuestionsQuestionSet} from './StoryQuestionFields/QuestionSet';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';


export class StoryQuestionsEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  };

  state = {
    isClosed: this.props.atom.data.storyquestions.closeDate !== undefined && Date.now() >= this.props.atom.data.storyquestions.closeDate
  };

  //The model has a DateTime field, but for now the UI exposes this as a checkbox - closed or not
  updateClose = (isClosed) => {
    this.setState({isClosed: isClosed});

    if (isClosed) {
      const closed = Object.assign({}, this.props.atom, {
        data: Object.assign({}, this.props.atom.data, {
          storyquestions: Object.assign({}, this.props.atom.data.storyquestions, {
            closeDate: Date.now()
          })
        })
      });
      this.props.onUpdate(closed);
    } else {
      const notClosed = Object.assign({}, this.props.atom, {
        data: Object.assign({}, this.props.atom.data, {
          storyquestions: Object.assign({}, this.props.atom.data.storyquestions, {
            closeDate: undefined
          })
        })
      });
      this.props.onUpdate(notClosed);
    }
  };

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <FormFieldCheckbox fieldName="Closed" fieldValue={this.state.isClosed} onUpdateField={this.updateClose.bind(this)} />
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
