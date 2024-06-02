function toCamel(arr) {
  return arr.reduce((a, b) => a + toUppper(b));
}

function toUpper(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { toCamel, toUpper };
