const { DefinePlugin } = require('webpack');
const ip = require('ip');

module.exports = function (config, env, helpers) {
  // disable css modules
  // uncomment the code below when https://github.com/preactjs/preact-cli/issues/897 gets a solution
  const css = helpers.getLoadersByName(config, 'css-loader')[0];
  css.loader.options.modules = false;

  const babel = helpers.getLoadersByName(config, 'babel-loader')[0].rule.options;
  babel.plugins.push([require.resolve('babel-plugin-react-scoped-css')]);

  config.module.rules[4].use.splice(2, 0, { loader: 'scoped-css-loader' });

  config.plugins.push(
    new DefinePlugin({
      WS_HOST: JSON.stringify(
        process.env.WS_HOST !== undefined
          ? process.env.WS_HOST
          : `ws://${ip.address()}:3030`
      ),
      SERVER_HOST: JSON.stringify(
        process.env.SERVER_HOST !== undefined
          ? process.env.SERVER_HOST
          : `http://${ip.address()}:3030`
      ),
      WS_SIZE_LIMIT: JSON.stringify(process.env.WS_SIZE_LIMIT || 1e8),
      TORRENT_SIZE_LIMIT: JSON.stringify(process.env.TORRENT_SIZE_LIMIT || 7e8),
    })
  );

  return config;
}