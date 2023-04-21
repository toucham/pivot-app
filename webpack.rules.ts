import type { ModuleOptions } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const devMode = process.env.NODE_ENV !== 'production';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: {
      // disable type checker - we will use it in fork plugin
      transpileOnly: true,
    },
  },
  {
    test: /\.css$/i,
    use: [
      {
        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
        options: { injectType: 'styleTag' },
      },
      'css-loader',
    ],
  },
  {
    test: /\.svg$/i,
    type: 'asset/inline',
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['solid', '@babel/preset-typescript'],
        plugins: ['solid-refresh/babel'],
      },
    },
  },
];
