/**
 * Dependencies
 */
var webpack = require('webpack');

/**
 * Import hash output plugin
 */
var OutputHashAsModulePlugin = require('./webpack-output-hash-as-module-plugin');

/**
 * Environment
 */
var isProduction = process.env.NODE_ENV === 'production';
var port = process.env.PORT || 3000;

/**
 * Plugins
 */
var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    '__DEVELOPMENT__': JSON.stringify(!isProduction)
  }),
  new webpack.IgnorePlugin(new RegExp('node-sass'))
];

/**
 * Add hot module replacement
 * when developing
 */
if (!isProduction) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

/**
 * Do code de-duping and minification
 * when running production mode
 */
if (isProduction) {
  plugins.push(new OutputHashAsModulePlugin({ file: 'bundle-hash.js' }));
	if (!process.env.DISABLE_JS_UGLIFY) {
		plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, }, sourceMap: true, }));
  }
}

/**
 * Entry points
 */
var entry = ['./src/client-bootstrap'];

/**
 * Add required entry points
 * when using hot module replacement
 * and webpack-dev-server
 */
if (!isProduction) {
  entry.unshift('webpack/hot/only-dev-server');
  entry.unshift('webpack-dev-server/client?http://localhost:' + port);
}

/**
 * Config
 *
 * TODO: Make the parts of the config that should be
 * customizable properties that you can inject into
 * a constructor function (entry, output.path, output.publicPath, etc...)
 */
module.exports = {
  /**
   * Use source maps for better debugging
   * http://cheng.logdown.com/posts/2016/03/25/679045
   */
  devtool: isProduction ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',

  /**
   * Add our entry file(s)
   */
  entry: entry,

  /**
   * Bundle output settings
   *
   * Production: Use the hash to tag the output bundles
   * Development: No hashing (as we refer to just "app.js" in /public/static/index.html)
   */
  output: isProduction ? {
    path: './public/static/',
    publicPath: '/static/',
    filename: 'app.[hash].js',
    chunkFilename: '[id].app.[chunkHash].js'
  } : {
    path: './public/static/',
    publicPath: '/static/',
    filename: 'app.js',
    chunkFilename: '[id].app.js'
  },

  /**
   * Add out plugins to the config
   */
  plugins: plugins,

  /**
   * Module loaders for resolving
   * the different file extensions
   * using loaders
   */
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: !isProduction ? [
        {
          loader: 'react-hot-loader',
        }, {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              // ['es2015', {modules: false}],
              'es2015',
              'stage-0',
              'react',
            ],
            plugins: [
              // All these plugins transform dynamic import with async/await
              'syntax-async-functions',
              'syntax-dynamic-import',
              'transform-async-to-generator',
              'transform-regenerator',
              'transform-runtime',

              // Now for some other plugins
              'transform-flow-strip-types',
              'styled-components',
            ],
          }
        },
      ] : [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              //['es2015', {modules: false}],
              'es2015',
              'stage-0',
              'react',
            ],
            plugins: [
              // All these plugins transform dynamic import with async/await
              'syntax-async-functions',
              'syntax-dynamic-import',
              'transform-async-to-generator',
              'transform-regenerator',
              'transform-runtime',

              // Now for some other plugins
              'transform-flow-strip-types',
              'styled-components',
            ],
          }
        }
      ],
    }, {
      test: /\.scss$/,
      use: !isProduction ? [
        {
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            minimize: true,
            autoprefixer: true,
          },
        }, {
          loader: 'postcss-loader',
        }, {
          loader: 'sass-loader'
        },
      ] : [
        {
          loader: 'css-loader',
          options: {
            minimize: true,
            autoprefixer: false,
          },
        }, {
          loader: 'postcss-loader',
        }, {
          loader: 'sass-loader',
        },
      ]
    }]
  },

  /**
   * Add resolver aliases that
   * we want to ignore in our
   * webpack bundle
   *
   * NOTE: We just replace any
   * server specific modules
   * with a no-op (from npm)
   */
  resolve: {
    alias: {
      'node-sass': 'no-op'
    }
  },

  /**
   * Add node built-ins requires that should
   * be ignored when creating
   * the webpack bundle (since these are server-only)
   */
  node: {
    'fs': 'empty',
    'node-sass': 'empty'
  }
};
