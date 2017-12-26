"use strict";

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	autoprefixer = require('gulp-autoprefixer'),
	// cleanCSS       = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	// concat         = require('gulp-concat'),
	// uglify         = require('gulp-uglify'),//сжимает js

	// mainBowerFiles = require('gulp-main-bower-files'),
	// filter         = require('gulp-filter'),

	// debug          = require("gulp-debug"),
	// sassImportJson = require('gulp-sass-import-json'),
	sourcemaps     = require("gulp-sourcemaps"),
	notify = require('gulp-notify'),//вывод предупреждения об ошибке
	plumber = require('gulp-plumber'),


	tinypng = require('gulp-tinypng'),
	spritesmith = require('gulp.spritesmith'), //делает спрайты
	// gm = require('gulp-gm'), //редактор графики
	imageResize = require('gulp-image-resize'), //изменение разммера картинки

	newer = require('gulp-newer'),//отдает в поток только обновлнные файлы
	// changed 	   = require('gulp-changed'),//отдает в поток только обновлнные файлы
	// newer_sass     = require("gulp-newer-sass"),//отдает в поток только обновлнные файлы

	del = require('del'),
	removeCode = require('gulp-remove-code'), //удаляет код в html, js

	stripHtmlComments = require('gulp-strip-comments'),
	stripCssComments = require('gulp-strip-css-comments'),// удаляет ненужные комменты css

	// zip            = require('gulp-zip'),

	gutil = require('gulp-util'),
	ftp = require('vinyl-ftp'),

	// file           = require('gulp-file'), //создает файлы ???

	wait = require('gulp-wait'), //пауза в таске для галпа. фиксит траблу с потерянными sass

	fs = require('fs'),



	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	svgSprite = require('gulp-svg-sprite'),






	op = require('./options.json');




// const gulp = require('gulp'); // gulp
// const plugins = require('gulp-load-plugins')(); // Автоматическая подгрузка gulp плагинов
// const options = require('./options.js');
// const browserSync = require('browser-sync').create();
// const del = require('del');
// const ftp = require('vinyl-ftp');
// const fs = require('fs');


//for update plagins use "ncu"
//npm update -a/--upgradeAll
//for debug .pipe(debug({title: 'TITLE'}))




gulp.task('server', ['styles', 'pug'], function (cb) {
	browserSync.init({
		server: {
			baseDir: op.path.baseDir
		},
		port: 3000,
		notify: false,
		reloadDelay: 200,
		// tunnel: "olimp" //Demonstration page: http://projectname.localtunnel.me
	});
	cb();
});




gulp.task('styles', function () {
	return gulp.src(['frontend/sass/*.{scss,sass}', 'core/sass/**/*.{scss,sass}'])
		// .pipe(sourcemaps.init())	

		// .pipe(changed('app/css', {extension: '.css'}))
		// .pipe(newer({ dest: dest, ext: '.css', extra: src }))
		// .pipe(newer_sass({ dest: 'app/css' }))

		.pipe(wait(100))

		// .pipe(sassImportJson()) // импорт json с настройками

		.pipe(sass({			
			outputStyle: 'expanded',
			errLogToConsole: true,
		}))
		.on('error', notify.onError({
			title: 'SASS error'
		}))
		//.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer({
			browsers: ['last 15 versions'],
			cascade: false
		}))
		//.pipe(cleanCSS())
		// .pipe(sourcemaps.write())		
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.stream());
});



gulp.task('pug', ["styles"], function build() {
	return gulp.src('frontend/pug/**/*.pug')
		.pipe(plumber())
		.pipe(pug({
			pretty: true,
			basedir: __dirname + '/frontend/pug',
			locals: op,
		}))
		.on('error', notify.onError({
			title: 'PUG error'
		}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.stream());
});




gulp.task('watch', function () {

	gulp.watch(['frontend/**/*.{scss,sass}', 'core/**/*.{scss,sass}'], ['styles']);
	gulp.watch(['frontend/**/*.pug', 'core/**/*.pug'], ['pug']);

	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);

});









// PNG SPRITE
gulp.task('sprite:png', function (cb) {

	var spriteData =
		gulp.src('core/sprites/png/*.{png,jpg}')
			.pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: '_sprite.css',
				cssFormat: 'css',
				imgPath: '../img/sprite.png',
				padding: 10
			}));
		

	spriteData.img.pipe(gulp.dest('app/img/'));
	spriteData.css.pipe(gulp.dest('core/sprites/png/'))
					.pipe(rename({ extname: ".scss" }))
					.pipe(gulp.dest('core/sprites/png/'));

	cb();

});





// SVG SPRITE
gulp.task('sprite:svg', function(){
	return gulp.src('core/sprites/svg/*.svg')
      .pipe(svgmin({
        js2svg: {
          pretty: true
        }
      }))
      .pipe(cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
      }))
      .pipe(replace('&gt;', '>'))
      .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg"
          }
        }
      }))
      .pipe(gulp.dest('app/img/'))
})





// Эта функция оставит указанные коментрии при удалении
function cssCommentNoDel(str) {
	return {
		preserve: function (comment) {
			if ((comment.indexOf(str) + 1)) {
				return true;
			}
		}
	}
}

gulp.task('cleanComm', function () {
	return gulp.src('app/css/*.css')
		.pipe(stripCssComments(cssCommentNoDel('===')))
		.pipe(gulp.dest('dist'));
});








//Удаляет папку "dist" перед сборкой
gulp.task('removedist', function () {
	return del.sync('dist');
});







//Заливка на хостинг
gulp.task('deploy', function () {

	var conn = ftp.create({
		host: 'files.000webhost.com',
		user: 'ferym-forever',
		password: 'q1w2e3r4t5',
		parallel: 10,
		log: gutil.log
	});

	var globs = [
		'app/**'
	];

	return gulp.src(globs, { buffer: false })
		.pipe(conn.dest("/public_html/Olimp"));

});




gulp.task('favResize', function () {
  gulp.src('core/favicon/favicon-base.png')
    .pipe(imageResize({
      width : 114,
      height : 114,
      crop : false,
      upscale : false
    }))
    .pipe(rename("apple-touch-icon-114x114.png"))
    .pipe(gulp.dest('app/img/favicon/'));
  
  gulp.src('core/favicon/favicon-base.png')
    .pipe(imageResize({
      width : 72,
      height : 72,
      crop : false,
      upscale : false
    }))
    .pipe(rename("apple-touch-icon-72x72.png"))
    .pipe(gulp.dest('app/img/favicon/'));    
  
  gulp.src('core/favicon/favicon-base.png')
    .pipe(imageResize({
      width : 57,
      height : 57,
      crop : false,
      upscale : false
    }))
    .pipe(rename("apple-touch-icon.png"))
    .pipe(gulp.dest('app/img/favicon/'));
  
  gulp.src('core/favicon/favicon-base.png')
    .pipe(imageResize({
      width : 48,
      height : 48,
      crop : false,
      upscale : false
    }))
    .pipe(rename("favicon.png"))
    .pipe(gulp.dest('app/img/favicon/'));
});






gulp.task('default', ['server', 'watch']);