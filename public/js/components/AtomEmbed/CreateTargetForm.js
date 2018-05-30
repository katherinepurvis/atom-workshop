import React, {PropTypes} from 'react';
import {createTarget} from '../../services/TargetingApi';
import {addYears} from 'date-fns'

import {ManagedForm, ManagedField} from '../ManagedEditor';
import FormFieldTextInput from '../FormFields/FormFieldTextInput';
import FormFieldTagPicker from '../FormFields/FormFieldTagPicker';
import FormFieldArrayWrapper from '../FormFields/FormFieldArrayWrapper';


class CreateTargetForm extends React.Component {

  static propTypes = {
    atomPath: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    triggerTargetFetch: PropTypes.func.isRequired,
    toggleEditMode: PropTypes.func.isRequired
  }

  state = {
    pendingUpdate: false,
    creating: false,
    currentTarget: {},
    formHasError: true
  }


  componentWillMount() {

    if (!this.state.currentTarget.title) {
      this.setState({
        currentTarget: {
          title: this.props.title
        }
      });
    }

  }

  createTarget = () => {

    this.setState({
      creating: true
    });

    const target = Object.assign({}, this.state.currentTarget, {
      url: this.props.atomPath,
      activeUntil: addYears(Date.now(), 50).valueOf()
    });

    createTarget(target).then((response) => {
      if (response.status === 200) {
        this.props.triggerTargetFetch();
        this.props.toggleEditMode();
        this.setState({
          creating: false
        });
      }
    });
  }

  updateCurrentTarget = (newTarget) => {
    this.setState({
      pendingUpdate: true,
      currentTarget: newTarget
    });
  }

  updateFormErrorState = (errorState) => {
    this.setState({
      formHasError: errorState
    });
  }

  render() {
    return (
      <div className="targeting__form">
        <ManagedForm
          data={this.state.currentTarget}
          updateData={this.updateCurrentTarget}
          onFormErrorStateUpdate={this.updateFormErrorState}
          formName="targetingForm"
          >
          <ManagedField fieldLocation="title" name="Title" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="tagPaths" name="Target Tag" isRequired={true} >
            <FormFieldArrayWrapper>
              <FormFieldTagPicker/>
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
        <button
          className="btn btn--green"
          disabled={!this.state.pendingUpdate || this.state.formHasError || this.state.creating}
          onClick={this.createTarget}
          >
          {this.state.creating ? "Creating..." : "Create Suggestion"}
        </button>
      </div>
    );
  }
}

export default CreateTargetForm;
