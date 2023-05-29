const path = require('path')

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = {
  entry: './after.js', // Replace with the entry point of your Chrome extension
  output: {
    filename: 'bundle.js',

    // path: path.resolve(__dirname, 'dist'), // Replace with the output directory path for your Chrome extension
  },

  resolve: {
    fallback: {
      assert: require.resolve('assert'),
      fs: false,
      net: false,
      tls: false,
      // Add other Node.js core modules that you need
    },
  },

  plugins: [new NodePolyfillPlugin()],
}
