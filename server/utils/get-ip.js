/**
 * Gets the IP address from request object
 * @param {import('node:http').IncomingMessage | import('express').Request} request
 * @returns {String} IP address
 */
function getIp(request) {
  let ip =
    request.headers['x-forwarded-for']?.split(',').shift() ??
    request.socket?.remoteAddress;
  // localhost is referred to differently in IPv4 and IPv6
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  return ip;
}

export default getIp;
