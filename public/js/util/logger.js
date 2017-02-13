/* eslint no-console: "off" */

//TODO implement sentry

export function logInfo(...message) {
  console.log.apply(this, message);
}

export function logError(...message) {
  console.error.apply(this, message);
}
