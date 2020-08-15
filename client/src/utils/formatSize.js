/**
 * Returns an easy to read formatted size
 * @param {Number} size Size of the file in bytes
 * @param {Number} precision Number of digits after decimal
 * @returns {String} Formatted size
 */
function formatSize(size, precision = 1) {
  const kbs = size / 1024;
  const mbs = kbs / 1024;

  return mbs < 1 ? `${kbs.toFixed(precision)}KB` : `${mbs.toFixed(precision)}MB`;
}

export default formatSize;