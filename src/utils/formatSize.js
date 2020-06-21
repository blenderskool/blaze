/**
 * Returns an easy to read formatted size
 * @param {Number} size Size of the file in bytes
 * @returns {String} Formatted size
 */
function formatSize(size) {
  return size / (1024 * 1024) < 1 ? Math.round((size / 1024) * 10) / 10 + 'KB' : Math.round((size / (1024 * 1024) * 10)) / 10 + 'MB';
}

export default formatSize;