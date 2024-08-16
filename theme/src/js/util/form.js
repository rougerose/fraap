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

/**
 * Récupérer un tableau d'identifiant depuis une liste de checkbox
 * @param {NodeList} inputs
 * @returns {Array}
 */
function getInputsChecked(inputs) {
  let idArray = [];
  if (inputs.length > 0) {
    for (var item of inputs) {
      if (item.checked) {
        idArray.push(item.value);
      }
    }
  }
  return idArray;
}

export { serializeFormData, getInputsChecked };
