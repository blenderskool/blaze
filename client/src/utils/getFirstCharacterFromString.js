/**
 * Returns the first character from a string preserving emoji characters
 * @param {String} str Text from which the first character will be extracted
 * @returns {String} First character from the string provided
 */

export default function getFirstCharacterFromString(str) {
  return String.fromCodePoint(str.codePointAt(0));
}
