var gulp = require("gulp");
// var gutil = require("gulp-util");
var del = require("del");
var rename = require('gulp-rename');
var less = require('gulp-less');
// var clean = require('gulp-clean');
var mini = require('gulp-minify-css');
var webpack = require("webpack");
// var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

var connect = require('gulp-connect');
// var mocks = require('./mocks');

/**
 * ----------------------------------------------------
 * source configuration
 * ----------------------------------------------------
 */

var src = {
  html: "html/*.html",                          // html 文件
  vendor: ["vendor/*", "bower_components/**/*"], // vendor 目录和 bower_components
  style: "style/*",                  // style 目录下所有 xx/index.less
  assets: "images/*"                             // 图片等应用资源
};

var dist = {
  root: "dist/",
  html: "dist/",
  style: "dist/style",
  vendor: "dist/vendor",
  assets: "dist/images"
};

/**
 * ----------------------------------------------------
 *  tasks
 * ----------------------------------------------------
 */

/**
 * clean
 */

gulp.task('clean',function(){
  del.sync(dist.root);
});


/**
 * [copyVendor description]
 * @return {[type]} [description]
 */
gulp.task('copyVendor',function(){
  gulp.src(src.vendor)
    .pipe(gulp.dest(dist.vendor));
});

/**
 * [copyAssets description]
 * @return {[type]} [description]
 */
gulp.task('copyAssets',function(){
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets));
});
/**
 * [html description]
 * @return {[type]} [description]
 */
gulp.task('html',function(){
  gulp.src(src.html)
      .pipe(gulp.dest(dist.html));
});

/**
 * [style description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
gulp.task('style',function(){
  gulp.src(src.style)
      .pipe(less())
      .on('error', handleError)
      .pipe(gulp.dest(dist.style));
});
/**
 * [webpackProduction description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
gulp.task('webpackProduction',function(){
  var config = Object.create(webpackConfig);
  // config.plugins = config.plugins.concat(
  //   new webpack.DefinePlugin({
  //     "process.env": {
  //       "NODE_ENV": "production"
  //     }
  //   }),
  //   new webpack.optimize.DedupePlugin(),
  //   new webpack.optimize.UglifyJsPlugin()
  // );

  webpack(config, function(err, stats) {
    // if(err) throw new gutil.PluginError("webpack:build", err);
    // gutil.log("[webpack:production]", stats.toString({
    //   colors: true
    // }));
    // done();
  });
});


/**
 * [webpackDevelopment description]
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
var devConfig, devCompiler;
devConfig = Object.create(webpackConfig);
// devConfig.devtool = "sourcemap";
// devConfig.debug = true;
devCompiler = webpack(devConfig);
gulp.task('webpackDevelopment',function(){
  devCompiler.run(function(err, stats) {
    // if (err) {
    //   throw new gutil.PluginError("webpack:build-dev", err);
    //   return;
    // }
    // gutil.log("[webpack:build-dev]", stats.toString({
    //   colors: true
    // }));
    // done();
  });
});

/**
 * webpack develop server
 */
// devConfig.plugins = devConfig.plugins || []
// devConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
// function webpackDevelopmentServer(done) {
//   new WebpackDevServer(devCompiler, {
//    contentBase: dist.root,
//     lazy: false,
//     hot: true
//   }).listen(8080, 'localhost', function (err) {
//     if (err) throw new gutil.PluginError('webpack-dev-server', err)
//     gutil.log('[webpack-dev-server]', 'http://localhost:8080/')
//  reload();
//  done();
//   });
// }

/**
 * [connectServer description]
 * @return {[type]} [description]
 */
gulp.task('connectServer',function(){
  connect.server({
      root: './',
      port: 2222,
      livereload: true
  });
});

/**
 * [watch description]
 * @return {[type]} [description]
 */
gulp.task('watch',function(){
  gulp.watch(src.html, ['html']);
  gulp.watch("script/*.js", ['webpackDevelopment']);
  gulp.watch("script/*.jsx", ['webpackDevelopment']);
  gulp.watch("style/*.less", ['style']);
  gulp.watch("dist/**/*").on('change', function(file) {
    gulp.src('dist/')
      .pipe(connect.reload());
  });
});

/**
 * default task
 */
gulp.task("default", ['clean','copyAssets','copyVendor','html','style','webpackDevelopment','connectServer','watch'],function(){
  console.log('run success');
});

/** 
 * production build task
 */
gulp.task("build", ['clean','copyAssets','copyVendor','html','style','webpackProduction'],function(){
  console.log('build success');
});

/**
 * [handleError description]
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function handleError(err) {
  if (err.message) {
    console.log(err.message)
  } else {
    console.log(err)
  }
  this.emit('end')
}

/**
 * [reload description]
 * @return {[type]} [description]
 */
function reload() {
  connect.reload();
}