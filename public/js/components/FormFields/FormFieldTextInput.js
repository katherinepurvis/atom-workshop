import React from 'react';

export default class FormFieldTextInput extends React.Component {

  static propTypes = {
    fieldLabel: React.PropTypes.string,
    fieldName: React.PropTypes.string,
    fieldValue: React.PropTypes.string,
    fieldPlaceholder: React.PropTypes.string,
    onUpdateField: React.PropTypes.func,
    isValid: React.PropTypes.bool
  };

  onUpdate = (e) => {
    this.props.onUpdateField(e.target.value);
  }


  render() {
    return (
        <div>
          <label htmlFor={this.props.fieldName} className="form__label">{this.props.fieldLabel}</label>
          <input type="text" className="form__field" id={this.props.fieldName} placeholder={this.props.fieldPlaceholder || ''} value={this.props.fieldValue || ""} onChange={this.onUpdate}/>
        </div>

    );
  }
}
