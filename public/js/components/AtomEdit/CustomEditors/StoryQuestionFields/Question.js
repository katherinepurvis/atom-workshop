import React, { PropTypes } from 'react';
import {ManagedForm, ManagedField} from '../../../ManagedEditor';
import FormFieldTextInput from '../../../FormFields/FormFieldTextInput';
import SearchSuggestions from '../../../FormFields/SearchFields/SearchSuggestions';
import uuidv4 from 'uuid/v4';
import { fetchCapiAtom } from '../../../../services/capi';
import { snippets } from '../../../../constants/snippets';
import _get from 'lodash/fp/get';

const filters = {
  types: snippets.join(',')
};

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

  state = {
    answers: _get(this.props, 'fieldValue.answers', [])
  }

  componentDidMount() {
    this.state.answers.forEach((answer, i) => {
    // eslint-disable-next-line
    const [_, atomType, atomId] = answer.answerId.split('/');
      fetchCapiAtom(atomType, atomId)
        .then(atom => {
          this.setState(prevState => {
            const answers = prevState.answers.slice();
            answers[i].title = atom.title;
          });
        });
    });
  }

  updateQuestion = (questionObject) => {
    const questionWithId = Object.assign({}, questionObject, {
      questionId: questionObject.questionId || uuidv4(),
      answers: this.state.answers
    });

    this.props.onUpdateField(questionWithId);
  }

  onSelect = (snippet) => {
    this.setState(
      (oldState) => Object.assign({}, oldState, { answers: oldState.answers.concat({
        title: snippet.title,
        answerId: `atom/${snippet.atomType}/${snippet.id}`, 
        answerType: 'ATOM' 
      })}),
      () => {
        this.props.onUpdateField({
          questionId: this.props.fieldValue.questionId,
          questionText: this.props.fieldValue.questionText,
          answers: this.state.answers
        });
      }
    );
  }
  
  onDelete = (i) => {
    this.setState(
      (oldState) => Object.assign({}, oldState, {
        answers: oldState.answers.slice(0, i).concat(oldState.answers.slice(i + 1))
      }),
      () => {
        this.props.onUpdateField({
          questionId: this.props.fieldValue.questionId,
          questionText: this.props.fieldValue.questionText,
          answers: this.state.answers
        });
      }
    );
  }

  render () {
    return (
      <div className="form__field form__field--nested">
        <ManagedForm data={this.props.fieldValue} updateData={this.updateQuestion} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="storyquestionsEditor">
          <ManagedField fieldLocation="questionText" name="Question" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
        </ManagedForm>
        <div className="atom__answers__header">
          <h5>Answers</h5>
          <SearchSuggestions fieldPlaceholder="Search for snippets" filters={filters} onSelect={this.onSelect} />
        </div>
        <ul className="atom__answers">
          {this.state.answers.map((answer, i) => 
            <li className="atom__answer">
              <div>
                <div>{answer.title}</div>
                <small>{answer.answerId}</small>
              </div>
              <button type="button" className="btn btn--red" onClick={() => this.onDelete(i)}>Delete</button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
