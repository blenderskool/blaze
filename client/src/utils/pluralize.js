/**
 * Utilitiy function to pluralize based on number of items
 * @param {Number} numItems Number of items >= 1
 * @param {String} singularStr String to return when number of items is one
 * @param {String} pluralStr String to return when number of items is more than 1
 * @returns {String} A pluralized string based on the number of items
 */
export default function pluralize(numItems, singularStr, pluralStr) {
  return numItems > 1 ? pluralStr : singularStr;
}