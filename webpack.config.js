var webpack = require('webpack');
var jquery = require('jquery');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
  entry: {
    app:[
      // 'webpack/hot/dev-server',
      // 'webpack-dev-server/client?http://localhost:8080',
      path.join(__dirname, '/script/main.jsx')
    ],
    vendor: ['jquery'],
  },
  output: {
    path: path.join(__dirname, '/dist/script/'),
    publicPath: '/script/',
    filename: '[name].js'
  },
  devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      color:true,
      //代理设置
      // proxy: {
      //     '/some/path*': {
      //         target: 'https://other-server.example.com',
      //         secure: false,
      //     },
      // },
  },
  module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react',
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'}
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin()
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'common.js')
  ]
};