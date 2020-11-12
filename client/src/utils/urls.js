export default {
  WS_HOST: (() => {
    if (WS_HOST) return WS_HOST;

    if (window.location.protocol === 'https:') {
      return `wss://${window.location.host}/ws`;
    } else {
      return `ws://${window.location.host}/ws`;
    }
  })(),
  SERVER_HOST: (() => {
    if (SERVER_HOST) return SERVER_HOST;

    if (window.location.protocol === 'https:') {
      return `https://${window.location.host}/`;
    } else {
      return `http://${window.location.host}/`;
    }
  })(),
};
