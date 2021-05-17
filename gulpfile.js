var gulp = require("gulp");
var gulp_min_css = require("gulp-minify-css");
var gulp_sass = require("gulp-sass") ;
var gulp_plumber = require("gulp-plumber");
var gulp_tinypng = require("gulp-tinypng");
var gulp_uglify = require("gulp-uglify");
var browser_sync = require("browser-sync").create();
var gulpCopy = require('gulp-copy');
	  gulpAuto = require("gulp-autoprefixer")

//定义gulp任务
gulp.task("mincss",function(){
	//这个任务具体要做的事情就在这里写了
	gulp.src('src/scss/**/*.scss') //地址source
			.pipe(gulp_plumber())
			.pipe(gulp_sass())
//		  .pipe(gulp_min_css())
		  .pipe(gulpAuto({
	          browsers: ['last 2 versions', 'Android >= 4.0','iOS 7','last 3 Safari versions'],
	          cascade: false//是否美化属性值 
	    		}))
		  .pipe(gulp.dest('src/css'));
})

//实时监听scss文件并转化
gulp.task("watchscss",function(){
	gulp.watch(
		'src/scss/**/*.scss',["mincss"]
	)
})
//定义图片的压缩文件
gulp.task("tinypng",function(){
	gulp.src('src/img/**/*.*')
			.pipe(gulp_plumber())
			.pipe(gulp_tinypng('SuRlJkM5BET4rjT9-JDhr_oy2oMTfVQC'))
			.pipe(gulp.dest('dist/img'));
})

//定义压缩js
gulp.task("minjs",function(){
	gulp.src('src/js/**/*.js')
			.pipe(gulp_uglify())
			.pipe(gulp.dest('dist/js'));
})

//定义压缩css
gulp.task("minCss",function(){
	gulp.src('src/css/**/*.css')
	 				.pipe(gulp_min_css())
	 				.pipe(gulp.dest('dist/css'));
})


//定义自动刷新浏览器任务
gulp.task('browser_sync', function() {
    browser_sync.init({
    	port:3003,
        server: {
            baseDir: "./"
        }       
    });
     gulp.watch("src/scss/**/*.scss",['mincss']).on("change",browser_sync.reload);
     gulp.watch("src/*.html").on("change",browser_sync.reload);
     gulp.watch("src/js/**/*.js").on("change",browser_sync.reload);
     gulp.watch("src/img/**/*.*").on("change",browser_sync.reload);
     
});

gulp.task('copy', function() {
     gulp.src("./src/*.html").pipe(gulpCopy("dist",{prefix:"1"}));//复制所有HTML文件
     gulp.src("./src/fonts/*").pipe(gulpCopy("dist/fonts",{prefix:"2"}));
     gulp.src("./src/js/**/*.js").pipe(gulpCopy("dist/js",{prefix:"2"}));
     gulp.src("./src/img/**/*.png").pipe(gulpCopy("dist/img",{prefix:"2"}));
     gulp.src("./src/img/**/*.jpg").pipe(gulpCopy("dist/img",{prefix:"2"}));
     gulp.src("./src/img/**/*.gif").pipe(gulpCopy("dist/img",{prefix:"2"}));
     gulp.src("./src/scss/**/*.scss").pipe(gulpCopy("dist/scss",{prefix:"2"}));
     gulp.src("./src/css/**/*.css").pipe(gulpCopy("dist/css",{prefix:"2"}));
//   gulp.src("./src/img/**/*.*").pipe(gulp.dest("dist/image"));
})
gulp.task('copyPic', function() {
     gulp.src("./src/img/**/*.*").pipe(gulp.dest("dist/image"));
})
//定义一键开发模式
gulp.task("dev",["browser_sync"]);

//定义一件生成模式
gulp.task('pro',["minjs","minCss","copy","tinypng"]);

gulp.task('pro_nopic',["minjs","minCss","copy","copyPic"]);