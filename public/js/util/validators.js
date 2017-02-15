export const isHttpsUrl = (value) => {
  const stringValue = typeof value === 'string' ? value : '';

  if (stringValue.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
    return true;
  } else {
    return "Not a HTTPS url";
  }
};
