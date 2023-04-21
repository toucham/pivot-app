import type { ModuleOptions } from 'webpack';

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
    test: /\.(less|css)$/i,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            modifyVars: {
              //theme customization
              '@primary-color': '#4DA56E',
            },
            javascriptEnabled: true,
          },
        },
      },
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
      },
    },
  },
];
