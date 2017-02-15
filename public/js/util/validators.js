import FieldError from '../constants/FieldError';
/**
 *
 * Validators should return true on a pass or an instance of FieldError('error', 'message') on failure
 *
 **/


export const isHttpsUrl = (value) => {
  const stringValue = typeof value === 'string' ? value : '';
  if (stringValue.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
    return true;
  } else {
    return new FieldError('not-https', 'Not a HTTPS url');
  }
};
