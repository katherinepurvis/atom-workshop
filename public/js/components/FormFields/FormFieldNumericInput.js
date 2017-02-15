import React from 'react';

export default class FormFieldNumericInput extends React.Component {

  static propTypes = {
    fieldLabel: React.PropTypes.string.isRequired,
    fieldName: React.PropTypes.string.isRequired,
    fieldValue: React.PropTypes.string.isRequired,
    fieldPlaceholder: React.PropTypes.string,
    onUpdateField: React.PropTypes.func.isRequired
  };

  onUpdate = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);

    if (parsedValue) {
      this.props.onUpdateField(parsedValue);
    } else if (value === "") {
      this.props.onUpdateField(undefined);
    }
  }

  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <input type="number" className="form__field" id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} value={this.props.fieldValue || 0} onChange={this.onUpdate}/>
        </div>

    );
  }
}
