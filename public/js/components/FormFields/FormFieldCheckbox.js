import React from 'react';

export default class FormFieldCheckbox extends React.Component {

  static propTypes = {
    fieldLabel: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldValue: React.PropTypes.array.isRequired,
    onUpdateField: React.PropTypes.func.isRequired
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }

  renderCheckbox(value, i) {
    return (
      <div key={i} className="form__group form__group--checkbox">
        <input className="form__checkbox" type="checkbox" checked={value.selected} name={this.props.fieldName} value={value} onChange={this.onUpdate} />
        <span className="form__label form__label--checkbox">{value.id}</span>
      </div>
    );
  }

  renderCheckboxes() {
    return this.props.fieldValue.map(this.renderCheckbox, this);
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
