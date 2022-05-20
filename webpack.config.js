const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require ('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    },
    minimize: true,
  }

  if (isProd) {
    config.minimizer = [
      new TerserWebpackPlugin(),
      new CssMinimizerPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
  const loaders = [
      {
          loader: MiniCssExtractPlugin.loader,
          options: {
                  hmr: isDev,
                  reloadAll: true,
          },
       },
       'css-loader'
  ]

  if (extra) {
      loaders.push(extra)
  }
  
  return loaders
}

const babelOptions = preset => {
  const options = {
      presets: [
          '@babel/preset-env',
      ]
  }
  
  if (preset) {
      options.presets.push(preset)
  }

  return options
}

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './src/js/script.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.jpg', '.svg', '.css', '.html'],
  },
  optimization: optimization(),
  devServer: {
    port: 5500,
    hot: isDev,
  },
  watch: true,
  devtool: 'source-map',
  plugins: [
    new HTMLWebpackPlugin({
        template: './src/index.html',
        minify: {
          collapseWhitespace: isProd,
        }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/styles'),
          to: path.resolve(__dirname, 'dist/styles')
        },
        {
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, 'dist/img')
        },
      ]
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions(),
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: babelOptions('@babel/preset-typescript'),
          }
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        }
      },
      {
        test: /\.(png|jpe?g|svg|gif|css)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use:['xml-loader']
      },
      {
        test: /\.csv$/,
        use:['csv-loader']
      },
      {
        test: /\.css$/,
        use:cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },

    ]
  }
};
