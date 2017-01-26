import React from 'react';

export default class FormFieldSelectBox extends React.Component {

  renderOption(option) {
    return (
        <option key={option} value={option}>{option}</option>
    )
  }

  renderOptions() {
    return this.props.fieldValues.map(this.renderOption);
  }

  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <select className="form__field form__field--select" id={this.props.fieldName}>
            {this.renderOptions()}
          </select>
        </div>
    );
  };
}

FormFieldSelectBox.propTypes = {
  fieldLabel: React.PropTypes.string.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  fieldValues: React.PropTypes.array.isRequired
};