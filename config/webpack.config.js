const path = require('path')
const nodeExternals = require('webpack-node-externals')
const validate = require('webpack-validator')

const common = {
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.(js|jsx|tsx)$/,
        exclude: /node_modules/,
        options: {
          babelrc: true,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
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
  mode: 'development',
  name: 'client',
  target: 'web',
  entry: {
    client: [
      '@babel/polyfill',
      'core-js',
      path.resolve(__dirname, 'src', 'app.js'),
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
  devtool: 'cheap-module-source-map',
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
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
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
}

const serverConfig = {
  mode: 'development',
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    server: [
      '@babel/polyfill',
      'core-js',
      path.resolve(__dirname, 'server', 'server.js'),
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
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
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
}

module.exports = validate([clientConfig, serverConfig])
