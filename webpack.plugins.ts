import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import type { WebpackPluginInstance } from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const devMode = process.env.NODE_ENV !== 'production';
// eslint-disable-next-line @typescript-eslint/no-var-requires

export const plugins: WebpackPluginInstance[] = [
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

if (!devMode) {
  plugins.push(new MiniCssExtractPlugin());
}
