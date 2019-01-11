import React, { PropTypes } from 'react';
import {atomPropType} from '../../../constants/atomPropType';
import {ManagedField, ManagedForm} from "../../ManagedEditor";
import FormFieldTextInput from "../../FormFields/FormFieldTextInput";
import FormFieldNumericInput from "../../FormFields/FormFieldNumericInput";
import {isHttpsUrl} from "../../../util/validators";

export class AudioEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
  };

  render () {
    return (
      <div>
        <ManagedForm formName="audioEditor" data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} >
          <ManagedField fieldLocation="title" name="Title" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="trackUrl" name="Track url" isRequired={true} customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="contentId" name="Content ID" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="duration" name="Duration (seconds)" isRequired={true}>
            <FormFieldNumericInput/>
          </ManagedField>
          <ManagedField fieldLocation="coverUrl" name="Image url" isRequired={true} customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>

          <ManagedField fieldLocation="crossPlatformLinks.apple" name="Subscription: Apple Podcasts" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="crossPlatformLinks.google" name="Subscription: Google Podcasts" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="crossPlatformLinks.spotify" name="Subscription: Spotify" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput/>
          </ManagedField>

        </ManagedForm>
      </div>
    );
  }
}