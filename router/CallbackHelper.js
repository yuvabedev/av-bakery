var util = require('util');
var path = require('path');

var httpResponse = null;
var nextRedirect = null;
var nextView = null;

var filename = path.basename(__filename);


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

function renderNextViewOrPageNotFoundOnError(error, data) {
  if (error || data.length < 1) {
    console.log("redirecting user to 404 as no data found or error occured while fetching data")
    nextView = "404";
  } 
  console.log(util.format('Rendering View: %s', nextView));
  httpResponse.render(nextView, { data: data, error: error });
}

function redirectRequest(error, data) {
  console.log(util.format('Redirecting to URL: %s', nextRedirect));
  httpResponse.redirect(nextRedirect);
}

function logSavedObject(error, data) {
  if (error) {
    console.log(error);
  } else {
  }
}

function setResponse (response) {
  httpResponse = response;
}

function setRedirect(redirect) {
  nextRedirect = redirect;
}

function setView(view) {
  console.log(util.format("%s: Setting next view to %s", filename, view));
  nextView = view;
}

module.exports = {
  hasNumber,
  hasValue,
  convertToEmptyIfUndefined,
  sendResponse,
  renderNextView,
  renderNextViewOrPageNotFoundOnError,
  redirectRequest,
  setResponse,
  setRedirect,
  setView,
  logSavedObject,
};
