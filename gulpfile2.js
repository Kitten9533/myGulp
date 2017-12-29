var gulp = require('gulp');
var concat = require('gulp-concat'); //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css'); //- 压缩CSS为一行；
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var clean = require('gulp-clean');
var merge = require('gulp-merge-json');
var gulpSequence = require('gulp-sequence');
var uglify= require('gulp-uglify');  
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');

var baseUrl = './userShop/';
var outUrl = `./dist/${baseUrl}/`;

gulp.task('clean', function() {
    return gulp.src(['./dist/', './rev/'])
        .pipe(clean());
        console.log('TASK: clean over~')
})

gulp.task('css', function() { //- 创建一个名为 concat 的 task
    return gulp.src([`${baseUrl}css/*.css`, '!**/reset.css', '!**/*.min.css']) //- 需要处理的css文件，放到一个字符串数组里
        // .pipe(concat('wap.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss()) //- 压缩处理成一行
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest(`${outUrl}css`)) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/css')); //- 将 rev-manifest.json 保存到 rev 目录内
        console.log('TASK: css over~')
});

gulp.task('cssOther', function() { //- 创建一个名为 concat 的 task
    return gulp.src(['**/reset.css', '**/*.min.css'], {base: '**/*/'}) //- 需要处理的css文件，放到一个字符串数组里
        .pipe(gulp.dest(`${outUrl}css`)) //- 输出文件本地
        console.log('TASK: cssOther over~')
});

gulp.task('fonts', function() {
    return gulp.src([`${baseUrl}fonts/*.ttf`])
        // .pipe(rev())
        .pipe(gulp.dest(`${outUrl}fonts`))
    // .pipe(rev.manifest())
    // .pipe(gulp.dest('./rev/fonts')); 
    console.log('TASK: fonts over~')
})

gulp.task('images', function() {
    return gulp.src(`${baseUrl}img/*`)
        // .pipe(rev())
        .pipe(gulp.dest(`${outUrl}img`))
        // .pipe(rev.manifest())
        // .pipe(gulp.dest('./rev/images'))
        console.log('TASK: images over~')
});

gulp.task('js', function() {
    return gulp.src([`${baseUrl}js/*.js`, '!**/*.min.js', `!${baseUrl}js/*edtap*.js`])
        // .pipe(babel({
        //     presets: ['env']
        // }))
        // .pipe(uglify({  
        //     mangle: true,//类型：Boolean 默认：true 是否修改变量名  
        //     compress: true,//类型：Boolean 默认：true 是否完全压缩  
        //     preserveComments: 'all' //保留所有注释  
        // }))
        .pipe(rev())
        .pipe(gulp.dest(`${outUrl}js`))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'))
        console.log('TASK: js over~')
});

gulp.task('jsOther', function() {
    return gulp.src(['**/*.min.js', `${baseUrl}js/*edtap*.js`], {base: '**/*/'})
        .pipe(gulp.dest(`${outUrl}javaScript`))
        console.log('TASK: jsOther over~')
});

gulp.task('revJson', function(){
    return gulp.src(['./rev/**/*.json'])
        .pipe(merge())
        .pipe(gulp.dest('./rev/all'))
    console.log('TASK: revJson over~')
});

gulp.task('rev-pages-html', function() {
    return gulp.src(['./rev/all/*.json', `${baseUrl}*.html`]) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        // .pipe(revCollector({
        //     replaceReved: true,
        //     dirReplacements: {
        //         'css': '/dist/css',
        //         'javaScript/': '/dist/javaScript/'
        //     }
        // }))
        .pipe(revCollector())
        .pipe(gulp.dest(`${outUrl}`)); //- 替换后的文件输出的目录
        console.log('TASK: rev-pages-html over~')
});

gulp.task('rev-html', function() {
    return gulp.src(['./rev/all/*.json', `${baseUrl}userInfoIndex.html`]) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector()) //- 执行文件内css名的替换
        .pipe(gulp.dest(`${outUrl}`)); //- 替换后的文件输出的目录
        console.log('TASK: rev-html over~')
});

gulp.task('final', gulpSequence('clean', ['css', 'fonts', 'images', 'js', 'cssOther', 'jsOther'], 'revJson', 'rev-pages-html', 'rev-html'));

// gulp.task('final', gulpSequence('clean', 'css'));

gulp.task('default', function() {
    gulp.start('final', function(){
        console.log('ok')
    })
});