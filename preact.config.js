const { DefinePlugin } = require('webpack');

module.exports = function (config, env, helpers) {
  // disable css modules
  // uncomment the code below when https://github.com/preactjs/preact-cli/issues/897 gets a solution
  let css = helpers.getLoadersByName(config, 'css-loader')[0];
  css.loader.options.modules = false;

  config.plugins.push(
    new DefinePlugin({
      WS_HOST: JSON.stringify(process.env.WS_HOST || 'ws://localhost:3030'),
    })
  );

  return config;
}