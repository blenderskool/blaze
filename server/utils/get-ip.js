const TRUST_PROXY = Boolean(process.env.TRUST_PROXY);

/**
 * Gets the IP address from request object
 * @param {import('node:http').IncomingMessage | import('express').Request} request
 * @returns {String | undefined} IP address
 */
function getIp(request) {
  let forwarded = request.headers['x-forwarded-for'] ?? '';
  if (Array.isArray(forwarded)) {
    forwarded = forwarded.join(',');
  }

  let ip =
    'ip' in request
      ? request.ip
      : TRUST_PROXY
      ? forwarded.split(',').shift()
      : undefined;
  ip = ip ?? request.socket.remoteAddress;
  // localhost is referred to differently in IPv4 and IPv6
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    ip = '127.0.0.1';
  }

  return ip;
}

export default getIp;
