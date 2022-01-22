const webpack = require("webpack");

const isProduction = process.env['NODE_ENV '] === 'production';

const productionWebpackPlugins = [
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    Popper: ['popper.js', 'default']
  }),
]

const devWebpackPlugins = [
  ...productionWebpackPlugins,
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 50000,
  }),
];

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.prettify = false
        return options
      })
  },
  configureWebpack: {
    // enable only when needed
    // devtool: 'source-map',
    devtool: false,
    plugins: isProduction ? productionWebpackPlugins : devWebpackPlugins,
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  }
}
