import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import path from 'path';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

interface Configuration extends WebpackConfiguration {
  devServer: DevServerConfiguration;
}

const mainConfig: Configuration = {
  // from webpack.main.config.ts
  entry: path.join(__dirname, 'src/index.tsx'),
  mode: 'development',
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true,
  },
  module: {
    rules,
  },
  plugins,

  // webpack.dev.config.ts
  performance: {
    hints: 'warning',
    maxAssetSize: 20000000,
    maxEntrypointSize: 8500000,
    assetFilter: (assetFilename: string) => {
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    devMiddleware: {
      writeToDisk: true,
      publicPath: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    compress: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devtool: 'source-map',
};

module.exports = mainConfig;
