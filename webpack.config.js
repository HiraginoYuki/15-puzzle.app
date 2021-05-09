const path = require('path');
const { resolve } = path;
const isDevelopment = process.env.NODE_ENV === 'development';
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  cache: true,

  entry: './src/index.tsx',
  resolve: { extensions: [ '.ts', '.tsx', '.js', '.css', '.scss' ] },
  output: {
    path: resolve(__dirname, 'public/build'),
    filename: './bundle.js',
    publicPath: resolve(__dirname, './public/'),
  },
  devServer: {
    writeToDisk: (filePath) => !/.*\.hot-update\..+$/.test(filePath),
    inline: true,
    hot: false,
    port: 8080,
    host: "0.0.0.0",
    publicPath: resolve(__dirname, './public/'),
    contentBase: [ './src/', './public/', './public/build/' ],
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },

  module: {
    rules: [
      { test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader',
            options: {
              url: false,
              modules: { mode: 'local', localIdentName: '[local]__[hash:base64:8]' }
            }
          },
          { loader: 'sass-loader' },
        ]
      },
      { test: /\.tsx?$/,
        use: [
          { loader: require.resolve('babel-loader'),
            options: {
              plugins: [ isDevelopment && require.resolve('react-refresh/babel') ].filter(Boolean)
            }
          },
          { loader: 'ts-loader' },
        ]
      }
    ]
  },
  plugins: [ isDevelopment && new ReactRefreshWebpackPlugin() ].filter(Boolean)
};
