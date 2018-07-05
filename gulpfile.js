const gulp = require('gulp')
//图片
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');

// css处理
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const px2rem = require('gulp-ipx2rem');
const cleanCss = require('gulp-clean-css'); //css压缩
const rename=require('gulp-rename');//重命名
// 浏览器异步刷新
var browserSync = require('browser-sync').create(); 
var reload=browserSync.reload;
// 开发目录
var dev = {
	basePath:'src/',	
	less:'src/assets/less/',
	lcss:'src/assets/lcss/',
	css:'src/assets/css/',
	images:'src/assets/images/',
	js:'src/assets/js/',
	html:'src/html/'
}
// 生产目录
var build = {
	css:'build/assets/css/',
	images:'build/assets/images/',
	js:'build/assets/js/',
	html:'build/html/'
}
// 开发环境
gulp.task('dev',['html','less','css','js','img'],function(){
	browserSync.init({
        server: {
			// 指定目录 root
			baseDir: './',
			//默认跳转的地址
			// index:'html/index.html' 
			// 打开目录
			directory: true
        },
        port: 8080
	});
    gulp.watch(dev.html+'**/*.html',['html'])
	gulp.watch(dev.less+'*.less',['less'])
	gulp.watch(dev.lcss+'*.css',['css'])
	gulp.watch(dev.js+'*.js',['js'])
	gulp.watch(dev.images+'*',['img'])
})
// 生产环境
//gulp.task('build',['css:build'])


gulp.task('html', function () {
	return gulp.src(dev.html+'**/*.html')
	  .pipe(gulp.dest(build.html))
	  .pipe(reload({
		  stream:true
	  }))
  })

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
        .pipe(px2rem({
			baseDpr: 2,             // base device pixel ratio (default: 2)
			threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
			remVersion: true,       // whether to generate rem version (default: true)
			remUnit: 75,            // rem unit value (default: 75)
			remPrecision: 6         // rem precision (default: 6)
		  }))
		
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
/*-----------------------------build---------------------------------*/ 
gulp.task('img:build', function(){
   return gulp.src(dev.images+'*')
    .pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5})
		]))
    .pipe(gulp.dest(build.images))
});
gulp.task('css:build', function () {
    return gulp.src(build.css+'*.css')
		.pipe(base64({
			maxImageSize: 8*1024, // bytes 
			debug: true
		}))
		.on('error', swallowError)
		.pipe(cleanCss())
		.pipe(rename({
			suffix: ".min",
		}))
        .pipe(gulp.dest(build.css))
});
// 处理错误并触发end
function swallowError(error) {
  console.error(error.toString())
  this.emit('end')
}