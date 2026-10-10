const fs = require('fs');
const path = require('path');

// The manifest loads bundles from the repo root, so every build (watch included)
// copies them there. Edit src/, never the root copies.
class CopyToRootPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('CopyToRootPlugin', (compilation) => {
      for (const name of ['contentScript.js', 'bridge.js', 'background.js']) {
        const from = path.join(compiler.options.output.path, name);
        if (fs.existsSync(from)) fs.copyFileSync(from, path.join(__dirname, name));
      }
    });
  }
}

module.exports = (env, argv) => ({
  entry: {
    contentScript: './src/contentScript.jsx',
    bridge: './src/bridge.js',
    background: './src/background.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  devtool: argv.mode === 'development' ? 'cheap-source-map' : false,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        // Panel CSS is injected into the extension's shadow root, never the page.
        test: /\.css$/,
        use: [{ loader: 'css-loader', options: { exportType: 'string' } }],
      },
    ],
  },
  plugins: [new CopyToRootPlugin()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
});
