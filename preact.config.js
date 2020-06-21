const { DefinePlugin } = require('webpack');

module.exports = function (config, env, helpers) {
  // disable css modules
  // uncomment the code below when https://github.com/preactjs/preact-cli/issues/897 gets a solution
  let css = helpers.getLoadersByName(config, 'css-loader')[0];
  css.loader.options.modules = false;

  const envKeys = Object.keys(process.env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
    return prev;
  }, {});

  config.plugins.push(new DefinePlugin(envKeys));

  return config;
}