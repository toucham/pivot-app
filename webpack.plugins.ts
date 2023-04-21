import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new HtmlWebpackPlugin({
    // custom html
    template: path.join(__dirname, './src/index.html'),
  }),
  new WebpackManifestPlugin({}),
  //remove all files inside webpack's output.path directory as well as ununsed webpack assets after every successful build
  new CleanWebpackPlugin(),
  //speed up TS type checking & ESLint linting
  new ForkTsCheckerWebpackPlugin(),
];
