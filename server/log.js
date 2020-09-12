/**
 * A custom log function that also prints the time
 * @param {String} message Message to be logged
 */
function log(message) {
  if (process.env.NODE_ENV === 'production') return;

  const date = new Date();
  console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message}`);
}

export default log;