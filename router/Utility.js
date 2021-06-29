function hasNumber(myString) {
  return /\d/.test(myString);
}

function hasValue(someVariable) {
  if (typeof someVariable !== 'undefined') {
    if (someVariable.trim().length > 0) return true;
  }
  return false;
}
module.exports = {
  hasNumber,
  hasValue,
};
