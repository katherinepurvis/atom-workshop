import React, {PropTypes} from 'react';
import { errorPropType } from '../../constants/errorPropType';

export default class FormFieldArrayWrapper extends React.Component {

  static propTypes = {
    fieldLabel: PropTypes.string,
    fieldName: PropTypes.string,
    fieldValue: PropTypes.array,
    fieldErrors: PropTypes.arrayOf(errorPropType),
    onUpdateField: PropTypes.func,
    nested: PropTypes.bool,
    numbered: PropTypes.bool,
    fieldClass: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  }

  onAddClick = () => {
    const existingValues = this.props.fieldValue || [];
    this.props.onUpdateField(existingValues.concat([undefined]));
  }

  renderValue(value, i) {

    const updateFn = (newValue) => {
      //Find the value in the array to change
      const newFieldValue = this.props.fieldValue.map((oldValue) => {
        return value === oldValue ? newValue : oldValue;
      });
      this.props.onUpdateField(newFieldValue);
    };

    const removeFn = (removeIndex) => {
      const newFieldValue = this.props.fieldValue.filter((value, currentIndex) => {
        return currentIndex !== removeIndex;
      });

      this.props.onUpdateField(newFieldValue);
    };

    const hydratedChildren = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        key: `${this.props.fieldName}-${i}`,
        fieldName: `${this.props.fieldName}-${i}`,
        fieldValue: value,
        fieldErrors: this.props.fieldErrors,
        formRowClass: 'form__row form__row--flex',
        onUpdateField: updateFn
      });
    });

    return (
      <div className={this.props.fieldClass ? this.props.fieldClass : 'form__group form__field'}>
        {this.props.numbered ? <span className="form__field-number">{`${i + 1}. `}</span> : false }
        {hydratedChildren}
        <button className="btn form__field-btn btn--red" type="button" onClick={removeFn.bind(this, i)}>Delete</button>
      </div>
    );
  }

  render () {

    const values = this.props.fieldValue || [];

    return (
      <div className={this.props.nested ? 'form__row form__row--nested' : 'form__row'}>
        <div className="form__btn-heading">
          <span className="form__label">{this.props.fieldLabel}</span>
       </div>
          {values.map((value, i) => this.renderValue(value, i))}
        <button className="form__btn-heading__btn form__btn-heading__add" type="button" onClick={this.onAddClick}>Add</button>
      </div>
    );
  }
}
