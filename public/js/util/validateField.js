const validateField = (fieldName, fieldValue, isRequired: false, customValidation) => {
  const errors = [];
  // isRequired check
  if(isRequired && !fieldValue) {
    errors.push({
      error: 'required',
      message: 'This field is required'
    });
  }

  // Custom validators
  if(customValidation) {
    customValidation.forEach((validator) => {
      const result = validator(fieldValue);

      if (result !== true) {
        errors.push(result);
      }
    })
  }

  return errors;
};

export default validateField;
