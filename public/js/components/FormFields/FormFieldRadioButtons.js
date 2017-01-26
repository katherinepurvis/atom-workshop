import React from 'react';

export default class FormFieldRadioButtons extends React.Component {

  static propTypes = {
    fieldLabel: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldValues: React.PropTypes.array.isRequired,
    checkedValue: React.PropTypes.string
  };

  renderButton(value, i) {
    return (
      <div key={i} className="form__group form__group--radio">
        <input className="form__radio-btn" type="radio" name={this.props.fieldName} value={value} checked={this.props.checkedValue === value ? 'checked' : false} onChange={this.props.onUpdateField} />
        <span className="form__label form__label--radio">{value}</span>
      </div>
    )
  }

  renderButtons() {
    return this.props.fieldValues.map(this.renderButton, this);
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.renderButtons()}
        </div>
    )
  }
}



