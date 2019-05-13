import flatten from 'lodash/flatten';

const flattenFormErrors = formErrors => {
  const nested = Object.entries(formErrors).map(([field, values]) =>
    Object.entries(values).map(([title, errors]) =>
      errors.map(error => Object.assign({}, error, { field, title }))
    )
  );
  return flatten(flatten(nested));
};

export default flattenFormErrors;
