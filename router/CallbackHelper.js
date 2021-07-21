var util = require('util');

var httpResponse = null;
var nextRedirect = null;
var nextView = null;


function hasNumber(myString) {
  return /\d/.test(myString);
}

function convertToEmptyIfUndefined(object) {
  if (!hasValue(object)) return '';
  return object;
}
function hasValue(someVariable) {
  if (typeof someVariable !== 'undefined') {
    if (someVariable.trim().length > 0) return true;
  }
  return false;
}

function sendResponse(error, data) {
  if (error) {
    console.log(error);
    httpResponse.status(501).send(error);
  } else {
    httpResponse.status(201).send(data);
  }
}

function renderNextView(error, data) {
  console.log(util.format('Rendering View: %s', nextView));
  httpResponse.render(nextView, { data: data, error: error });
}

function redirectRequest(error, data) {
  console.log(util.format('Redirecting to URL: %s', nextRedirect));
  httpResponse.redirect(nextRedirect);
}

function setResponse (response) {
  httpResponse = response;
}

function setRedirect(redirect) {
  nextRedirect = redirect;
}

function setView(view) {
  nextView = view;
}

module.exports = {
  hasNumber,
  hasValue,
  convertToEmptyIfUndefined,
  sendResponse,
  renderNextView,
  redirectRequest,
  setResponse,
  setRedirect,
  setView,
};
