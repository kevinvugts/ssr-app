const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

// only for prod
const CompressionPlugin = require('compression-webpack-plugin')

require('dotenv').config({ path: path.join(__dirname, `.env.development`) })

//https://www.npmjs.com/package/isomorphic-loader
const common = {
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.(js|jsx|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'server'),
        ],
        exclude: /node_modules/,
        options: {
          babelrc: true,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.ts(x)?$/,
        use: ['awesome-typescript-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.css', '.scss'],
    alias: {
      '@services': path.resolve(__dirname, '../src/services'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@seed': path.resolve(__dirname, '../src/seed'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@managers': path.resolve(__dirname, '../src/managers'),
      '@context': path.resolve(__dirname, '../src/context'),
    },
  },
}

const clientConfig = {
  mode: 'production',
  name: 'client',
  target: 'web',
  entry: {
    client: [
      '@babel/polyfill',
      'core-js',
      path.resolve(__dirname, './src/client.js'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: module => /node_modules/.test(module.resource),
          enforce: true,
        },
      },
    },
  },
  devtool: 'inline-source-map',
  resolve: {
    fallback: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.css', '.scss'],
    alias: {
      '@services': path.resolve(__dirname, '../src/services'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@seed': path.resolve(__dirname, '../src/seed'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@managers': path.resolve(__dirname, '../src/managers'),
      '@context': path.resolve(__dirname, '../src/context'),
    },
  },
  module: {
    rules: [
      ...common.module.rules,
      {
        test: /\.s[ac]ss$/i,
        // include: /node_modules/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            },
          },

          // Compiles Sass to CSS
          'resolve-url-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/i,
        //include: /node_modules/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },

          // Compiles Sass to CSS
          'resolve-url-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_CONFIG: JSON.stringify({
        appEnvironment: process.env.APP_ENVIRONMENT,
        apiHost: process.env.API_HOST,
        apiVersion: process.env.API_VERSION,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        googleTagManagerId: process.env.GOOGLE_TAGMANAGER_ID,
        googleAnalyticsTrackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
      }),
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.jsx$|\.css$|\.html$/,
    }),
  ],
}

const serverConfig = {
  mode: 'production',
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    server: [
      '@babel/polyfill',
      'core-js',
      path.resolve(__dirname, './server/server.js'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js',
  },
  devtool: 'cheap-module-source-map',
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  resolve: {
    fallback: {
      console: false,
      process: false,
      Buffer: false,
    },
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.css', '.scss'],
    alias: {
      '@services': path.resolve(__dirname, '../src/services'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@hooks': path.resolve(__dirname, '../src/hooks'),
      '@seed': path.resolve(__dirname, '../src/seed'),
      '@pages': path.resolve(__dirname, '../src/pages'),
      '@managers': path.resolve(__dirname, '../src/managers'),
      '@context': path.resolve(__dirname, '../src/context'),
    },
  },
  module: {
    rules: [
      ...common.module.rules,
      {
        test: /\.s[ac]ss$/i,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },

          // Compiles Sass to CSS
          'resolve-url-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_CONFIG: JSON.stringify({
        appEnvironment: process.env.APP_ENVIRONMENT,
        apiHost: process.env.REACT_APP_API_URL || 'http://localhost:1337',
        apiVersion: process.env.API_VERSION,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
        googleTagManagerId: process.env.GOOGLE_TAGMANAGER_ID,
        googleAnalyticsTrackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
      }),
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.jsx$|\.css$|\.html$/,
    }),
  ],
}

module.exports = [clientConfig, serverConfig]
