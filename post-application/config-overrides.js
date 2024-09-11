const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function override(config, env) {
  if (env === 'production') {
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, 
          },
        },
      })
    );

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      use: [
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 75,
            },
            optipng: {
              enabled: true,
            },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 75,
            },
          },
        },
      ],
    });

    config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
        minChunks: 1,
        automaticNameDelimiter: '~',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: -10,
            reuseExistingChunk: true,
            enforce: true,
          },
          common: {
            name: 'common', 
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          default: false,
        },
      };

    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};
