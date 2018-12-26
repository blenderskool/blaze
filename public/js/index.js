/**
 * Removes all the child elements from a node
 * @param {Node} node Node for which children should be removed
 */
function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function getQuery(query) {
  let match;
  const pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        urlParams = {};

  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);

  return urlParams;
}


const $router = new Navigo();

$router.on(function(query) {
  query = getQuery(query);

  if ($socket)
    $socket.disconnect();

  if (!localStorage.getItem('blaze')) {
    loadNewUser();
  }
  else if (query.room) {
    loadApp(query.room);
  }
  else {
    loadHome();
  }

}).resolve();