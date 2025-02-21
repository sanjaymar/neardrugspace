// webpack.config.js
module.exports = {
    resolve: {
      alias: {
        'fbjs/lib/setImmediate': path.resolve(__dirname, 'src/polyfills/setImmediate.js')
      }
    }
  }