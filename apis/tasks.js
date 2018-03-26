var gulp = require('gulp');
var concat = require('gulp-concat'); //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css'); //- 压缩CSS为一行；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var clean = require('gulp-clean');
var merge = require('gulp-merge-json');
var gulpSequence = require('gulp-sequence');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var config = require('./config');

function startAll(list) {
	gulp.task('clean', function() {
		return gulp.src(['./dist', './build'])
			.pipe(clean());
	})
	gulp.start('clean', function() {
		console.log('clean success');
		doAll(list);
	})
	// doAll(list);
}

async function doAll(list) {
	for (var i = 0, len = list.length; i < len; i++) {
		await start(config.config.basePath + '/' + list[i], list[i]);
	}
}

async function start(path, folder) {
	return new Promise(function(resolve, reject) {
		gulp.task('minifyJs', function() {
			console.log(path)
			return gulp.src([`!${path}/**/*.min.js`, `!${path}/**/mui.*.js`, `!${path}/**/*edtap*.js`, `!${path}/**/yjyInit.js`, `!${path}/**/ajaxfileupload.js`, `!${path}/**/calRem.js`, `${path}/**/*.js`])
				.pipe(rev())
				.pipe(gulp.dest(`dist/${folder}`))
				.pipe(rev.manifest({
					merge: true // merge with the existing manifest if one exists
				}))
				.pipe(gulp.dest(`build/${folder}/js`))
		})

		gulp.task('minifyJs-extra', function() {
			return gulp.src([`*://review-formal.iplusmed.com/Common/**/*.js` ,`${path}/**/*.min.js`, `${path}/**/mui.*.js`, `${path}/**/*edtap*.js`, `${path}/**/yjyInit.js`, `${path}/**/calRem.js`, `${path}/**/ajaxfileupload.js`])
				.pipe(gulp.dest(`dist/${folder}`))
		})

		gulp.task('css', function() {
			return gulp.src([`!${path}/**/reset.css`, `!${path}/**/*.min.css`, `!${path}/**/mui.*.css`, `${path}/**/*.css`])
				.pipe(rev())
				.pipe(gulp.dest(`dist/${folder}`))
				.pipe(rev.manifest({
					// merge: true // merge with the existing manifest if one exists
				}))
				.pipe(gulp.dest(`build/${folder}/css`))
		})

		gulp.task('css-extra', function() {
			return gulp.src([`*://review-formal.iplusmed.com/Common/**/*.css`, `${path}/**/reset.css`, `${path}/**/*.min.css`, `${path}/**/mui.*.css`])
				.pipe(gulp.dest(`dist/${folder}`))
		})

		gulp.task('image', function() {
			return gulp.src([`${path}/**/*.png`, `${path}/**/*.jpg`, `${path}/**/*.jpeg`, `${path}/**/*.gif`, `${path}/**/*.bmp`])
				.pipe(gulp.dest(`dist/${folder}`))
		})

		gulp.task('fonts', function() {
			return gulp.src([`${path}/**/*.ttf`])
				.pipe(gulp.dest(`dist/${folder}`))
		})

		gulp.task('json', function() {
			return gulp.src([`${path}/**/*.json`])
				.pipe(gulp.dest(`dist/${folder}`))
		})

		gulp.task('mergeManifest', function() {
			return gulp.src([`build/${folder}/**/*.json`])
				.pipe(merge())
				.pipe(gulp.dest(`build/${folder}/all`))
		})

		gulp.task('pageCollector', function() {
			return gulp.src([`build/${folder}/all/*.json`, `${path}/**/*.html`])
				.pipe(revCollector())
				.pipe(gulp.dest(`dist/${folder}`))
		})

		gulp.task('final', gulpSequence(['minifyJs', 'minifyJs-extra', 'css', 'css-extra', 'image', 'fonts', 'json'],
			'mergeManifest',
			'pageCollector'));

		// gulp.task('final', gulpSequence(['minifyJs']));
		gulp.start('final', function() {
			resolve();
		});
		// gulp.task('default', () => {
		// gulp.start('final');
		// });
	});
}

module.exports.startAll = startAll;
