/**
 *
 * Validators should return true on a pass or the following format on failure:
 *
 * {
 *    error: 'ERROR_NAME',
 *    message: 'ERROR_MESSAGE'
 * }
 *
 **/


export const isHttpsUrl = (value) => {
  const stringValue = typeof value === 'string' ? value : '';
  if (stringValue.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
    return true;
  } else {
    return {
      error: 'not-https',
      message: 'Not a HTTPS url'
    };
  }
};
