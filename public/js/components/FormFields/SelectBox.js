import React from 'react';

export default class SelectBox extends React.Component {

  renderOption(option) {
    return (
        <option key={option} value={option}>{option}</option>
    )
  }

  renderOptions() {
    return this.props.selectValues.map(this.renderOption);
  }

  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <select id={this.props.fieldName}>
            {this.renderOptions()}
          </select>
        </div>
    );
  };
}