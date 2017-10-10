import React, { PropTypes } from 'react';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import FormFieldTagPicker from '../../FormFields/FormFieldTagPicker';
import {TimelineItem} from './TimelineFields/TimelineItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';
import FormFieldsScribeEditor from '../../FormFields/FormFieldScribeEditor';


export class TimelineEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render () {

    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="timelineEditor">
          <ManagedField fieldLocation="data.timeline.description" name="Description - optional" isRequired={false}>
            <FormFieldsScribeEditor showWordCount={true} suggestedLength={50} showToolbar={false}/>
          </ManagedField>
          <ManagedField fieldLocation="data.timeline.events" name="Events">
            <FormFieldArrayWrapper>
              <TimelineItem onFormErrorsUpdate={this.props.onFormErrorsUpdate}/>
            </FormFieldArrayWrapper>
          </ManagedField>
          <ManagedField fieldLocation="commissioningDesks" name="Commissioning desks" updateData={this.onDesk}>
            <FormFieldArrayWrapper>
              <FormFieldTagPicker />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
