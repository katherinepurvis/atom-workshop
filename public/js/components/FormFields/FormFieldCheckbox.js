import React from 'react';

export default class FormFieldCheckbox extends React.Component {

  static propTypes = {
    fieldLabel: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldValues: React.PropTypes.array.isRequired,
    onUpdateField: React.PropTypes.func.isRequired
  };

  renderCheckbox(value, i) {
    return (
      <div key={i} className="form__group form__group--checkbox">
        <input className="form__checkbox" type="checkbox" checked={value.selected} name={this.props.fieldName} value={value} onChange={this.props.onUpdateField} />
        <span className="form__label form__label--checkbox">{value.id}</span>
      </div>
    );
  }

  renderCheckboxes() {
    return this.props.fieldValues.map(this.renderCheckbox, this);
  }

  render() {
    return (
        <div>
          <label className="form__label" htmlFor={this.props.fieldName}>{this.props.fieldLabel}</label>
          {this.renderCheckboxes()}
        </div>
    );
  }
}
