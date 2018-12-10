/**
 * Script file that handles the registration of a first time user.
 */
const store = localStorage;

/**
 * Redirect to the main app, if user storage data is present
 */
if (store.getItem('blaze')) window.location.pathname = '/';



document.getElementById('frmNewUser').addEventListener('submit', e => {

  e.preventDefault();

  store.setItem('blaze', JSON.stringify({
    name: document.getElementById('inpName').value
  }));

  window.location.pathname = '/';

});