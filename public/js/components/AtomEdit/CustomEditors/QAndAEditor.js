import React, { PropTypes } from 'react';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import FormFieldTagPicker from '../../FormFields/FormFieldTagPicker';
import {QAItem} from './QAndAFields/QAItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';


export class QAndAEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func,
    config: PropTypes.shape({
      gridUrl: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="qaEditor">
          <ManagedField fieldLocation="data.qanda.item" name="Item">
            <QAItem onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
          </ManagedField>
          <ManagedField fieldLocation="data.qanda.eventImage" name="Image">
            <FormFieldImageSelect gridUrl={this.props.config.gridUrl}/>
          </ManagedField>
          <ManagedField fieldLocation="commissioningDesks" name="Commissioning desks">
            <FormFieldArrayWrapper>
              <FormFieldTagPicker tagType="tracking" />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
