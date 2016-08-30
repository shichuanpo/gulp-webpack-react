var gulp = require("gulp");
// var gutil = require("gulp-util");
var del = require("del");
// var rename = require('gulp-rename');
// var less = require('gulp-less');
// var clean = require('gulp-clean');
// var mini = require('gulp-minify-css');
var webpack = require("webpack");
// var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

var connect = require('gulp-connect');

/**
 * ----------------------------------------------------
 * source configuration
 * ----------------------------------------------------
 */

var src = {
  html: "html/*.html",                          // html 文件
  vendor: "vendor/*",                          // vendor 目录
  style: "style/*",                             // style 目录下所有 xx/index.less
  assets: "images/*"                             // 图片等应用资源
};

//dist为编译后的文件
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

//dist文件夹的清除，一般在第一次构建的时候用到
gulp.task('clean',function(){
  del.sync(dist.root);
});
//复制vendor文件夹
gulp.task('copyVendor',function(){
  gulp.src(src.vendor)
    .pipe(gulp.dest(dist.vendor));
});
//复制assets文件夹
gulp.task('copyAssets',function(){
  gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets));
});
//复制html文件夹
gulp.task('html',function(){
  gulp.src(src.html)
      .pipe(gulp.dest(dist.html));
});


var devConfig, devCompiler;
devConfig = Object.create(webpackConfig);
// devCompiler = webpack(devConfig);
//webpack编译打包，第一次编译后，后面就不用了。
gulp.task('webpackProduction',function(){
 
  webpack(devConfig, function(err, stats) {
    if(err){
      console.log('task webpackProduction error！');
      return;
    } 
    console.log('task webpackProduction success');
   
  });
});

// //webpack服务启动，以及监听资源变化自动编译。
// gulp.task('webpackDevelopment',function(){
//   devCompiler.run(function(err, stats) {
//     if (err) {
//       console.log('task webpackDevelopment error！');
//       return;
//     }
//     console.log('task webpackDevelopment success');
//   });
// });

//gulp的connect服务
gulp.task('connectServer',function(){
  connect.server({
      root: dist.root,
      port: 2222,
      livereload: true
  });
});

//监听事件
gulp.task('watch',function(){
  gulp.watch(src.html, ['html','webpackProduction']);
  gulp.watch("script/*.js", ['webpackProduction']);
  gulp.watch("script/*.jsx", ['webpackProduction']);
  gulp.watch("style/*.less", ['webpackProduction']);
});

/**
 * default task，服务启动，以及监听资源变化自动编译。
 */
gulp.task("default", ['webpackProduction','connectServer','watch'],function(){
  console.log('task default success');
});

/** 
 * production build task
 */
gulp.task("build", ['clean','copyAssets','copyVendor','html'],function(){
  console.log('task build success');
});
