import FieldError from '../constants/FieldError';
import {logError} from './logger';

const validateField = (fieldValue, isRequired: false, customValidation) => {
  const errors = [];
  // isRequired check
  if(isRequired && !fieldValue) {
    const error = new FieldError('required', 'This field is required');
    errors.push(error);
  }

  // Custom validators
  if(customValidation) {
    customValidation.forEach((validator) => {
      const result = validator(fieldValue);

      if (result !== true) {

        if (!(result instanceof FieldError)) {
          logError('Unexpected error format', result);
          return;
        }
        errors.push(result);
      }
    })
  }

  return errors;
};

export default validateField;
