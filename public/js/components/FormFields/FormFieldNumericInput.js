import React from 'react';

export default class FormFieldNumericInput extends React.Component {

  static propTypes = {
    fieldLabel: React.PropTypes.string,
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.number,
    fieldPlaceholder: React.PropTypes.string,
    onUpdateField: React.PropTypes.func
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
          <input type="number" className="form__field" id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} value={this.props.fieldValue || ''} onChange={this.onUpdate}/>
        </div>

    );
  }
}
