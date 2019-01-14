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
          <ManagedField fieldLocation="data.audio.kicker" name="Kicker (title)" isRequired={true}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.trackUrl" name="Track url" isRequired={true} customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>
          <ManagedField fieldLocation="data.audio.contentId" name="Content ID" isRequired={true}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.audio.duration" name="Duration (seconds)" isRequired={true}>
            <FormFieldNumericInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.audio.coverUrl" name="Image url" isRequired={true} customValidation={[isHttpsUrl]}>
            <FormFieldTextInput />
          </ManagedField>

          <ManagedField fieldLocation="data.audio.subscriptionLinks.apple" name="Subscription: Apple Podcasts" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.audio.subscriptionLinks.google" name="Subscription: Google Podcasts" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.audio.subscriptionLinks.spotify" name="Subscription: Spotify" customValidation={[isHttpsUrl]}>
            <FormFieldTextInput/>
          </ManagedField>

        </ManagedForm>
      </div>
    );
  }
}