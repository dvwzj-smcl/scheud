import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};

export default {
  debug: true,
  devtool: 'source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // set to false to see a list of every file being bundled.
  entry: './resources/assets/react/index',
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: `${__dirname}`,
    // path: `${__dirname}/public`,
    publicPath: '/',
    filename: 'bundle.js'
  },
  node: {
    net: "empty",
    dns: "empty",
    fs: "empty"
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS), // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new ExtractTextPlugin('styles.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: path.join(__dirname, 'resources/assets/react'), loaders: ['babel']},
      {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'},
      {test: /\.(woff|woff2)$/, loader: 'file-loader?prefix=font/&limit=5000'},
      {test: /\.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=image/svg+xml'},
      {test: /\.(jpe?g|png|gif)$/i, loaders: ['file']},
      {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
      // {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract({
      //   loader: ['style', 'css?sourceMap', 'sass?sourceMap']
      // }), exclude: /flexboxgrid/},
      // {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract({
      //   loader: "style!css?modules"
      // }), include: /flexboxgrid/}
      {test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract('css?sourceMap!postcss!sass?sourceMap'), exclude: /flexboxgrid/},
      // {test: /\.css$/, loader: 'style!css?modules', include: /flexboxgrid/ }
      // {test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'], exclude: /flexboxgrid/},
      {test: /\.css$/,loader: 'style!css?modules',include: /flexboxgrid/}
    ]
  }
};
