/**
 * Serialize form fields into key / value pairs.
 * @link https://gomakethings.com/how-to-serialize-form-data-with-vanilla-js
 * @param {FormData} formData
 * @returns {Object}
 */
function serializeFormData(formData) {
  let obj = {};
  for (const [key, value] of formData) {
    // const resetKeys = ["formulaire_action_args", "formulaire_action_sign"];

    // If the key contains brackets, it's an array.
    if (key.indexOf("[]") !== -1) {
      const k = key.replace(/[\[\]]+/g, "");
      if (!obj.hasOwnProperty(k)) {
        obj[k] = [];
      }
      if (value !== "") {
        obj[k].push(value);
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

export { serializeFormData };
