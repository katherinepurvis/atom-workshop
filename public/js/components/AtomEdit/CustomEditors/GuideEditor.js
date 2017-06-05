import React, { PropTypes } from 'react';
import FormFieldImageSelect from '../../FormFields/FormFieldImageSelect';
import FormFieldTextInput from '../../FormFields/FormFieldTextInput';
import FormFieldArrayWrapper from '../../FormFields/FormFieldArrayWrapper';
import {GuideItem} from './GuideFields/GuideItem';
import {ManagedField, ManagedForm} from '../../ManagedEditor';
import {atomPropType} from '../../../constants/atomPropType';

export class GuideEditor extends React.Component {

  static propTypes = {
    atom: atomPropType.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onFormErrorsUpdate: PropTypes.func
  }

  render () {
    return (
      <div className="form">
        <ManagedForm data={this.props.atom} updateData={this.props.onUpdate} onFormErrorsUpdate={this.props.onFormErrorsUpdate} formName="guideEditor">
          <ManagedField fieldLocation="data.guide.typeLabel" name="Label">
            <FormFieldTextInput/>
          </ManagedField>
          <ManagedField fieldLocation="data.guide.guideImage" name="Guide Image">
            <FormFieldImageSelect/>
          </ManagedField>
          <ManagedField fieldLocation="data.guide.items" name="Items">
            <FormFieldArrayWrapper>
              <GuideItem onFormErrorsUpdate={this.props.onFormErrorsUpdate} />
            </FormFieldArrayWrapper>
          </ManagedField>
        </ManagedForm>
      </div>
    );
  }
}
