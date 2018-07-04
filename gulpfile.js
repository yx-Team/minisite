const gulp = require('gulp')

//图片
const imagemin = require('gulp-imagemin');
// css处理
const less = require('gulp-less')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const px2rem = require('gulp-pxrem');
// 浏览器异步刷新
var browserSync = require('browser-sync').create(); 
var reload=browserSync.reload;

var dev = {
	basePath:'src/',
	less:'src/assets/less/',
	lcss:'src/assets/lcss/',
	css:'src/assets/css/',
	images:'src/assets/images/',
	js:'src/assets/js/',
	html:'src/html/'
}
var build = {
	css:'src/public/css/',
	images:'src/public/images/',
	js:'src/public/js/'
}
gulp.task('dev',function(){
	browserSync.init({
        server: {
			baseDir: dev.basePath,
			//默认跳转的地址
			// index:'html/index.html' 
			// 打开目录
			directory: true
        },
        port: 8080
	});
    gulp.watch(dev.html+'**/*.html').on('change', reload)
	gulp.watch(dev.less+'*.less',['less'])
	gulp.watch(dev.lcss+'*.css',['css'])
	gulp.watch(dev.js+'*.js',['js'])
	gulp.watch(dev.images+'*',['img'])
})
gulp.task('build',['img:build'])


gulp.task('less', function () {
  return gulp.src(dev.less+'*.less')
	.pipe(less())
	.on('error', swallowError)
    .pipe(gulp.dest(dev.lcss))
    .pipe(reload({
		stream:true
	}))
})

gulp.task('css', function () {
	var postcssPlugs = [
		autoprefixer({browsers: ['last 2 version']})
	]
    return gulp.src(dev.lcss+'*.css')
        .pipe(postcss(postcssPlugs))
        .pipe(gulp.dest(dev.css))
        .pipe(px2rem())
        .pipe(gulp.dest(build.css))
        .pipe(reload({
			stream:true
		}))
});
gulp.task('js', function(){
   return gulp.src(dev.js+'*.js')
    .pipe(gulp.dest(build.js))
    .pipe(reload({
			stream:true
		}))
});
gulp.task('img', function(){
   return gulp.src(dev.images+'*')
    .pipe(gulp.dest(build.images))
    .pipe(reload({
			stream:true
		}))
});
gulp.task('img:build', function(){
   return gulp.src(dev.images+'*')
    .pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5})
		]))
    .pipe(gulp.dest(build.images))
});

// 处理错误并触发end
function swallowError(error) {
  console.error(error.toString())
  this.emit('end')
}