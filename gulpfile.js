const gulp = require("gulp");

//任务条件
const gulpSequence = require("gulp-sequence"); //任务执行序列化插件
const filter = require("gulp-filter"); // 过滤
const del = require("del"); // 删除插件
const rename = require("gulp-rename"); // 重命名
const change = require("gulp-changed"); // 只修改改动的文件
const gulpif = require("gulp-if"); //if条件
const gutil = require("gulp-util");
const plumber = require("gulp-plumber"); //输出错误
const notify = require("gulp-notify"); //任务通知
// HTML
const useref = require("gulp-useref"); //页面中合并资源
const htmlminify = require("gulp-html-minify"); //html压缩
// IMAGE
const imagemin = require("gulp-imagemin"); //图片压缩
const base64 = require("gulp-base64"); // 图片转base64
// CSS
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const px2rem = require("gulp-ipx2rem");
const cleanCss = require("gulp-clean-css"); //css压缩
// JS
const babel = require("gulp-babel");
const beautify = require("gulp-beautify");
const uglify = require("gulp-uglify");

// 浏览器异步刷新
var browserSync = require("browser-sync").create();
var reload = browserSync.reload;
// build得一些插件
const zip = require("gulp-zip");
const config = require("./config.json");
let babelFilter = config.babel.filter;
let jsminFilter = config.uglify.filter;

// 开发环境
gulp.task("dev", ["init"], function() {
  browserSync.init({
    server: {
      // 指定目录 root
      baseDir: "./",
      //默认跳转的地址
      // index:'html/index.html'
      // 打开目录
      directory: true
    },
    open: false,
    port: 8080
  });
  gulp.watch(config.dev.html + "**/*.html", ["html"]);
  gulp.watch(config.dev.less + "*.less", ["less"]);
  gulp.watch(config.dev.css + "*.css", ["css"]);
  gulp.watch(config.dev.js + "**/*.js", ["js", "babel"]);
  gulp.watch(config.dev.images + "*", ["img"]);
});
// 开始运行时，删除build目录，并将资源处理并复制到build
gulp.task(
  "init",
  gulpSequence("del", "less", "css", "js", "babel", "img", "html")
);
// 生产环境
gulp.task(
  "build",
  gulpSequence(
    "del",
    "less",
    "css",
    "js",
    "babel:build",
    "js:build",
    "img",
    "html",
    "css:build",
    "html:build"
  )
);

gulp.task("html", function() {
  return gulp
    .src(config.dev.html + "**/*.html")
    .pipe(change(config.build.html))
    .pipe(gulp.dest(config.build.html))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("less", function() {
  return gulp
    .src(config.dev.less + "*.less")
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error);
        this.emit("end");
      }
    }))
    .pipe(change(config.dev.css))
    .pipe(less())
    .pipe(gulp.dest(config.dev.css))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("css", function() {
  return gulp
    .src(config.dev.css + "*.css")
    .pipe(plumber())
    .pipe(change(config.build.css))
    .pipe(postcss([autoprefixer(config.autoprefixer.options)]))
    .pipe(gulp.dest(config.dev.css))
    .pipe(gulpif(config.px2rem.open, px2rem(config.px2rem.optipng)))
    .pipe(gulp.dest(config.dev.css))
    .pipe(gulp.dest(config.build.css))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("js", function() {
  return gulp
    .src(config.dev.js + "**/*.js")
    .pipe(plumber())
    .pipe(change(config.build.js))
    .pipe(gulp.dest(config.build.js))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("babel", function() {
  return gulp
    .src([config.dev.js + "**/*.js", ...config.babel.filter])
    .pipe(change(config.build.js))
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error);
          this.emit("end");
        }
      })
    )
    .pipe(babel(config.babel.options))
    .pipe(gulp.dest(config.build.js))
    .pipe(
      reload({
        stream: true
      })
    );
});
gulp.task("img", function() {
  return gulp
    .src(config.dev.images + "*")
    .pipe(change(config.build.images))
    .pipe(gulp.dest(config.build.images))
    .pipe(
      reload({
        stream: true
      })
    );
});
gulp.task("del", function() {
  return del([config.build.baseDir]).then(paths => {
    console.log("删除得文件:\n", paths.join("\n"));
  });
});
/*-----------------------------build---------------------------------*/

gulp.task("html:build", function() {
  return gulp
    .src(config.build.html + "**/*.html")
    .pipe(useref())
    .pipe(gulpif(config.htmlminify.compress, htmlminify()))
    .pipe(gulp.dest(config.build.html))
    .pipe(notify({
      title:'云信构建工具',
      message:'构建成功'
    }));
});
gulp.task("img:build", function() {
  return gulp
    .src(config.dev.images + "**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 })
      ])
    )
    .pipe(gulp.dest(config.build.images));
});
// css压缩
gulp.task("css:build", function() {
  return gulp
    .src(config.build.css + "*.css")
    .pipe(plumber())
    .pipe(base64(config.cleanCss.base64))
    .pipe(gulpif(config.cleanCss.compress, cleanCss()))
    .pipe(gulp.dest(config.build.css));
});
// js压缩美化
gulp.task("js:build", function() {
  return gulp
    .src([config.build.js + "**/*.js", ...config.uglify.filter])
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error);
          this.emit("end");
        }
      })
    )
    .pipe(gulpif(config.uglify.compress, uglify(), beautify()))
    .pipe(gulp.dest(config.build.js));
});
//babel
gulp.task("babel:build",function() {
  return gulp
    .src([config.dev.js + "**/*.js", ...config.babel.filter])
    .pipe(
      plumber({
        errorHandler: function(error) {
          console.log(error);
          this.emit("end");
        }
      })
    )
    .pipe(babel(config.babel.options))
    .pipe(gulp.dest(config.build.js));
});

// 打包zip
gulp.task("zip", function() {
  return gulp
    .src(config.build.baseDir + "**")
    .pipe(zip(config.zip.name))
    .pipe(notify({
      title:'云信构建工具',
      message:'zip打包成功'
    }))
    .pipe(gulp.dest("./"));
});
// 处理错误并触发end

function swallowError(error) {
  gutil.log(gutil.colors.red("Error"), "：", error.toString());

  this.emit("end");
}
