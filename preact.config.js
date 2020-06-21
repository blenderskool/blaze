const Dotenv = require('dotenv-webpack');

module.exports = function (config, env, helpers) {
  // disable css modules
  // uncomment the code below when https://github.com/preactjs/preact-cli/issues/897 gets a solution
  let css = helpers.getLoadersByName(config, 'css-loader')[0];
  css.loader.options.modules = false;

  config.plugins.push(new Dotenv());

  return config;
}